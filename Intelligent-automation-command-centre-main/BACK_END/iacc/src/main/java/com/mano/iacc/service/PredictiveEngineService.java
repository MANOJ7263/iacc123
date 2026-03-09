package com.mano.iacc.service;

import com.mano.iacc.entity.Task;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class PredictiveEngineService {

    public enum RiskLevel {
        LOW, MEDIUM, HIGH
    }

    public record RiskReport(RiskLevel level, List<String> reasons) {
    }

    public RiskReport analyzeRisk(Task task) {
        List<String> reasons = new ArrayList<>();
        RiskLevel level = RiskLevel.LOW;

        // 1. Deadline Analysis
        if (task.getDeadline() != null) {
            LocalDateTime now = LocalDateTime.now();
            long totalDuration = ChronoUnit.MINUTES.between(task.getCreatedAt(), task.getDeadline());
            long remainingTime = ChronoUnit.MINUTES.between(now, task.getDeadline());

            // If we have less than 10% of time left, it's HIGH risk
            if (remainingTime < (totalDuration * 0.1)) {
                level = RiskLevel.HIGH;
                reasons.add("ETA is critical: Less than 10% of time remaining.");
            } else if (remainingTime < (totalDuration * 0.3)) {
                if (level != RiskLevel.HIGH)
                    level = RiskLevel.MEDIUM;
                reasons.add("ETA is approaching: Less than 30% of time remaining.");
            }
        }

        // 2. Input File Check (Simulation)
        // In a real scenario, we'd check if attachments exists.
        // Here we simulate checking description for "missing files" keyword or absence
        // of "attached"
        String description = task.getDescription().toLowerCase();
        if (description.contains("missing file") || description.contains("pending docs")) {
            level = RiskLevel.HIGH;
            reasons.add("Critical input files are reported missing.");
        }

        // 3. AI Classification Confidence (Mock)
        // If AI was unsure (we can simulate this if we had a confidence score, using
        // description length for now)
        if (task.getAiClassification() != null && task.getDescription().length() < 20) {
            reasons.add("Low confidence in AI classification due to short description.");
            if (level == RiskLevel.LOW)
                level = RiskLevel.MEDIUM;
        }

        return new RiskReport(level, reasons);
    }
}
