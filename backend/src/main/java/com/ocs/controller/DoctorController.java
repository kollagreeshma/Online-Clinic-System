package com.ocs.controller;

import com.ocs.dto.ApiResponse;
import com.ocs.dto.AppointmentResponse;
import com.ocs.dto.DoctorDTO;
import com.ocs.dto.LeaveRequestDTO;
import com.ocs.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/profile")
    public ResponseEntity<DoctorDTO> getDoctorProfile(Authentication authentication) {
        return ResponseEntity.ok(doctorService.getDoctorByEmail(authentication.getName()));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> getDoctorAppointments(Authentication authentication) {
        return ResponseEntity.ok(doctorService.getDoctorAppointments(authentication.getName()));
    }

    @PutMapping("/availability/toggle")
    public ResponseEntity<ApiResponse> toggleAvailability(Authentication authentication) {
        return ResponseEntity.ok(doctorService.toggleAvailability(authentication.getName()));
    }

    @PostMapping("/leaves")
    public ResponseEntity<ApiResponse> requestLeave(@Valid @RequestBody LeaveRequestDTO leaveDTO, Authentication authentication) {
        return ResponseEntity.ok(doctorService.requestLeave(authentication.getName(), leaveDTO));
    }

    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveRequestDTO>> getDoctorLeaves(Authentication authentication) {
        return ResponseEntity.ok(doctorService.getDoctorLeaves(authentication.getName()));
    }
}
