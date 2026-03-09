package com.mano.iacc.repository;

import com.mano.iacc.entity.EduTeacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EduTeacherRepository extends JpaRepository<EduTeacher, Long> {
    List<EduTeacher> findByStatus(String status);

    List<EduTeacher> findBySchoolName(String schoolName);
}
