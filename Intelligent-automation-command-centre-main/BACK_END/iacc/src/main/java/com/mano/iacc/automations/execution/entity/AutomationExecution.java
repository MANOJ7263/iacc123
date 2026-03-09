package com.mano.iacc.automations.execution.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "automation_executions")
public class AutomationExecution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to automation definition
    @Column(nullable = false)
    private Long automationId;

    // Who triggered it
    @Column(nullable = false)
    private Long requestedBy;

    @Column(nullable = false)
    private String status; // PENDING, RUNNING, SUCCESS, FAILED

    @Column(columnDefinition = "TEXT")
    private String inputPayload;

    @Column(columnDefinition = "TEXT")
    private String outputPayload;

    private String n8nExecutionId;

    private Boolean aiRouted = false;

    private Double failureRiskScore = 0.0;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;

    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }

    public Long getAutomationId() {
        return automationId;
    }

    public void setAutomationId(Long automationId) {
        this.automationId = automationId;
    }

    public Long getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(Long requestedBy) {
        this.requestedBy = requestedBy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getInputPayload() {
        return inputPayload;
    }

    public void setInputPayload(String inputPayload) {
        this.inputPayload = inputPayload;
    }

    public String getOutputPayload() {
        return outputPayload;
    }

    public void setOutputPayload(String outputPayload) {
        this.outputPayload = outputPayload;
    }

    public String getN8nExecutionId() {
        return n8nExecutionId;
    }

    public void setN8nExecutionId(String n8nExecutionId) {
        this.n8nExecutionId = n8nExecutionId;
    }

    public Boolean getAiRouted() {
        return aiRouted;
    }

    public void setAiRouted(Boolean aiRouted) {
        this.aiRouted = aiRouted;
    }

    public Double getFailureRiskScore() {
        return failureRiskScore;
    }

    public void setFailureRiskScore(Double failureRiskScore) {
        this.failureRiskScore = failureRiskScore;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(LocalDateTime finishedAt) {
        this.finishedAt = finishedAt;
    }
}
