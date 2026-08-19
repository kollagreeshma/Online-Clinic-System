package com.ocs.config;

import com.ocs.entity.Role;
import com.ocs.entity.User;
import com.ocs.repository.RoleRepository;
import com.ocs.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));

        roleRepository.findByName("ROLE_DOCTOR")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_DOCTOR")));

        roleRepository.findByName("ROLE_PATIENT")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_PATIENT")));

        if (!userRepository.existsByEmail("admin@ocs.com")) {
            User adminUser = new User(
                    "admin@ocs.com",
                    passwordEncoder.encode("Admin123!"),
                    "System Administrator",
                    adminRole
            );
            userRepository.save(adminUser);
            System.out.println(">>> Initialized default Admin user: admin@ocs.com / Admin123!");
        }
    }
}
