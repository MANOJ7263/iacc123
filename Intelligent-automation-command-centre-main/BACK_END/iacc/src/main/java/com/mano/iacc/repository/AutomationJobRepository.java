package com.mano.iacc.repository;

import com.mano.iacc.entity.AutomationJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AutomationJobRepository extends JpaRepository<AutomationJob, Long> {
    Optional<AutomationJob> findByTaskId(Long taskId);

    Optional<AutomationJob> findByBotId(String botId);
}
