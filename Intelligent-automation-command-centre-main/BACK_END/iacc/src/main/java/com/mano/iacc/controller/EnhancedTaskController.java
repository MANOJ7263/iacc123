package com.mano.iacc.controller;

import com.mano.iacc.entity.Task;
import com.mano.iacc.entity.User;
import com.mano.iacc.repository.UserRepository;
import com.mano.iacc.service.EnhancedTaskService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tasks")
public class EnhancedTaskController {

    private static final Logger log = LoggerFactory.getLogger(EnhancedTaskController.class);

    @Autowired
    EnhancedTaskService enhancedTaskService;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_COLLECTOR', 'ROLE_DEPT_HEAD', 'ROLE_STAFF', 'ROLE_AUTO_SUPERVISOR')")
    public List<Task> getAllTasks() {
        return enhancedTaskService.getAllTasks();
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasAnyRole('ROLE_COLLECTOR', 'ROLE_DEPT_HEAD', 'ROLE_AUTO_SUPERVISOR')")
    public ResponseEntity<Map<String, Object>> getTaskAnalytics() {
        Map<String, Object> analytics = enhancedTaskService.getTaskAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/high-risk")
    @PreAuthorize("hasAnyRole('ROLE_COLLECTOR', 'ROLE_DEPT_HEAD', 'ROLE_AUTO_SUPERVISOR')")
    public ResponseEntity<List<Task>> getHighRiskTasks() {
        List<Task> highRiskTasks = enhancedTaskService.getHighRiskTasks();
        return ResponseEntity.ok(highRiskTasks);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_COLLECTOR', 'ROLE_DEPT_HEAD', 'ROLE_STAFF')")
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        log.info("=== CREATE TASK REQUEST RECEIVED ===");

        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            log.info("Principal type: {}", principal.getClass().getName());
            log.info("Principal value: {}", principal);

            if (!(principal instanceof UserDetails)) {
                log.error("Principal is not UserDetails! Type: {}", principal.getClass());
                return ResponseEntity.status(401).body("Authentication failed - invalid principal");
            }

            UserDetails userDetails = (UserDetails) principal;
            log.info("Authenticated user: {}", userDetails.getUsername());
            log.info("User authorities: {}", userDetails.getAuthorities());

            User currentUser = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found: " + userDetails.getUsername()));

            log.info("Found user in database: ID={}, Username={}, Role={}",
                    currentUser.getId(), currentUser.getUsername(), currentUser.getRole());

            task.setCreatedBy(currentUser);

            // Use Enhanced AI Service
            Task savedTask = enhancedTaskService.createTaskWithAI(task, currentUser.getUsername());

            log.info("Task created by {}: {} (Intent: {}, Risk Score: {})",
                    currentUser.getUsername(), savedTask.getTitle(), savedTask.getIntentType(),
                    savedTask.getRiskScore());

            return ResponseEntity.ok(savedTask);
        } catch (Exception e) {
            log.error("Error creating task", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/decision")
    @PreAuthorize("hasRole('ROLE_DEPT_HEAD')")
    public ResponseEntity<?> approveTask(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String decision = payload.get("decision"); // "APPROVE" or "REJECT"
        String reason = payload.get("reason");

        return ResponseEntity.ok(enhancedTaskService.approveTask(id, decision, reason, userDetails.getUsername()));
    }

    @PostMapping("/{id}/escalate")
    @PreAuthorize("hasRole('ROLE_COLLECTOR')")
    public ResponseEntity<?> escalateTask(@PathVariable Long id) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(enhancedTaskService.escalateTask(id, userDetails.getUsername()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('ROLE_STAFF')")
    public ResponseEntity<?> getMyTasks() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(enhancedTaskService.getMyTasks(currentUser.getId()));
    }

    @GetMapping("/automation/status")
    @PreAuthorize("hasAnyRole('ROLE_COLLECTOR', 'ROLE_DEPT_HEAD', 'ROLE_AUTO_SUPERVISOR')")
    public ResponseEntity<List<Task>> getAutomationTasks() {
        return ResponseEntity.ok(enhancedTaskService.getAutomationTasks());
    }

    @PostMapping("/{id}/retry")
    @PreAuthorize("hasAnyRole('ROLE_COLLECTOR', 'ROLE_GP_ADMIN', 'ROLE_AUTO_SUPERVISOR')")
    public ResponseEntity<?> retryTask(@PathVariable Long id) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(enhancedTaskService.retryTask(id, userDetails.getUsername()));
    }
    // --- Hierarchical Task Delegation Endpoints ---

    @PostMapping("/delegate")
    @PreAuthorize("hasRole('ROLE_COLLECTOR')")
    public ResponseEntity<?> delegateTask(@RequestBody Task task) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // Ensure "department" is present in payload
        if (task.getDepartment() == null || task.getDepartment().isEmpty()) {
            return ResponseEntity.badRequest().body("Department is mandatory for delegation.");
        }

        Task savedTask = enhancedTaskService.delegateTaskToDept(task, userDetails.getUsername());
        return ResponseEntity.ok(savedTask);
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasRole('ROLE_DEPT_HEAD')")
    public ResponseEntity<?> assignTaskToStaff(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String staffUsername = payload.get("staffUsername");

        if (staffUsername == null) {
            return ResponseEntity.badRequest().body("staffUsername is mandatory.");
        }

        User staff = userRepository.findByUsername(staffUsername)
                .orElseThrow(() -> new RuntimeException("Staff user not found"));

        return ResponseEntity.ok(enhancedTaskService.assignTaskToStaff(id, staff, userDetails.getUsername()));
    }
}
