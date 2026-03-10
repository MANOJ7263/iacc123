package com.mano.iacc.automations.execution.service;

import com.mano.iacc.automations.execution.entity.AutomationExecution;
import com.mano.iacc.automations.execution.repository.AutomationExecutionRepository;
import com.mano.iacc.integration.automation.service.RobotFrameworkService;
import org.springframework.stereotype.Service;

@Service
public class AutomationExecutionService {

    private final AutomationExecutionRepository repository;
    private final RobotFrameworkService robotFrameworkService;

    public AutomationExecutionService(AutomationExecutionRepository repository,
            RobotFrameworkService robotFrameworkService) {
        this.repository = repository;
        this.robotFrameworkService = robotFrameworkService;
    }

    public AutomationExecution createAndTrigger(String processName) {

        // 1️⃣ Create execution record
        AutomationExecution execution = new AutomationExecution();
        execution.setStatus("PENDING");
        execution = repository.save(execution);

        // 2️⃣ Trigger via Robot Framework local engine
        robotFrameworkService.startJob(processName);

        // 3️⃣ Update status
        execution.setStatus("RUNNING");
        return repository.save(execution);
    }
}
