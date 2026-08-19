package com.ocs.service.impl;

import com.ocs.dto.ApiResponse;
import com.ocs.dto.AppointmentRequest;
import com.ocs.dto.AppointmentResponse;
import com.ocs.entity.Appointment;
import com.ocs.entity.Doctor;
import com.ocs.entity.Patient;
import com.ocs.entity.User;
import com.ocs.exception.BadRequestException;
import com.ocs.exception.ResourceNotFoundException;
import com.ocs.repository.AppointmentRepository;
import com.ocs.repository.DoctorRepository;
import com.ocs.repository.PatientRepository;
import com.ocs.repository.UserRepository;
import com.ocs.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    @Transactional
    public AppointmentResponse bookAppointment(String patientEmail, AppointmentRequest request) {
        User user = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + request.getDoctorId()));

        if (!doctor.getIsAvailable()) {
            throw new BadRequestException("Dr. " + doctor.getUser().getFullName() + " is currently unavailable for appointments.");
        }

        boolean isSlotTaken = appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                doctor.getId(), request.getAppointmentDate(), request.getAppointmentTime(), "CANCELLED"
        );

        if (isSlotTaken) {
            throw new BadRequestException("The selected time slot " + request.getAppointmentTime() + " on " + request.getAppointmentDate() + " is already booked.");
        }

        Appointment appointment = new Appointment(
                patient,
                doctor,
                request.getAppointmentDate(),
                request.getAppointmentTime(),
                "CONFIRMED",
                request.getSymptoms()
        );

        Appointment saved = appointmentRepository.save(appointment);
        return mapToResponse(saved);
    }

    @Override
    public List<AppointmentResponse> getPatientAppointments(String patientEmail) {
        User user = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        return appointmentRepository.findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(patient.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ApiResponse cancelAppointment(Long appointmentId, String userEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        appointment.setStatus("CANCELLED");
        appointmentRepository.save(appointment);
        return new ApiResponse(true, "Appointment cancelled successfully.");
    }

    @Override
    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getBookedSlots(Long doctorId, java.time.LocalDate date) {
        return appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date).stream()
                .filter(app -> !"CANCELLED".equalsIgnoreCase(app.getStatus()))
                .map(app -> app.getAppointmentTime().toString())
                .collect(Collectors.toList());
    }

    private AppointmentResponse mapToResponse(Appointment app) {
        AppointmentResponse res = new AppointmentResponse();
        res.setId(app.getId());
        res.setPatientId(app.getPatient().getId());
        res.setPatientName(app.getPatient().getUser().getFullName());
        res.setPatientPhone(app.getPatient().getPhone());
        res.setDoctorId(app.getDoctor().getId());
        res.setDoctorName(app.getDoctor().getUser().getFullName());
        res.setSpecialization(app.getDoctor().getSpecialization());
        res.setConsultationFee(app.getDoctor().getConsultationFee());
        res.setAppointmentDate(app.getAppointmentDate());
        res.setAppointmentTime(app.getAppointmentTime());
        res.setStatus(app.getStatus());
        res.setSymptoms(app.getSymptoms());
        return res;
    }
}
