package com.ocs.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ocs.dto.ApiResponse;
import com.ocs.dto.AppointmentResponse;
import com.ocs.dto.DoctorDTO;
import com.ocs.dto.LeaveRequestDTO;
import com.ocs.entity.Doctor;
import com.ocs.entity.Leave;
import com.ocs.entity.User;
import com.ocs.exception.ResourceNotFoundException;
import com.ocs.repository.AppointmentRepository;
import com.ocs.repository.DoctorRepository;
import com.ocs.repository.LeaveRepository;
import com.ocs.repository.UserRepository;
import com.ocs.service.DoctorService;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private LeaveRepository leaveRepository;

    // =========================================================
    // ADMIN: GET ALL DOCTORS
    // =========================================================
    @Override
    @Transactional(readOnly = true)
    public List<DoctorDTO> getAllDoctors() {

        return doctorRepository.findAll()
                .stream()
                .map(this::mapToDoctorDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // DOCTOR: GET OWN PROFILE
    // =========================================================
    @Override
    @Transactional(readOnly = true)
    public DoctorDTO getDoctorByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        )
                );

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Doctor profile not found for user: " + email
                        )
                );

        return mapToDoctorDTO(doctor);
    }

    // =========================================================
    // DOCTOR: GET OWN APPOINTMENTS
    // =========================================================
    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getDoctorAppointments(String email) {

        DoctorDTO doctorDTO = getDoctorByEmail(email);

        return appointmentRepository
                .findByDoctorIdOrderByAppointmentDateAscAppointmentTimeAsc(
                        doctorDTO.getId()
                )
                .stream()
                .map(app -> {

                    AppointmentResponse response =
                            new AppointmentResponse();

                    response.setId(app.getId());

                    response.setPatientId(
                            app.getPatient().getId()
                    );

                    response.setPatientName(
                            app.getPatient().getUser().getFullName()
                    );

                    response.setPatientPhone(
                            app.getPatient().getPhone()
                    );

                    response.setDoctorId(
                            app.getDoctor().getId()
                    );

                    response.setDoctorName(
                            app.getDoctor().getUser().getFullName()
                    );

                    response.setSpecialization(
                            app.getDoctor().getSpecialization()
                    );

                    response.setConsultationFee(
                            app.getDoctor().getConsultationFee()
                    );

                    response.setAppointmentDate(
                            app.getAppointmentDate()
                    );

                    response.setAppointmentTime(
                            app.getAppointmentTime()
                    );

                    response.setStatus(
                            app.getStatus()
                    );

                    response.setSymptoms(
                            app.getSymptoms()
                    );

                    return response;
                })
                .collect(Collectors.toList());
    }

    // =========================================================
    // DOCTOR: TOGGLE AVAILABILITY
    // =========================================================
    @Override
    @Transactional
    public ApiResponse toggleAvailability(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Doctor profile not found"
                        )
                );

        doctor.setIsAvailable(
                !doctor.getIsAvailable()
        );

        doctorRepository.save(doctor);

        String status = doctor.getIsAvailable()
                ? "AVAILABLE"
                : "UNAVAILABLE";

        return new ApiResponse(
                true,
                "Availability status updated to: " + status
        );
    }

    // =========================================================
    // DOCTOR: REQUEST LEAVE
    // =========================================================
    @Override
    @Transactional
    public ApiResponse requestLeave(
            String email,
            LeaveRequestDTO leaveDTO
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Doctor profile not found"
                        )
                );

        Leave leave = new Leave(
                doctor,
                leaveDTO.getStartDate(),
                leaveDTO.getEndDate(),
                leaveDTO.getReason(),
                "PENDING"
        );

        leaveRepository.save(leave);

        return new ApiResponse(
                true,
                "Leave request submitted successfully. Pending Admin approval."
        );
    }

    // =========================================================
    // DOCTOR: GET OWN LEAVES
    // =========================================================
    @Override
    @Transactional(readOnly = true)
    public List<LeaveRequestDTO> getDoctorLeaves(String email) {

        DoctorDTO doctorDTO = getDoctorByEmail(email);

        return leaveRepository
                .findByDoctorId(doctorDTO.getId())
                .stream()
                .map(leave -> {

                    LeaveRequestDTO dto =
                            new LeaveRequestDTO();

                    dto.setId(
                            leave.getId()
                    );

                    dto.setDoctorId(
                            leave.getDoctor().getId()
                    );

                    dto.setDoctorName(
                            leave.getDoctor()
                                    .getUser()
                                    .getFullName()
                    );

                    dto.setStartDate(
                            leave.getStartDate()
                    );

                    dto.setEndDate(
                            leave.getEndDate()
                    );

                    dto.setReason(
                            leave.getReason()
                    );

                    dto.setStatus(
                            leave.getStatus()
                    );

                    return dto;
                })
                .collect(Collectors.toList());
    }

    // =========================================================
    // COMMON: MAP DOCTOR ENTITY TO DOCTOR DTO
    // =========================================================
    private DoctorDTO mapToDoctorDTO(Doctor doctor) {

        DoctorDTO dto = new DoctorDTO();

        dto.setId(
                doctor.getId()
        );

        dto.setUserId(
                doctor.getUser().getId()
        );

        dto.setFullName(
                doctor.getUser().getFullName()
        );

        dto.setEmail(
                doctor.getUser().getEmail()
        );

        dto.setSpecialization(
                doctor.getSpecialization()
        );

        dto.setQualification(
                doctor.getQualification()
        );

        dto.setExperienceYears(
                doctor.getExperienceYears()
        );

        dto.setConsultationFee(
                doctor.getConsultationFee()
        );

        dto.setPhone(
                doctor.getPhone()
        );

        dto.setIsAvailable(
                doctor.getIsAvailable()
        );

        return dto;
    }
}