package com.ocs.controller;

import com.ocs.dto.*;
import com.ocs.entity.Patient;
import com.ocs.service.AdminService;
import com.ocs.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @PostMapping("/doctors")
    public ResponseEntity<DoctorDTO> addDoctor(@Valid @RequestBody DoctorDTO doctorDTO) {
        return new ResponseEntity<>(adminService.addDoctor(doctorDTO), HttpStatus.CREATED);
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorDTO>> getAllDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<DoctorDTO> updateDoctor(@PathVariable Long id, @Valid @RequestBody DoctorDTO doctorDTO) {
        return ResponseEntity.ok(adminService.updateDoctor(id, doctorDTO));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse> deleteDoctor(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deleteDoctor(id));
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(adminService.getAllPatients());
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @PostMapping("/schedules")
    public ResponseEntity<ScheduleDTO> createSchedule(@Valid @RequestBody ScheduleDTO scheduleDTO) {
        return ResponseEntity.ok(adminService.createOrUpdateSchedule(scheduleDTO));
    }

    @GetMapping("/schedules/{doctorId}")
    public ResponseEntity<List<ScheduleDTO>> getDoctorSchedules(@PathVariable Long doctorId) {
        return ResponseEntity.ok(adminService.getDoctorSchedules(doctorId));
    }

    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveRequestDTO>> getAllLeaves() {
        return ResponseEntity.ok(adminService.getAllLeaves());
    }

    @PutMapping("/leaves/{id}/status")
    public ResponseEntity<ApiResponse> updateLeaveStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(adminService.updateLeaveStatus(id, status));
    }

    @GetMapping("/appointments/{id}/alternate-doctors")
    public ResponseEntity<List<DoctorDTO>> getAlternateDoctors(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getAlternateDoctors(id));
    }

    @PutMapping("/appointments/{id}/reassign/{newDoctorId}")
    public ResponseEntity<ApiResponse> reassignDoctor(@PathVariable Long id, @PathVariable Long newDoctorId) {
        return ResponseEntity.ok(adminService.reassignAppointmentDoctor(id, newDoctorId));
    }
}
