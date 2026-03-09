package com.mano.iacc.config;

import com.mano.iacc.entity.User;
import com.mano.iacc.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    // Runs on application startup
    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            System.out.println("Checking and seeding default users...");

            createUserIsNotExist(userRepository, encoder, "test41", "test41@gmail.com", "ROLE_DEPT_HEAD", "REVENUE", null, "Test@1234");
            createUserIsNotExist(userRepository, encoder, "staff41", "staff41@gmail.com", "ROLE_STAFF", "HEALTH", null, "Test@1234");
            createUserIsNotExist(userRepository, encoder, "auto41", "auto41@gmail.com", "ROLE_AUTO_SUPERVISOR", "TRANSPORT", null, "Test@1234");
            createUserIsNotExist(userRepository, encoder, "collector41", "collector41@gmail.com", "ROLE_COLLECTOR", "ADMIN", null, "Test@1234");

            // Education Users
            createUserIsNotExist(userRepository, encoder, "ceo_education", "ceo_edu@gmail.com", "ROLE_DEPT_HEAD", "EDUCATION", "CEO", "test@123");
            createUserIsNotExist(userRepository, encoder, "deo_education", "deo_edu@gmail.com", "ROLE_DEPT_HEAD", "EDUCATION", "DEO", "test@123");
            createUserIsNotExist(userRepository, encoder, "beo_education", "beo_edu@gmail.com", "ROLE_DEPT_HEAD", "EDUCATION", "BEO", "test@123");
            createUserIsNotExist(userRepository, encoder, "headmaster_edu", "hm_edu@gmail.com", "ROLE_DEPT_HEAD", "EDUCATION", "HEADMASTER", "test@123");
            createUserIsNotExist(userRepository, encoder, "manager_edu", "mgr_edu@gmail.com", "ROLE_DEPT_HEAD", "EDUCATION", "MANAGER", "test@123");
            createUserIsNotExist(userRepository, encoder, "teacher_edu", "teacher_edu@gmail.com", "ROLE_STAFF", "EDUCATION", "TEACHER", "test@123");
            createUserIsNotExist(userRepository, encoder, "student_edu", "student_edu@gmail.com", "ROLE_STAFF", "EDUCATION", "STUDENT", "test@123");

            // Health Users
            createUserIsNotExist(userRepository, encoder, "healthcmo1", "cmo@gmail.com", "ROLE_DEPT_HEAD", "HEALTH", "CMO", "test@123");
            createUserIsNotExist(userRepository, encoder, "healthdho1", "dho@gmail.com", "ROLE_DEPT_HEAD", "HEALTH", "DHO", "test@123");
            createUserIsNotExist(userRepository, encoder, "healthms1", "ms@gmail.com", "ROLE_DEPT_HEAD", "HEALTH", "MS", "test@123");
            createUserIsNotExist(userRepository, encoder, "healthwarden1", "warden@gmail.com", "ROLE_STAFF", "HEALTH", "HOSPITAL_WARDEN", "test@123");
            createUserIsNotExist(userRepository, encoder, "healthdoctor1", "doc@gmail.com", "ROLE_STAFF", "HEALTH", "DOCTOR", "test@123");

            System.out.println("Default user seeding complete.");
        };
    }

    private void createUserIsNotExist(UserRepository repo, PasswordEncoder encoder, String username, String email,
            String role, String dept, String subRole, String password) {
        if (repo.findByUsername(username).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPasswordHash(encoder.encode(password));
            user.setRole(role);
            user.setDepartment(dept);
            user.setSubRole(subRole);
            repo.save(user);
            System.out.println("USER SAVED SUCCESSFULLY: " + username);
        }
    }
}
