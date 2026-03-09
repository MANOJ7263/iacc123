package com.mano.iacc.repository;

import com.mano.iacc.entity.HealthDoctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HealthDoctorRepository extends JpaRepository<HealthDoctor, Long> {
    List<HealthDoctor> findByStatus(String status);

    List<HealthDoctor> findByHospital(String hospital);

    List<HealthDoctor> findByDepartment(String department);
}
