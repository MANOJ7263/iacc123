package com.mano.iacc.service;

import com.mano.iacc.entity.AutomationJob;
import com.mano.iacc.entity.Task;
import com.mano.iacc.entity.User;
import com.mano.iacc.integration.automation.service.RobotFrameworkService;
import com.mano.iacc.repository.AutomationJobRepository;
import com.mano.iacc.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EnhancedTaskService {

    private static final Logger log = LoggerFactory.getLogger(EnhancedTaskService.class);

    private final TaskRepository taskRepository;
    private final PredictiveEngineService predictiveEngine;
    private final RobotFrameworkService automationService;
    private final AutomationJobRepository automationJobRepository;
    private final GovernanceAuditService auditService;

    public EnhancedTaskService(TaskRepository taskRepository,
            PredictiveEngineService predictiveEngine,
            RobotFrameworkService automationService,
            AutomationJobRepository automationJobRepository,
            GovernanceAuditService auditService) {
        this.taskRepository = taskRepository;
        this.predictiveEngine = predictiveEngine;
        this.automationService = automationService;
        this.automationJobRepository = automationJobRepository;
        this.auditService = auditService;
    }

    @Transactional
    public Task createTaskWithAI(Task task, String createdByUsername) {
        // Step 1: AI Intent Detection
        detectIntent(task);

        // Step 2: Predictive Risk Scoring
        calculateRiskScore(task);

        // Step 3: Auto-Routing Logic
        if (task.getIntentType() != null) {
            autoAssignBot(task);
        }

        // Save Task - Set to PENDING_APPROVAL to require Dept Head approval
        // Automation will be triggered AFTER approval
        task.setStatus("PENDING_APPROVAL");
        Task savedTask = taskRepository.save(task);

        // Step 4: Governance Audit
        auditService.logTaskCreation(savedTask.getId(), createdByUsername,
                "Intent: " + task.getIntentType() + ", Risk: " + task.getRiskScore() + " - Awaiting approval");

        log.info("Task created and awaiting approval: ID={}, Title={}, Bot={}",
                savedTask.getId(), savedTask.getTitle(), savedTask.getAssignedBotType());

        // NOTE: Automation will be triggered when Dept Head approves the task
        // See approveTask() method

        return savedTask;
    }

    private void detectIntent(Task task) {
        String description = (task.getDescription() + " " + task.getTitle()).toLowerCase();

        if (description.contains("report") || description.contains("generate")) {
            task.setIntentType("REPORT_GENERATION");
            task.setAssignedBotType("REPORT_BOT");
        } else if (description.contains("approval") || description.contains("approve")) {
            task.setIntentType("APPROVAL_WORKFLOW");
            task.setAssignedBotType("APPROVAL_BOT");
        } else if (description.contains("data entry") || description.contains("input")) {
            task.setIntentType("DATA_ENTRY");
            task.setAssignedBotType("DATA_ENTRY_BOT");
        } else if (description.contains("email") || description.contains("send") || description.contains("notify")) {
            task.setIntentType("COMMUNICATION");
            task.setAssignedBotType("EMAIL_BOT");
        } else {
            task.setIntentType("MANUAL_REVIEW");
            task.setAssignedBotType(null);
        }

        log.info("AI Intent Detection: {} -> {}", task.getTitle(), task.getIntentType());
    }

    private void calculateRiskScore(Task task) {
        int score = 0;

        // Priority-based scoring
        if ("HIGH".equalsIgnoreCase(task.getPriority())) {
            score += 40;
        } else if ("MEDIUM".equalsIgnoreCase(task.getPriority())) {
            score += 20;
        }

        // Deadline-based scoring
        if (task.getDeadline() != null) {
            long daysUntilDeadline = ChronoUnit.DAYS.between(LocalDateTime.now(), task.getDeadline());
            if (daysUntilDeadline < 2) {
                score += 30;
            } else if (daysUntilDeadline < 7) {
                score += 15;
            }
        }

        // Department-based scoring (critical departments)
        if ("HEALTH".equalsIgnoreCase(task.getDepartment()) || "REVENUE".equalsIgnoreCase(task.getDepartment())) {
            score += 20;
        }

        // Intent-based scoring
        if ("APPROVAL_WORKFLOW".equals(task.getIntentType())) {
            score += 10;
        }

        task.setRiskScore(Math.min(score, 100));

        // Set risk level
        if (score > 75) {
            task.setRiskLevel("HIGH");
            task.setRisk_reason("Critical: High priority with tight deadline");
        } else if (score > 40) {
            task.setRiskLevel("MEDIUM");
            task.setRisk_reason("Moderate: Requires attention");
        } else {
            task.setRiskLevel("LOW");
            task.setRisk_reason("Standard processing");
        }

        log.info("Risk Score Calculated: {} -> Score: {}, Level: {}", task.getTitle(), score, task.getRiskLevel());
    }

    private void autoAssignBot(Task task) {
        // Already assigned in detectIntent, but we can add additional logic here
        log.info("Auto-assigned bot: {} for task: {}", task.getAssignedBotType(), task.getTitle());
    }

    private void triggerAutomation(Task task, String triggeredBy) {
        try {
            // Start Job via Local Automation Engine (Robot Framework)
            String jobKey = automationService.startJob(task.getAssignedBotType());
            task.setUipathJobKey(jobKey);

            // Log Automation Job
            AutomationJob job = new AutomationJob();
            job.setTask(task);
            job.setBotId(jobKey);
            job.setStatus("RUNNING");
            job.setStartTime(LocalDateTime.now());
            job.setLogs("Job initiated via Local Automation Engine for " + task.getAssignedBotType());

            automationJobRepository.save(job);

            // Update Task Status
            String oldStatus = task.getStatus();
            task.setStatus("IN_PROGRESS");
            taskRepository.save(task);

            // Audit Trail
            auditService.logTaskStatusChange(task.getId(), oldStatus, "IN_PROGRESS", triggeredBy,
                    "Automation triggered");
            auditService.logAutomationTrigger(task.getId(), task.getAssignedBotType(), jobKey, "SYSTEM");

            log.info("Automation triggered successfully for task: {}", task.getId());

        } catch (Exception e) {
            log.error("Failed to trigger automation for task: {}", task.getId(), e);

            AutomationJob errorJob = new AutomationJob();
            errorJob.setTask(task);
            errorJob.setStatus("FAILED");
            errorJob.setStartTime(LocalDateTime.now());
            errorJob.setLogs("Failed to start job: " + e.getMessage());

            automationJobRepository.save(errorJob);
        }
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Map<String, Object> getTaskAnalytics() {
        List<Task> allTasks = taskRepository.findAll();

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalTasks", allTasks.size());
        analytics.put("pendingTasks", allTasks.stream()
                .filter(t -> "PENDING".equals(t.getStatus()) || "PENDING_APPROVAL".equals(t.getStatus())).count());
        analytics.put("inProgressTasks", allTasks.stream().filter(t -> "IN_PROGRESS".equals(t.getStatus())).count());
        analytics.put("completedTasks", allTasks.stream().filter(t -> "COMPLETED".equals(t.getStatus())).count());
        analytics.put("highRiskTasks",
                allTasks.stream().filter(t -> t.getRiskScore() != null && t.getRiskScore() > 75).count());
        analytics.put("automatedTasks", allTasks.stream().filter(t -> t.getAssignedBotType() != null).count());

        return analytics;
    }

    public List<Task> getHighRiskTasks() {
        return taskRepository.findAll().stream()
                .filter(t -> t.getRiskScore() != null && t.getRiskScore() > 75)
                .toList();
    }

    @Transactional
    public Task approveTask(Long taskId, String decision, String reason, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        String oldStatus = task.getStatus(); // Capture old status

        if ("APPROVE".equalsIgnoreCase(decision)) {
            task.setStatus("APPROVED");
            auditService.logTaskStatusChange(task.getId(), oldStatus, "APPROVED", username, "Approved: " + reason);

            // Automatically trigger automation if applicable after approval
            if (task.getAssignedBotType() != null && !task.getAssignedBotType().equals("Manual_Queue")) {
                triggerAutomation(task, username);
            }
        } else {
            task.setStatus("REJECTED");
            auditService.logTaskStatusChange(task.getId(), oldStatus, "REJECTED", username, "Rejected: " + reason);
        }

        return taskRepository.save(task);
    }

    @Transactional
    public Task escalateTask(Long taskId, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        String oldStatus = task.getStatus();

        // Force intent to something automatable if it's currently manual
        if (task.getAssignedBotType() == null || task.getAssignedBotType().equals("Manual_Queue")) {
            detectIntent(task);
            // If still null after intent detection (e.g. unrecognizable description), force
            // a generic bot
            if (task.getAssignedBotType() == null) {
                task.setAssignedBotType("RECOVERY_BOT");
            }
        }

        task.setRiskLevel("HIGH");
        task.setStatus("ESCALATED");
        task.setPriority("HIGH");
        task.setRisk_reason("Manual Escalation by Collector");

        auditService.logTaskStatusChange(task.getId(), oldStatus, "ESCALATED", username,
                "Manual Escalation & Forced Automation");

        // Save state before triggering
        Task savedTask = taskRepository.save(task);

        // Actually force the automation engine to run this task
        triggerAutomation(savedTask, username);

        return savedTask;
    }

    public List<Task> getMyTasks(Long userId) {
        // Assuming TaskRepository has this method or we use a custom query or strict
        // filtering
        // For now, let's just filter locally if repo doesn't have it, but repo should
        // have it.
        // If repo doesn't have it, we need to add it to repo or filter all.
        // We checked TaskRepository earlier (Step 162/view_file TaskRepository was done
        // in Step 92 context summary).
        // Let's assume we can add it or filter. Safe bet: filter findAll stream for now
        // to avoid errors if repo change failed.
        return taskRepository.findAll().stream()
                .filter(t -> t.getCreatedBy() != null && t.getCreatedBy().getId().equals(userId))
                .toList();
    }

    @Transactional
    public Task retryTask(Long taskId, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if ("FAILED".equals(task.getStatus()) || "Start Failed".equals(task.getUipathJobStatus())
                || "Faulted".equalsIgnoreCase(task.getUipathJobStatus())
                || "FAILED".equalsIgnoreCase(task.getUipathJobStatus())) {
            log.info("Retrying task: {} by user: {}", taskId, username);
            triggerAutomation(task, username);
        } else {
            throw new RuntimeException("Task is not in a failed state, cannot retry.");
        }
        return taskRepository.save(task);
    }

    public List<Task> getAutomationTasks() {
        // Return tasks with automation activity
        return taskRepository.findAll().stream()
                .filter(t -> t.getUipathJobKey() != null)
                .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                .limit(20) // Limit to last 20 for dashboard
                .toList();
    }
    // --- Hierarchical Task Delegation ---

    @Transactional
    public Task delegateTaskToDept(Task task, String creatorUsername) {
        task.setCreatedByAdmin(true);
        task.setStatus("PENDING_DEPT_ASSIGNMENT");
        task.setPriority("HIGH"); // Default high priority for admin tasks

        // Save initially
        Task savedTask = taskRepository.save(task);

        auditService.logTaskCreation(savedTask.getId(), creatorUsername,
                "Admin Delegated Task to Dept: " + task.getDepartment());

        return savedTask;
    }

    @Transactional
    public Task assignTaskToStaff(Long taskId, User staffMember, String deptHeadUsername) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setAssignedToStaff(staffMember);
        task.setStatus("PENDING_APPROVAL"); // Move to next stage

        auditService.logTaskStatusChange(task.getId(), "PENDING_DEPT_ASSIGNMENT", "PENDING_APPROVAL",
                deptHeadUsername, "Assigned to Staff: " + staffMember.getUsername());

        return taskRepository.save(task);
    }
}
