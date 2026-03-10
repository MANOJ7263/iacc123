package com.mano.iacc.integration.automation.service;

import com.mano.iacc.entity.AutomationJob;
import com.mano.iacc.entity.Task;
import com.mano.iacc.repository.AutomationJobRepository;
import com.mano.iacc.repository.TaskRepository;
import com.mano.iacc.service.GovernanceAuditService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AutomationSyncService {

    private static final Logger log = LoggerFactory.getLogger(AutomationSyncService.class);

    private final AutomationJobRepository jobRepository;
    private final TaskRepository taskRepository;
    private final RobotFrameworkService robotService;
    private final GovernanceAuditService auditService;

    public AutomationSyncService(AutomationJobRepository jobRepository,
            TaskRepository taskRepository,
            RobotFrameworkService robotService,
            GovernanceAuditService auditService) {
        this.jobRepository = jobRepository;
        this.taskRepository = taskRepository;
        this.robotService = robotService;
        this.auditService = auditService;
    }

    /**
     * Polls the Python Automation Engine every 10 seconds
     * for all jobs currently marked as 'RUNNING'.
     */
    @Scheduled(fixedRate = 10000)
    @Transactional
    public void syncAutomationJobs() {
        List<AutomationJob> runningJobs = jobRepository.findAll().stream()
                .filter(job -> "RUNNING".equalsIgnoreCase(job.getStatus()))
                .toList();

        if (runningJobs.isEmpty()) {
            return; // Nothing to sync
        }

        log.debug("Found {} running automation jobs. Polling for status updates...", runningJobs.size());

        for (AutomationJob job : runningJobs) {
            try {
                String currentStatus = robotService.getJobStatus(job.getBotId());

                if ("COMPLETED".equalsIgnoreCase(currentStatus) || "FAILED".equalsIgnoreCase(currentStatus)) {
                    log.info("Job {} Status Changed: RUNNING -> {}", job.getBotId(), currentStatus);

                    // Update Job Entity
                    job.setStatus(currentStatus.toUpperCase());
                    job.setEndTime(LocalDateTime.now());
                    job.setLogs("Job " + currentStatus + " via Local Robot Framework.");
                    jobRepository.save(job);

                    // Update Parent Task Entity
                    Task parentTask = job.getTask();
                    if (parentTask != null) {
                        String oldTaskStatus = parentTask.getStatus();
                        parentTask.setStatus(currentStatus.toUpperCase()); // Either COMPLETED or FAILED
                        taskRepository.save(parentTask);

                        // Trigger Governance Audit Log
                        auditService.logTaskStatusChange(
                                parentTask.getId(),
                                oldTaskStatus,
                                currentStatus.toUpperCase(),
                                "SYSTEM_AUTO_SYNC",
                                "Automation bot finished execution with status: " + currentStatus);
                    }
                }
            } catch (Exception e) {
                log.error("Error syncing status for Job ID: " + job.getBotId(), e);
            }
        }
    }
}
