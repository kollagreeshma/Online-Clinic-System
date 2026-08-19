package com.ocs.service;

import com.ocs.dto.ApiResponse;
import com.ocs.dto.AppointmentRequest;
import com.ocs.dto.AppointmentResponse;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    AppointmentResponse bookAppointment(String patientEmail, AppointmentRequest request);
    List<AppointmentResponse> getPatientAppointments(String patientEmail);
    ApiResponse cancelAppointment(Long appointmentId, String userEmail);
    List<AppointmentResponse> getAllAppointments();
    List<String> getBookedSlots(Long doctorId, LocalDate date);
}
