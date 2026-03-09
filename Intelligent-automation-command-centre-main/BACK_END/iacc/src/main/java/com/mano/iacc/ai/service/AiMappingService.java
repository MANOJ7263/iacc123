package com.mano.iacc.ai.service;

import com.mano.iacc.ai.dto.AiResponse;
import com.mano.iacc.automations.entity.AutomationDefinition;
import com.mano.iacc.automations.repository.AutomationDefinitionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiMappingService {

    private final AutomationDefinitionRepository automationRepo;

    public AiMappingService(AutomationDefinitionRepository automationRepo) {
        this.automationRepo = automationRepo;
    }

    public AiResponse mapTextToAutomation(String text) {

        String normalized = text.toLowerCase();

        // Fetch all ACTIVE automations
        List<AutomationDefinition> automations =
                automationRepo.findAll();

        for (AutomationDefinition automation : automations) {

            if (!"ACTIVE".equalsIgnoreCase(automation.getStatus())) {
                continue;
            }

            // Simple keyword matching (rule-based AI)
            if (
                    normalized.contains("invoice")
                            && automation.getCode().contains("INVOICE")
            ) {
                return new AiResponse(
                        true,
                        automation.getCode(),
                        automation.getName(),
                        0.85
                );
            }

            if (
                    normalized.contains("report")
                            && automation.getCode().contains("REPORT")
            ) {
                return new AiResponse(
                        true,
                        automation.getCode(),
                        automation.getName(),
                        0.80
                );
            }
        }

        // No match found
        return new AiResponse(false, null, null, 0.0);
    }
}