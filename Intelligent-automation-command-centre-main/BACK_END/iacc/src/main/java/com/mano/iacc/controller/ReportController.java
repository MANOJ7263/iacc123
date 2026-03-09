package com.mano.iacc.controller;

import com.mano.iacc.service.ReportService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/export/csv")
    @PreAuthorize("hasAnyRole('ROLE_COLLECTOR', 'ROLE_DEPT_HEAD', 'ROLE_AUTO_SUPERVISOR')")
    public ResponseEntity<Resource> downloadCsv() {
        ByteArrayInputStream stream = reportService.generateTaskCsv();
        InputStreamResource file = new InputStreamResource(stream);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=tasks_report.csv")
                .contentType(MediaType.parseMediaType("application/csv"))
                .body(file);
    }
}
