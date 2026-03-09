package com.mano.iacc.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    public Task() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String department; // HEALTH, REVENUE, EDUCATION, etc.

    @Column(nullable = false)
    private String priority; // HIGH, MEDIUM, LOW

    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED, IN_PROGRESS, COMPLETED

    @Column(name = "ai_classification")
    private String aiClassification;

    @Column(name = "assigned_bot_type")
    private String assignedBotType;

    @Column(name = "risk_level")
    private String riskLevel; // LOW, MEDIUM, HIGH

    @Column(name = "risk_score")
    private Integer riskScore; // 0-100

    @Column(columnDefinition = "TEXT")
    private String risk_reason;

    @Column(name = "intent_type")
    private String intentType; // REPORT_GENERATION, DATA_ENTRY, APPROVAL_WORKFLOW, etc.

    @Column(name = "uipath_job_key")
    private String uipathJobKey; // Job ID from UiPath Orchestrator (Legacy naming)

    @Column(name = "release_key")
    private String releaseKey;

    @Column(name = "uipath_job_status")
    private String uipathJobStatus;

    private LocalDateTime deadline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", referencedColumnName = "id")
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "created_by_admin")
    private Boolean createdByAdmin = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_staff_id", referencedColumnName = "id")
    private User assignedToStaff;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (createdByAdmin == null) {
            createdByAdmin = false;
        }
    }

    public Boolean getCreatedByAdmin() {
        return createdByAdmin;
    }

    public void setCreatedByAdmin(Boolean createdByAdmin) {
        this.createdByAdmin = createdByAdmin;
    }

    public User getAssignedToStaff() {
        return assignedToStaff;
    }

    public void setAssignedToStaff(User assignedToStaff) {
        this.assignedToStaff = assignedToStaff;
    }

    // Explicit Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAiClassification() {
        return aiClassification;
    }

    public void setAiClassification(String aiClassification) {
        this.aiClassification = aiClassification;
    }

    public String getAssignedBotType() {
        return assignedBotType;
    }

    public void setAssignedBotType(String assignedBotType) {
        this.assignedBotType = assignedBotType;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getRisk_reason() {
        return risk_reason;
    }

    public void setRisk_reason(String risk_reason) {
        this.risk_reason = risk_reason;
    }

    public String getIntentType() {
        return intentType;
    }

    public void setIntentType(String intentType) {
        this.intentType = intentType;
    }

    public String getUipathJobKey() {
        return uipathJobKey;
    }

    public void setUipathJobKey(String uipathJobKey) {
        this.uipathJobKey = uipathJobKey;
    }

    public String getReleaseKey() {
        return releaseKey;
    }

    public void setReleaseKey(String releaseKey) {
        this.releaseKey = releaseKey;
    }

    public String getUipathJobStatus() {
        return uipathJobStatus;
    }

    public void setUipathJobStatus(String uipathJobStatus) {
        this.uipathJobStatus = uipathJobStatus;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
