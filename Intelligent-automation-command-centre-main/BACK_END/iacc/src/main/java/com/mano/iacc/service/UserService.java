package com.mano.iacc.service;

import com.mano.iacc.entity.User;
import com.mano.iacc.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(User user) {
        if ("ROLE_COLLECTOR".equals(user.getRole())) {
            long adminCount = userRepository.countByRole("ROLE_COLLECTOR");
            if (adminCount >= 2) {
                log.warn("Attempt to register more than 2 admins blocked.");
                throw new RuntimeException("Administrative capacity full. Only 2 admins allowed.");
            }
        }
        log.info("Saving User to iacc_db: {}", user.getUsername());
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
}
