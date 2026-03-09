package com.mano.iacc.repository;

import com.mano.iacc.entity.TransportFleet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransportFleetRepository extends JpaRepository<TransportFleet, Long> {
    List<TransportFleet> findByStatus(String status);

    List<TransportFleet> findByZone(String zone);
}
