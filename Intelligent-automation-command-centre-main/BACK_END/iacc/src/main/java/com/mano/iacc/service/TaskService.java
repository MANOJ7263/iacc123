package com.mano.iacc.service;

import com.mano.iacc.entity.AutomationJob;
import com.mano.iacc.entity.Task;
import com.mano.iacc.integration.uipath.service.UiPathJobService;
import com.mano.iacc.repository.AutomationJobRepository;
import com.mano.iacc.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final PredictiveEngineService predictiveEngine;
    private final UiPathJobService uiPathService;
    private final AutomationJobRepository automationJobRepository;

    public TaskService(TaskRepository taskRepository,
            PredictiveEngineService predictiveEngine,
            UiPathJobService uiPathService,
            AutomationJobRepository automationJobRepository) {
        this.taskRepository = taskRepository;
        this.predictiveEngine = predictiveEngine;
        this.uiPathService = uiPathService;
        this.automationJobRepository = automationJobRepository;
    }

    @Transactional
    public Task createTask(Task task) {
        // 1. NLP Simulation (Intent Detection)
        if (task.getTitle() != null) {
            String lower = task.getTitle().toLowerCase();
            if (lower.contains("report")) {
                task.setAiClassification("GENERATING_REPORT");
                task.setAssignedBotType("REPORT_BOT");
            } else if (lower.contains("send") || lower.contains("email")) {
                task.setAiClassification("COMMUNICATION");
                task.setAssignedBotType("EMAIL_BOT");
            }
        }

        // 2. Predictive Risk Analysis
        var riskReport = predictiveEngine.analyzeRisk(task);
        task.setRiskLevel(riskReport.level().name());
        task.setRisk_reason(String.join(", ", riskReport.reasons()));

        // Save Task
        task.setStatus("PENDING");
        Task savedTask = taskRepository.save(task);

        // 3. Trigger Automation if applicable
        if (task.getAssignedBotType() != null) {
            triggerAutomation(savedTask);
        }

        return savedTask;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    private void triggerAutomation(Task task) {
        try {
            // Start Job
            String jobKey = uiPathService.startJob(task.getAssignedBotType());

            // Log Job
            // Log Job
            AutomationJob job = new AutomationJob();
            job.setTask(task);
            job.setBotId(jobKey);
            job.setStatus("PENDING");
            job.setStartTime(LocalDateTime.now());
            job.setLogs("Job initiated via UiPath Orchestrator");

            automationJobRepository.save(job);

            // Update Task Status
            task.setStatus("IN_PROGRESS");
            taskRepository.save(task);

        } catch (Exception e) {
            AutomationJob errorJob = new AutomationJob();
            errorJob.setTask(task);
            errorJob.setStatus("FAILED");
            errorJob.setStartTime(LocalDateTime.now());
            errorJob.setLogs("Failed to start job: " + e.getMessage());

            automationJobRepository.save(errorJob);
        }
    }

    // --- New Operational Methods ---

    @Transactional
    public Task approveTask(Long taskId, String decision, String reason, String username) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if ("APPROVE".equalsIgnoreCase(decision)) {
            task.setStatus("APPROVED");
            // Automatically trigger automation if applicable after approval
            if (task.getAssignedBotType() != null && !task.getAssignedBotType().equals("Manual_Queue")) {
                triggerAutomation(task);
            }
        } else {
            task.setStatus("REJECTED");
        }

        // You might want to store approval details in AuditLog or Task fields
        // task.setApprovedBy(username);
        // task.setRejectionReason(reason);

        return taskRepository.save(task);
    }

    @Transactional
    public Task escalateTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setPriority("HIGH");
        task.setRiskLevel("HIGH");
        task.setStatus("ESCALATED");

        return taskRepository.save(task);
    }

    public List<Task> getMyTasks(Long userId) {
        return taskRepository.findByCreatedBy_Id(userId);
    }

    public java.util.Map<String, Object> getCollectorSummary() {
        java.util.Map<String, Object> summary = new java.util.HashMap<>();
        summary.put("totalTasks", taskRepository.count());
        summary.put("pendingTasks", taskRepository.countByStatus("PENDING"));
        summary.put("completedTasks", taskRepository.countByStatus("COMPLETED"));
        summary.put("highRiskTasks", taskRepository.countByRiskLevel("HIGH"));
        return summary;
    }
}
