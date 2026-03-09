package com.mano.iacc.repository;

import com.mano.iacc.entity.HealthPatient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HealthPatientRepository extends JpaRepository<HealthPatient, Long> {
    List<HealthPatient> findByStatus(String status);

    List<HealthPatient> findByHospital(String hospital);
}
