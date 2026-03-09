package com.mano.iacc.automations.execution.controller;

import com.mano.iacc.automations.execution.entity.AutomationExecution;
import com.mano.iacc.automations.execution.service.AutomationExecutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/executions")
public class AutomationExecutionController {

    private final AutomationExecutionService service;

    public AutomationExecutionController(AutomationExecutionService service) {
        this.service = service;
    }

    @PostMapping("/trigger")
    public ResponseEntity<AutomationExecution> trigger() {

        AutomationExecution execution =
                service.createAndTrigger("YOUR_UIPATH_PROCESS_NAME");

        return ResponseEntity.ok(execution);
    }
}
