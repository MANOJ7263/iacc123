package com.mano.iacc.controller;

import com.mano.iacc.entity.User;
import com.mano.iacc.payload.JwtResponse;
import com.mano.iacc.payload.LoginRequest;
import com.mano.iacc.payload.SignupRequest;
import com.mano.iacc.repository.UserRepository;
import com.mano.iacc.security.JwtUtils;
import com.mano.iacc.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
        @Autowired
        AuthenticationManager authenticationManager;

        @Autowired
        UserRepository userRepository;

        @Autowired
        JwtUtils jwtUtils;

        @Autowired
        com.mano.iacc.service.UserService userService;

        @PostMapping("/signin")
        public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
                System.out.println("DEBUG: Login attempt for user: " + loginRequest.getUsername() + " via gateway: "
                                + loginRequest.getGateway());

                try {
                        Authentication authentication = authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                                                        loginRequest.getPassword()));

                        System.out.println("DEBUG: Authentication successful for: " + loginRequest.getUsername());
                        SecurityContextHolder.getContext().setAuthentication(authentication);

                        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                        List<String> roles = userDetails.getAuthorities().stream()
                                        .map(GrantedAuthority::getAuthority)
                                        .collect(Collectors.toList());

                        // --- Dual Gateway Logic ---
                        String gateway = loginRequest.getGateway();
                        if ("ADMIN".equalsIgnoreCase(gateway)) {
                                if (!roles.contains("ROLE_COLLECTOR")) {
                                        System.out.println("WARN: Non-Admin user tried to access Admin Gateway");
                                        return ResponseEntity.status(403)
                                                        .body("Error: Admin Access Only. Please use Department Login.");
                                }
                        }
                        // "DEPT" gateway logic (optional strictness, for now allow all valid users to
                        // access Dept portal if they want,
                        // OR restrict Admin from Dept portal if desired. The requirement only specifies
                        // Admin protection).
                        // Request says: "Logic: Allows ROLE_DEPT_HEAD, ROLE_STAFF,
                        // ROLE_AUTO_SUPERVISOR."
                        // Implicitly, usually Admin doesn't use this, but no strict ban requested.

                        String jwt = jwtUtils.generateJwtToken(authentication);

                        User user = userRepository.findById(userDetails.getId()).orElse(new User());

                        return ResponseEntity.ok(new JwtResponse(jwt,
                                        userDetails.getId(),
                                        userDetails.getUsername(),
                                        userDetails.getEmail(),
                                        roles,
                                        user.getDepartment(),
                                        user.getSubRole()));
                } catch (Exception e) {
                        System.out.println("DEBUG: Authentication FAILED for: " + loginRequest.getUsername());
                        throw e;
                }
        }

        @PostMapping("/signup")
        public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
                if (userRepository.findByUsername(signUpRequest.getUsername()).isPresent()) {
                        return ResponseEntity
                                        .badRequest()
                                        .body("Error: Username is already taken!");
                }

                // Create new user object (password will be encoded in service)
                // Create new user object (password will be encoded in service)
                User user = new User();
                user.setUsername(signUpRequest.getUsername());
                user.setEmail(signUpRequest.getEmail());
                user.setPasswordHash(signUpRequest.getPassword());
                user.setDepartment(signUpRequest.getDepartment());
                user.setSubRole(signUpRequest.getSubRole());

                String role = signUpRequest.getRole();
                if (role == null || role.isEmpty()) {
                        String subRole = signUpRequest.getSubRole();
                        if (subRole != null) {
                                role = switch (subRole.toUpperCase()) {
                                        case "CEO", "CMO", "CTO", "CFO", "CRO", "DEO", "DHO", "DTO", "DFO", "DRO" -> "ROLE_DEPT_HEAD";
                                        case "AUTOMATION_SUPERVISOR" -> "ROLE_AUTO_SUPERVISOR";
                                        case "TEACHER" -> "ROLE_STAFF";
                                        default -> "ROLE_STAFF";
                                };
                        } else {
                                role = "ROLE_STAFF";
                        }
                }
                user.setRole(role);

                // Use service to save and log
                userService.createUser(user);

                return ResponseEntity.ok("User registered successfully!");
        }
}
