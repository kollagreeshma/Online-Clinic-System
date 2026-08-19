package com.ocs.service.impl;

import com.ocs.dto.ApiResponse;
import com.ocs.dto.AuthRequest;
import com.ocs.dto.AuthResponse;
import com.ocs.dto.RegisterRequest;
import com.ocs.entity.Patient;
import com.ocs.entity.Role;
import com.ocs.entity.User;
import com.ocs.exception.BadRequestException;
import com.ocs.repository.PatientRepository;
import com.ocs.repository.RoleRepository;
import com.ocs.repository.UserRepository;
import com.ocs.security.JwtTokenProvider;
import com.ocs.security.UserPrincipal;
import com.ocs.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String role = userPrincipal.getAuthorities().iterator().next().getAuthority();

        return new AuthResponse(token, userPrincipal.getUsername(), role, userPrincipal.getId(), userPrincipal.getFullName());
    }

    @Override
    @Transactional
    public ApiResponse registerPatient(RegisterRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String fullName = request.getFullName() != null ? request.getFullName().trim() : "";
        String phone = request.getPhone() != null ? request.getPhone().trim() : "";
        String gender = request.getGender() != null ? request.getGender().trim().toUpperCase() : "MALE";
        String bloodGroup = request.getBloodGroup() != null ? request.getBloodGroup().trim() : null;
        String address = request.getAddress() != null ? request.getAddress().trim() : null;

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email address is already registered!");
        }

        Role patientRole = roleRepository.findByName("ROLE_PATIENT")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_PATIENT")));

        User user = new User(
                email,
                passwordEncoder.encode(request.getPassword()),
                fullName,
                patientRole
        );
        userRepository.save(user);

        Patient patient = new Patient(
                user,
                request.getAge(),
                gender,
                bloodGroup,
                phone,
                address
        );
        patientRepository.save(patient);

        return new ApiResponse(true, "Patient registered successfully! Please login.");
    }
}
