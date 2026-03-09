package com.mano.iacc.repository;

import com.mano.iacc.entity.RevenueProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RevenuePropertyRepository extends JpaRepository<RevenueProperty, Long> {
    List<RevenueProperty> findByStatus(String status);

    List<RevenueProperty> findByZone(String zone);

    List<RevenueProperty> findByType(String type);
}
