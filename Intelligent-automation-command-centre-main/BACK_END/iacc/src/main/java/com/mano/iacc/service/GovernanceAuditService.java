package com.mano.iacc.service;

import com.mano.iacc.entity.AuditLog;
import com.mano.iacc.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class GovernanceAuditService {

    private static final Logger log = LoggerFactory.getLogger(GovernanceAuditService.class);

    private final AuditLogRepository auditLogRepository;

    public GovernanceAuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void logTaskStatusChange(Long taskId, String oldStatus, String newStatus, String performedBy,
            String reason) {

        AuditLog auditLog = new AuditLog();
        auditLog.setEntityType("TASK");
        auditLog.setEntityId(taskId);
        auditLog.setAction("STATUS_CHANGE");
        auditLog.setOldValue(oldStatus);
        auditLog.setNewValue(newStatus);
        auditLog.setUsername(performedBy);
        auditLog.setPerformedBy(performedBy);
        auditLog.setReason(reason);
        auditLog.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(auditLog);
        log.info("Audit Log Created: Task {} status changed from {} to {} by {}", taskId, oldStatus, newStatus,
                performedBy);
    }

    @Transactional
    public void logTaskCreation(Long taskId, String createdBy, String details) {

        AuditLog auditLog = new AuditLog();
        auditLog.setEntityType("TASK");
        auditLog.setEntityId(taskId);
        auditLog.setAction("CREATED");
        auditLog.setNewValue("PENDING");
        auditLog.setUsername(createdBy);
        auditLog.setPerformedBy(createdBy);
        auditLog.setReason(details);
        auditLog.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(auditLog);
        log.info("Audit Log Created: Task {} created by {}", taskId, createdBy);
    }

    @Transactional
    public void logAutomationTrigger(Long taskId, String botType, String jobKey, String triggeredBy) {

        AuditLog auditLog = new AuditLog();
        auditLog.setEntityType("AUTOMATION");
        auditLog.setEntityId(taskId);
        auditLog.setAction("BOT_TRIGGERED");
        auditLog.setNewValue(botType + " | Job: " + jobKey);
        auditLog.setUsername(triggeredBy);
        auditLog.setPerformedBy(triggeredBy);
        auditLog.setReason("AI-driven automation triggered");
        auditLog.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(auditLog);
        log.info("Audit Log Created: Automation triggered for Task {} with bot {}", taskId, botType);
    }
}
