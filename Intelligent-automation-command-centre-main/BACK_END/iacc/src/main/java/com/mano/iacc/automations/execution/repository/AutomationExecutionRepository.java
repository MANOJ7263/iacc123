package com.mano.iacc.automations.execution.repository;

import com.mano.iacc.automations.execution.entity.AutomationExecution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AutomationExecutionRepository
        extends JpaRepository<AutomationExecution, Long> {

    List<AutomationExecution> findByRequestedBy(Long requestedBy);

    List<AutomationExecution> findByAutomationId(Long automationId);
}