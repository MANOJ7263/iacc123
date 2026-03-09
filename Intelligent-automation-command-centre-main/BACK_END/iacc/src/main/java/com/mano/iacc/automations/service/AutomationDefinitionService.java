package com.mano.iacc.automations.service;

import com.mano.iacc.automations.entity.AutomationDefinition;
import com.mano.iacc.automations.repository.AutomationDefinitionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AutomationDefinitionService {

    private final AutomationDefinitionRepository repository;

    public AutomationDefinitionService(AutomationDefinitionRepository repository) {
        this.repository = repository;
    }

    public AutomationDefinition create(AutomationDefinition automation) {
        return repository.save(automation);
    }

    public List<AutomationDefinition> getAll() {
        return repository.findAll();
    }
}
