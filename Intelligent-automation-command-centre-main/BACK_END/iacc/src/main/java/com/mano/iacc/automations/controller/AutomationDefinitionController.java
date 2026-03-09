package com.mano.iacc.automations.controller;

import com.mano.iacc.automations.entity.AutomationDefinition;
import com.mano.iacc.automations.service.AutomationDefinitionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/automations")
public class AutomationDefinitionController {

    private final AutomationDefinitionService service;

    public AutomationDefinitionController(AutomationDefinitionService service) {
        this.service = service;
    }

    // 🔐 ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public AutomationDefinition create(@RequestBody AutomationDefinition automation) {
        return service.create(automation);
    }

    // 🔐 ADMIN ONLY
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<AutomationDefinition> getAll() {
        return service.getAll();
    }
}
