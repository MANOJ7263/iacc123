package com.mano.iacc.repository;

import com.mano.iacc.entity.EduHeadmaster;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EduHeadmasterRepository extends JpaRepository<EduHeadmaster, Long> {
    List<EduHeadmaster> findByZoneId(String zoneId);
}
