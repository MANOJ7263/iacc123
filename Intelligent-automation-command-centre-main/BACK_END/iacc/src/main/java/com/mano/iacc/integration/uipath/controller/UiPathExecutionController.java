package com.mano.iacc.integration.uipath.controller;

import com.mano.iacc.integration.uipath.service.UiPathJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/integrations/uipath")
public class UiPathExecutionController {

    private final UiPathJobService jobService;

    public UiPathExecutionController(UiPathJobService jobService) {
        this.jobService = jobService;
    }

    // ✅ GET works (you already confirmed this)
    @GetMapping("/whoami")
    public ResponseEntity<String> whoami() {
        return ResponseEntity.ok("ROLE_ADMIN");
    }

    // ✅ THIS is the critical part
    @PostMapping(
            value = "/trigger",
            consumes = "application/json"
    )
    public ResponseEntity<String> triggerJob() {

        jobService.startJob("IACC_Invoice_Generator");

        return ResponseEntity.ok("UiPath job triggered successfully");
    }
}
