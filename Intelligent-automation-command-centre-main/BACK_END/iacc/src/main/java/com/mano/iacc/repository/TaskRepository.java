package com.mano.iacc.repository;

import com.mano.iacc.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(String status);

    List<Task> findByDepartment(String department);

    List<Task> findByCreatedBy_Id(Long userId);

    long countByStatus(String status);

    long countByRiskLevel(String riskLevel);

    long countByDepartmentAndStatus(String department, String status);

    List<Task> findByCreatedByAdminTrue();

    // For Dept Head: Created by them OR (assigned by Admin AND in their dept)
    // Note: This is simpler if we just fetch all tasks for department, which
    // findByDepartment already does.
    // But if we want specific logic:
    // List<Task> findByDepartmentAndCreatedByAdminTrue(String department);
}
