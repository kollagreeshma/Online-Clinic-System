package com.ocs.controller;

import com.ocs.dto.*;
import com.ocs.service.AppointmentService;
import com.ocs.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
@CrossOrigin(origins = "*")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/profile")
    public ResponseEntity<PatientDTO> getPatientProfile(Authentication authentication) {
        return ResponseEntity.ok(patientService.getPatientByEmail(authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<PatientDTO> updateProfile(@RequestBody PatientDTO dto, Authentication authentication) {
        return ResponseEntity.ok(patientService.updatePatientProfile(authentication.getName(), dto));
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorDTO>> searchDoctors(@RequestParam(required = false) String specialization) {
        return ResponseEntity.ok(patientService.searchDoctors(specialization));
    }

    @PostMapping("/appointments/book")
    public ResponseEntity<AppointmentResponse> bookAppointment(@Valid @RequestBody AppointmentRequest request, Authentication authentication) {
        return new ResponseEntity<>(appointmentService.bookAppointment(authentication.getName(), request), HttpStatus.CREATED);
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> getPatientAppointments(Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(authentication.getName()));
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<ApiResponse> cancelAppointment(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, authentication.getName()));
    }

    @GetMapping("/appointments/booked-slots")
    public ResponseEntity<List<String>> getBookedSlots(@RequestParam Long doctorId, @RequestParam String date) {
        java.time.LocalDate appointmentDate = java.time.LocalDate.parse(date);
        return ResponseEntity.ok(appointmentService.getBookedSlots(doctorId, appointmentDate));
    }
}
