package com.mano.iacc.repository;

import com.mano.iacc.entity.EduStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EduStudentRepository extends JpaRepository<EduStudent, Long> {
    List<EduStudent> findByGrade(Integer grade);

    List<EduStudent> findBySection(String section);

    List<EduStudent> findByGradeAndSection(Integer grade, String section);
}
