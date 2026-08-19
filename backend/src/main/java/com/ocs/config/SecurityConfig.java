package com.ocs.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ocs.security.JwtAuthenticationFilter;

import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"));
        config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // =========================================================
    // PASSWORD ENCODER
    // =========================================================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================================================
    // AUTHENTICATION MANAGER
    // =========================================================
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {

        return config.getAuthenticationManager();
    }

    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // -------------------------------------------------
            // CORS Configuration Integration
            // -------------------------------------------------
            .cors(Customizer.withDefaults())

            // -------------------------------------------------
            // CSRF
            // -------------------------------------------------
            .csrf(csrf -> csrf.disable())

            // -------------------------------------------------
            // SESSION MANAGEMENT
            // JWT applications should be STATELESS
            // -------------------------------------------------
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // -------------------------------------------------
            // AUTHORIZATION
            // -------------------------------------------------
            .authorizeHttpRequests(auth -> auth

                // =============================================
                // PREFLIGHT CORS OPTIONS REQUESTS
                // =============================================
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                // =============================================
                // PUBLIC AUTHENTICATION & PUBLIC DOCTOR LIST
                // =============================================
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/patient/doctors").permitAll()

                // =============================================
                // ADMIN ENDPOINTS
                // =============================================
                .requestMatchers("/api/admin/**")
                .hasAuthority("ROLE_ADMIN")

                // =============================================
                // DOCTOR MANAGEMENT
                // GET /api/doctors
                //
                // Used by Admin to view all doctors.
                // Doctors can also access if required.
                // =============================================
                .requestMatchers("/api/doctors/**")
                .hasAnyAuthority(
                    "ROLE_ADMIN",
                    "ROLE_DOCTOR"
                )

                // =============================================
                // DOCTOR SELF-SERVICE ENDPOINTS
                //
                // Examples:
                // GET  /api/doctor/profile
                // GET  /api/doctor/appointments
                // GET  /api/doctor/leaves
                // POST /api/doctor/leaves
                // PUT  /api/doctor/availability/toggle
                // =============================================
                .requestMatchers("/api/doctor/**")
                .hasAnyAuthority(
                    "ROLE_ADMIN",
                    "ROLE_DOCTOR"
                )

                // =============================================
                // PATIENT ENDPOINTS
                // =============================================
                .requestMatchers("/api/patient/**")
                .hasAnyAuthority(
                    "ROLE_ADMIN",
                    "ROLE_PATIENT"
                )

                // =============================================
                // ALL OTHER ENDPOINTS
                // =============================================
                .anyRequest()
                .authenticated()
            )

            // -------------------------------------------------
            // JWT FILTER
            // Run JWT authentication before Spring's
            // UsernamePasswordAuthenticationFilter
            // -------------------------------------------------
            .addFilterBefore(
                jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}