package com.mano.iacc.repository;

import com.mano.iacc.entity.FinanceTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FinanceTransactionRepository extends JpaRepository<FinanceTransaction, Long> {
    List<FinanceTransaction> findByStatus(String status);

    List<FinanceTransaction> findByDepartment(String department);

    List<FinanceTransaction> findByCategory(String category);
}
