package com.mano.iacc.service;

import com.mano.iacc.entity.Task;
import com.mano.iacc.integration.uipath.service.UiPathService;
import com.mano.iacc.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskRoutingService {

    @Autowired
    private UiPathService uiPathService;

    @Autowired
    private TaskRepository taskRepository;

    public Task processTaskSubmission(Task task) {
        // Simple "AI" Keyword Logic
        String description = task.getDescription().toLowerCase();

        // AI Classification Logic
        if (description.contains("report") || description.contains("analytics")) {
            task.setAiClassification("Data Processing");
            task.setAssignedBotType("UiPath_Bot_01");
            task.setReleaseKey("rt_512A1634BA1032862612977DE918BD4AF4E4C365C48D319A6383F49D0FBC49E6-1");
            task.setRiskLevel("LOW");
        } else if (description.contains("scholarship") || description.contains("grant")) {
            task.setAiClassification("Financial Aid");
            task.setAssignedBotType("UiPath_Bot_02");
            task.setRiskLevel("MEDIUM");
        } else if (description.contains("audit") || description.contains("compliance")) {
            task.setAiClassification("Audit Check");
            task.setAssignedBotType("UiPath_Bot_03");
            task.setRiskLevel("HIGH");
            task.setRisk_reason("Audit tasks require manual approval.");
        } else {
            task.setAiClassification("General Inquiry");
            task.setAssignedBotType("Manual_Queue");
            task.setRiskLevel("LOW");
        }

        // Set status based on risk
        if ("HIGH".equals(task.getRiskLevel())) {
            task.setStatus("PENDING_APPROVAL");
        } else {
            // Auto-trigger bot for low risk
            task.setStatus("RUNNING");
        }

        // Save initial classification
        Task savedTask = taskRepository.save(task);

        // Trigger bot if applicable and safe
        if (!"Manual_Queue".equals(task.getAssignedBotType()) && !"PENDING_APPROVAL".equals(task.getStatus())) {
            uiPathService.triggerBot(savedTask);
        }

        return savedTask;
    }
}
