package com.mano.iacc.automations.execution.service;

import com.mano.iacc.automations.execution.entity.AutomationExecution;
import com.mano.iacc.automations.execution.repository.AutomationExecutionRepository;
import com.mano.iacc.integration.uipath.service.UiPathJobService;
import org.springframework.stereotype.Service;

@Service
public class AutomationExecutionService {

    private final AutomationExecutionRepository repository;
    private final UiPathJobService uiPathJobService;

    public AutomationExecutionService(AutomationExecutionRepository repository,
                                      UiPathJobService uiPathJobService) {
        this.repository = repository;
        this.uiPathJobService = uiPathJobService;
    }

    public AutomationExecution createAndTrigger(String processName) {

        // 1️⃣ Create execution
        AutomationExecution execution = new AutomationExecution();
        execution.setStatus("PENDING");
        execution = repository.save(execution);

        // 2️⃣ Trigger UiPath
        uiPathJobService.startJob(processName);

        // 3️⃣ Update status
        execution.setStatus("RUNNING");
        return repository.save(execution);
    }
}
