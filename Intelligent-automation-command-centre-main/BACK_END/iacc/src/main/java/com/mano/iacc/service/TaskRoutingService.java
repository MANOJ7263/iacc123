package com.mano.iacc.service;

import com.mano.iacc.entity.Task;
import com.mano.iacc.integration.automation.service.RobotFrameworkService;
import com.mano.iacc.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskRoutingService {

    @Autowired
    private RobotFrameworkService robotFrameworkService;

    @Autowired
    private TaskRepository taskRepository;

    public Task processTaskSubmission(Task task) {
        // Simple "AI" Keyword Logic
        String description = task.getDescription().toLowerCase();

        // AI Classification Logic
        if (description.contains("report") || description.contains("analytics")) {
            task.setAiClassification("Data Processing");
            task.setAssignedBotType("REPORT_BOT");
            task.setRiskLevel("LOW");
        } else if (description.contains("scholarship") || description.contains("grant")) {
            task.setAiClassification("Financial Aid");
            task.setAssignedBotType("APPROVAL_BOT");
            task.setRiskLevel("MEDIUM");
        } else if (description.contains("audit") || description.contains("compliance")) {
            task.setAiClassification("Audit Check");
            task.setAssignedBotType("COMPLIANCE_BOT");
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
            robotFrameworkService.startJob(savedTask.getAssignedBotType());
        }

        return savedTask;
    }
}
