package com.mano.iacc.ai.controller;

import com.mano.iacc.ai.dto.AiRequest;
import com.mano.iacc.ai.dto.AiResponse;
import com.mano.iacc.ai.service.AiMappingService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiMappingController {

    private final AiMappingService aiService;

    public AiMappingController(AiMappingService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/map")
    public AiResponse map(@RequestBody AiRequest request) {
        return aiService.mapTextToAutomation(request.getText());
    }
}