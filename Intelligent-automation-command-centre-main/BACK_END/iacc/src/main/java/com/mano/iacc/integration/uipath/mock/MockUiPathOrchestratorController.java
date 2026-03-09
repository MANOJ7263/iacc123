package com.mano.iacc.integration.uipath.mock;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/mock-orchestrator")
public class MockUiPathOrchestratorController {

    private final Map<String, MockJob> jobStore = new ConcurrentHashMap<>();

    record MockJob(String key, String state, String releaseKey, LocalDateTime startTime) {
    }

    // 1. Authenticate (Mock)
    @PostMapping("/api/account/authenticate")
    public ResponseEntity<Map<String, String>> authenticate() {
        return ResponseEntity.ok(Map.of(
                "result", "mock-jwt-token-12345",
                "targetUrl", "http://localhost:8080/api/mock-orchestrator"));
    }

    // 2. Start Job
    @PostMapping("/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs")
    public ResponseEntity<Map<String, Object>> startJob(@RequestBody Map<String, Object> payload) {
        String key = UUID.randomUUID().toString();
        Map<String, Object> startInfo = (Map<String, Object>) payload.get("startInfo");
        String releaseKey = (String) startInfo.get("ReleaseKey");

        jobStore.put(key, new MockJob(key, "Pending", releaseKey, LocalDateTime.now()));

        return ResponseEntity.status(201).body(Map.of(
                "value", Array.of(Map.of(
                        "Key", key,
                        "State", "Pending",
                        "ReleaseName", "Mock Process"))));
    }

    // 3. Get Job Status
    @GetMapping("/odata/Jobs({key})")
    public ResponseEntity<Map<String, Object>> getJob(@PathVariable String key) {
        MockJob job = jobStore.get(key);
        if (job == null)
            return ResponseEntity.notFound().build();

        // Simulate State Progression
        String currentState = job.state();
        long secondsElapsed = java.time.temporal.ChronoUnit.SECONDS.between(job.startTime(), LocalDateTime.now());

        if (secondsElapsed > 10)
            currentState = "Successful";
        else if (secondsElapsed > 2)
            currentState = "Running";

        // Update store (optional for this simple mock, effectively stateless logic
        // based on time)
        jobStore.put(key, new MockJob(key, currentState, job.releaseKey(), job.startTime()));

        return ResponseEntity.ok(Map.of(
                "Key", key,
                "State", currentState,
                "Info", "Simulated status based on time elapsed."));
    }

    // Helper for "value": [...] structure
    static class Array {
        public static <T> java.util.List<T> of(T item) {
            return java.util.Collections.singletonList(item);
        }
    }
}
