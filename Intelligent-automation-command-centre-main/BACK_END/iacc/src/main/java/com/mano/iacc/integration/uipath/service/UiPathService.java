package com.mano.iacc.integration.uipath.service;

import com.mano.iacc.entity.Task;
import com.mano.iacc.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class UiPathService {

    private static final Logger logger = LoggerFactory.getLogger(UiPathService.class);

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UiPathJobService uiPathJobService;

    public void triggerBot(Task task) {
        if (task.getReleaseKey() == null || task.getReleaseKey().isEmpty()) {
            logger.warn("No Release Key found for Task ID: {}", task.getId());
            return;
        }

        logger.info("Triggering UiPath Bot for Task ID: {} with Release Key: {}", task.getId(), task.getReleaseKey());

        // Call Real UiPath Service
        String jobKey = uiPathJobService.startJob(task.getReleaseKey());

        if (jobKey != null) {
            task.setUipathJobKey(jobKey);
            task.setUipathJobStatus("Pending"); // Initial status
            taskRepository.save(task);
            logger.info("UiPath Job Started. Job Key: {}", jobKey);
        } else {
            logger.error("Failed to start UiPath Job for Task ID: {}", task.getId());
            task.setUipathJobStatus("Start Failed");
            taskRepository.save(task);
        }
    }

    // Poll for status updates (e.g., every 30 seconds)
    @org.springframework.scheduling.annotation.Scheduled(fixedRate = 30000)
    public void updateJobStatuses() {
        // Find tasks with running jobs
        // This requires a custom query or filtering in memory.
        // For efficiency, we should have a method findByUipathJobStatusIn(List<String>
        // statuses)
        // Assuming we fetch all for now or add the method to repository

        // Let's filter in memory for simplicity if list is small, or just add the repo
        // method later.
        java.util.List<Task> tasks = taskRepository.findAll();

        for (Task task : tasks) {
            if (task.getUipathJobKey() != null &&
                    !"Successful".equalsIgnoreCase(task.getUipathJobStatus()) &&
                    !"Faulted".equalsIgnoreCase(task.getUipathJobStatus()) &&
                    !"Stopped".equalsIgnoreCase(task.getUipathJobStatus())) {

                String status = uiPathJobService.getJobStatus(task.getUipathJobKey());
                if (!"Unknown".equals(status) && !status.equals(task.getUipathJobStatus())) {
                    task.setUipathJobStatus(status);

                    if ("Successful".equalsIgnoreCase(status)) {
                        task.setStatus("COMPLETED");
                    } else if ("Faulted".equalsIgnoreCase(status)) {
                        task.setStatus("FAILED");
                    }

                    taskRepository.save(task);
                    logger.info("Updated Task ID: {} Status to: {}", task.getId(), status);
                }
            }
        }
    }

    /*
     * private void mockBotExecution(Task task) {
     * // ... Removed Mock Logic ...
     * }
     */
}
