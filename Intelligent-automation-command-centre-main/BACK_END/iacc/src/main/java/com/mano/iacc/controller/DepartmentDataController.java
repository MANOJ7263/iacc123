package com.mano.iacc.controller;

import com.mano.iacc.entity.*;
import com.mano.iacc.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

/**
 * Unified REST API for all department data stored in MySQL.
 * All endpoints are open (no auth required) for internal frontend usage.
 * Base: /api/dept
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dept")
public class DepartmentDataController {

    @Autowired
    EduDistrictRepository eduDistrictRepo;
    @Autowired
    EduHeadmasterRepository eduHeadmasterRepo;
    @Autowired
    EduTeacherRepository eduTeacherRepo;
    @Autowired
    EduStudentRepository eduStudentRepo;
    @Autowired
    HealthPatientRepository healthPatientRepo;
    @Autowired
    HealthDoctorRepository healthDoctorRepo;
    @Autowired
    TransportFleetRepository transportFleetRepo;
    @Autowired
    RevenuePropertyRepository revenuePropertyRepo;
    @Autowired
    FinanceTransactionRepository financeTransactionRepo;

    // ─── EDUCATION ────────────────────────────────────────────────────────────

    @GetMapping("/education/district")
    public ResponseEntity<?> getEduDistrict() {
        return ResponseEntity.ok(eduDistrictRepo.findAll());
    }

    @GetMapping("/education/headmasters")
    public ResponseEntity<?> getHeadmasters(@RequestParam(required = false) String zoneId) {
        if (zoneId != null)
            return ResponseEntity.ok(eduHeadmasterRepo.findByZoneId(zoneId));
        return ResponseEntity.ok(eduHeadmasterRepo.findAll());
    }

    @GetMapping("/education/teachers")
    public ResponseEntity<?> getTeachers(@RequestParam(required = false) String status) {
        if (status != null)
            return ResponseEntity.ok(eduTeacherRepo.findByStatus(status));
        return ResponseEntity.ok(eduTeacherRepo.findAll());
    }

    @PutMapping("/education/teachers/{id}/status")
    public ResponseEntity<?> updateTeacherStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return eduTeacherRepo.findById(id).map(t -> {
            t.setStatus(body.get("status"));
            return ResponseEntity.ok(eduTeacherRepo.save(t));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/education/students")
    public ResponseEntity<?> getStudents(
            @RequestParam(required = false) Integer grade,
            @RequestParam(required = false) String section) {
        if (grade != null && section != null)
            return ResponseEntity.ok(eduStudentRepo.findByGradeAndSection(grade, section));
        if (grade != null)
            return ResponseEntity.ok(eduStudentRepo.findByGrade(grade));
        return ResponseEntity.ok(eduStudentRepo.findAll());
    }

    @GetMapping("/education/summary")
    public ResponseEntity<?> getEduSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalTeachers", eduTeacherRepo.count());
        summary.put("totalStudents", eduStudentRepo.count());
        summary.put("totalHeadmasters", eduHeadmasterRepo.count());
        summary.put("activeTeachers", eduTeacherRepo.findByStatus("active").size());
        summary.put("onLeaveTeachers", eduTeacherRepo.findByStatus("on-leave").size());
        return ResponseEntity.ok(summary);
    }

    // ─── HEALTH ───────────────────────────────────────────────────────────────

    @GetMapping("/health/patients")
    public ResponseEntity<?> getPatients(@RequestParam(required = false) String status) {
        if (status != null)
            return ResponseEntity.ok(healthPatientRepo.findByStatus(status));
        return ResponseEntity.ok(healthPatientRepo.findAll());
    }

    @PutMapping("/health/patients/{id}/status")
    public ResponseEntity<?> updatePatientStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return healthPatientRepo.findById(id).map(p -> {
            p.setStatus(body.get("status"));
            return ResponseEntity.ok(healthPatientRepo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/health/doctors")
    public ResponseEntity<?> getDoctors(@RequestParam(required = false) String status,
            @RequestParam(required = false) String department) {
        if (department != null)
            return ResponseEntity.ok(healthDoctorRepo.findByDepartment(department));
        if (status != null)
            return ResponseEntity.ok(healthDoctorRepo.findByStatus(status));
        return ResponseEntity.ok(healthDoctorRepo.findAll());
    }

    @GetMapping("/health/summary")
    public ResponseEntity<?> getHealthSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalPatients", healthPatientRepo.count());
        summary.put("criticalPatients", healthPatientRepo.findByStatus("Critical").size());
        summary.put("stablePatients", healthPatientRepo.findByStatus("Stable").size());
        summary.put("totalDoctors", healthDoctorRepo.count());
        summary.put("onDutyDoctors", healthDoctorRepo.findByStatus("On-Duty").size());
        return ResponseEntity.ok(summary);
    }

    // ─── TRANSPORT ────────────────────────────────────────────────────────────

    @GetMapping("/transport/fleet")
    public ResponseEntity<?> getFleet(@RequestParam(required = false) String status,
            @RequestParam(required = false) String zone) {
        if (zone != null)
            return ResponseEntity.ok(transportFleetRepo.findByZone(zone));
        if (status != null)
            return ResponseEntity.ok(transportFleetRepo.findByStatus(status));
        return ResponseEntity.ok(transportFleetRepo.findAll());
    }

    @PutMapping("/transport/fleet/{id}/status")
    public ResponseEntity<?> updateFleetStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return transportFleetRepo.findById(id).map(f -> {
            f.setStatus(body.get("status"));
            return ResponseEntity.ok(transportFleetRepo.save(f));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/transport/summary")
    public ResponseEntity<?> getTransportSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalFleet", transportFleetRepo.count());
        summary.put("active", transportFleetRepo.findByStatus("Active").size());
        summary.put("outOfService", transportFleetRepo.findByStatus("Out of Service").size());
        summary.put("maintenance", transportFleetRepo.findByStatus("Maintenance").size());
        return ResponseEntity.ok(summary);
    }

    // ─── REVENUE ──────────────────────────────────────────────────────────────

    @GetMapping("/revenue/properties")
    public ResponseEntity<?> getProperties(@RequestParam(required = false) String status,
            @RequestParam(required = false) String zone) {
        if (zone != null)
            return ResponseEntity.ok(revenuePropertyRepo.findByZone(zone));
        if (status != null)
            return ResponseEntity.ok(revenuePropertyRepo.findByStatus(status));
        return ResponseEntity.ok(revenuePropertyRepo.findAll());
    }

    @PutMapping("/revenue/properties/{id}/status")
    public ResponseEntity<?> updatePropertyStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return revenuePropertyRepo.findById(id).map(p -> {
            p.setStatus(body.get("status"));
            return ResponseEntity.ok(revenuePropertyRepo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/revenue/summary")
    public ResponseEntity<?> getRevenueSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("total", revenuePropertyRepo.count());
        summary.put("paid", revenuePropertyRepo.findByStatus("Paid").size());
        summary.put("overdue", revenuePropertyRepo.findByStatus("Overdue").size());
        summary.put("pending", revenuePropertyRepo.findByStatus("Pending").size());
        return ResponseEntity.ok(summary);
    }

    // ─── FINANCE ──────────────────────────────────────────────────────────────

    @GetMapping("/finance/transactions")
    public ResponseEntity<?> getTransactions(@RequestParam(required = false) String status,
            @RequestParam(required = false) String department) {
        if (department != null)
            return ResponseEntity.ok(financeTransactionRepo.findByDepartment(department));
        if (status != null)
            return ResponseEntity.ok(financeTransactionRepo.findByStatus(status));
        return ResponseEntity.ok(financeTransactionRepo.findAll());
    }

    @PostMapping("/finance/transactions")
    public ResponseEntity<?> createTransaction(@RequestBody FinanceTransaction tx) {
        return ResponseEntity.ok(financeTransactionRepo.save(tx));
    }

    @PutMapping("/finance/transactions/{id}/status")
    public ResponseEntity<?> updateTransactionStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return financeTransactionRepo.findById(id).map(t -> {
            t.setStatus(body.get("status"));
            return ResponseEntity.ok(financeTransactionRepo.save(t));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/finance/summary")
    public ResponseEntity<?> getFinanceSummary() {
        Map<String, Object> summary = new HashMap<>();
        List<FinanceTransaction> all = financeTransactionRepo.findAll();
        long totalBudget = all.stream().mapToLong(t -> t.getAmount() != null ? t.getAmount() : 0).sum();
        long completed = all.stream().filter(t -> "Completed".equals(t.getStatus()))
                .mapToLong(t -> t.getAmount() != null ? t.getAmount() : 0).sum();
        long pending = all.stream().filter(t -> "Pending".equals(t.getStatus()))
                .mapToLong(t -> t.getAmount() != null ? t.getAmount() : 0).sum();
        summary.put("totalTransactions", all.size());
        summary.put("totalBudget", totalBudget);
        summary.put("disbursed", completed);
        summary.put("pending", pending);
        return ResponseEntity.ok(summary);
    }

    // ─── Cross-Department Overview ─────────────────────────────────────────────

    @GetMapping("/overview")
    public ResponseEntity<?> getOverview() {
        Map<String, Object> overview = new HashMap<>();
        overview.put("education", Map.of(
                "teachers", eduTeacherRepo.count(),
                "students", eduStudentRepo.count(),
                "headmasters", eduHeadmasterRepo.count()));
        overview.put("health", Map.of(
                "patients", healthPatientRepo.count(),
                "critical", healthPatientRepo.findByStatus("Critical").size(),
                "doctors", healthDoctorRepo.count()));
        overview.put("transport", Map.of(
                "fleet", transportFleetRepo.count(),
                "outOfService", transportFleetRepo.findByStatus("Out of Service").size()));
        overview.put("revenue", Map.of(
                "properties", revenuePropertyRepo.count(),
                "overdue", revenuePropertyRepo.findByStatus("Overdue").size()));
        overview.put("finance", Map.of(
                "transactions", financeTransactionRepo.count()));
        return ResponseEntity.ok(overview);
    }
}
