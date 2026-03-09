package com.mano.iacc.automations.repository;

import com.mano.iacc.automations.entity.AutomationDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutomationDefinitionRepository
        extends JpaRepository<AutomationDefinition, Long> {
}
