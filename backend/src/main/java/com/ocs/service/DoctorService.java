package com.ocs.service;

import java.util.List;

import com.ocs.dto.ApiResponse;
import com.ocs.dto.AppointmentResponse;
import com.ocs.dto.DoctorDTO;
import com.ocs.dto.LeaveRequestDTO;

public interface DoctorService {

    // Get all doctors - used by Admin dashboard
    List<DoctorDTO> getAllDoctors();

    // Get logged-in doctor's profile
    DoctorDTO getDoctorByEmail(String email);

    // Get logged-in doctor's appointments
    List<AppointmentResponse> getDoctorAppointments(String email);

    // Toggle doctor availability
    ApiResponse toggleAvailability(String email);

    // Request doctor leave
    ApiResponse requestLeave(String email, LeaveRequestDTO leaveDTO);

    // Get logged-in doctor's leaves
    List<LeaveRequestDTO> getDoctorLeaves(String email);
}