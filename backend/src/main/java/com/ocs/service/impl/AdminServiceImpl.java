package com.ocs.service.impl;

import com.ocs.dto.*;
import com.ocs.entity.*;
import com.ocs.exception.BadRequestException;
import com.ocs.exception.ResourceNotFoundException;
import com.ocs.repository.*;
import com.ocs.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public DoctorDTO addDoctor(DoctorDTO dto) {
        String emailClean = dto.getEmail() != null ? dto.getEmail().trim() : "";
        if (userRepository.existsByEmail(emailClean)) {
            throw new BadRequestException("Doctor with email '" + emailClean + "' already exists!");
        }

        Role doctorRole = roleRepository.findByName("ROLE_DOCTOR")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_DOCTOR")));

        String defaultPass = (dto.getPassword() != null && !dto.getPassword().trim().isEmpty())
                ? dto.getPassword().trim()
                : "Doctor123!";
        User user = new User(
                emailClean,
                passwordEncoder.encode(defaultPass),
                dto.getFullName() != null ? dto.getFullName().trim() : "",
                doctorRole
        );
        userRepository.save(user);

        Doctor doctor = new Doctor(
                user,
                dto.getSpecialization(),
                dto.getQualification(),
                dto.getExperienceYears(),
                dto.getConsultationFee(),
                dto.getPhone()
        );
        Doctor savedDoctor = doctorRepository.save(doctor);

        return mapToDoctorDTO(savedDoctor);
    }

    @Override
    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::mapToDoctorDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DoctorDTO updateDoctor(Long doctorId, DoctorDTO dto) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));

        doctor.setSpecialization(dto.getSpecialization());
        doctor.setQualification(dto.getQualification());
        doctor.setExperienceYears(dto.getExperienceYears());
        doctor.setConsultationFee(dto.getConsultationFee());
        doctor.setPhone(dto.getPhone());
        doctor.setIsAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : doctor.getIsAvailable());

        doctor.getUser().setFullName(dto.getFullName());
        userRepository.save(doctor.getUser());

        Doctor updated = doctorRepository.save(doctor);
        return mapToDoctorDTO(updated);
    }

    @Override
    @Transactional
    public ApiResponse deleteDoctor(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));
        
        doctor.setIsAvailable(false);
        doctorRepository.save(doctor);
        return new ApiResponse(true, "Doctor marked as unavailable/deactivated successfully.");
    }

    @Override
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public DashboardStatsDTO getDashboardStats() {
        long totalDoctors = doctorRepository.count();
        long totalPatients = patientRepository.count();
        long totalAppointments = appointmentRepository.count();
        long pendingLeaves = leaveRepository.findByStatus("PENDING").size();

        return new DashboardStatsDTO(totalDoctors, totalPatients, totalAppointments, pendingLeaves);
    }

    @Override
    @Transactional
    public ScheduleDTO createOrUpdateSchedule(ScheduleDTO dto) {
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Schedule schedule = scheduleRepository.findByDoctorIdAndDayOfWeekIgnoreCase(dto.getDoctorId(), dto.getDayOfWeek())
                .orElse(new Schedule());

        schedule.setDoctor(doctor);
        schedule.setDayOfWeek(dto.getDayOfWeek().toUpperCase());
        schedule.setStartTime(dto.getStartTime());
        schedule.setEndTime(dto.getEndTime());
        schedule.setSlotDurationMinutes(dto.getSlotDurationMinutes() != null ? dto.getSlotDurationMinutes() : 30);

        Schedule saved = scheduleRepository.save(schedule);
        return mapToScheduleDTO(saved);
    }

    @Override
    public List<ScheduleDTO> getDoctorSchedules(Long doctorId) {
        return scheduleRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToScheduleDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeaveRequestDTO> getAllLeaves() {
        return leaveRepository.findAll().stream()
                .map(this::mapToLeaveDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ApiResponse updateLeaveStatus(Long leaveId, String status) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        leave.setStatus(status.toUpperCase());
        leaveRepository.save(leave);
        return new ApiResponse(true, "Leave request " + status.toLowerCase() + " successfully.");
    }

    @Override
    public List<DoctorDTO> getAlternateDoctors(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        String specialization = appointment.getDoctor().getSpecialization();
        Long currentDoctorId = appointment.getDoctor().getId();

        List<Doctor> alternates = doctorRepository.findBySpecializationIgnoreCaseAndIsAvailableTrueAndIdNot(
                specialization, currentDoctorId
        );

        return alternates.stream()
                .map(this::mapToDoctorDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ApiResponse reassignAppointmentDoctor(Long appointmentId, Long newDoctorId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        Doctor newDoctor = doctorRepository.findById(newDoctorId)
                .orElseThrow(() -> new ResourceNotFoundException("New doctor not found"));

        appointment.setDoctor(newDoctor);
        appointmentRepository.save(appointment);

        return new ApiResponse(true, "Appointment reassigned to Dr. " + newDoctor.getUser().getFullName() + " successfully.");
    }

    private DoctorDTO mapToDoctorDTO(Doctor doctor) {
        DoctorDTO dto = new DoctorDTO();
        dto.setId(doctor.getId());
        dto.setUserId(doctor.getUser().getId());
        dto.setFullName(doctor.getUser().getFullName());
        dto.setEmail(doctor.getUser().getEmail());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setQualification(doctor.getQualification());
        dto.setExperienceYears(doctor.getExperienceYears());
        dto.setConsultationFee(doctor.getConsultationFee());
        dto.setPhone(doctor.getPhone());
        dto.setIsAvailable(doctor.getIsAvailable());
        return dto;
    }

    private ScheduleDTO mapToScheduleDTO(Schedule schedule) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setId(schedule.getId());
        dto.setDoctorId(schedule.getDoctor().getId());
        dto.setDoctorName(schedule.getDoctor().getUser().getFullName());
        dto.setDayOfWeek(schedule.getDayOfWeek());
        dto.setStartTime(schedule.getStartTime());
        dto.setEndTime(schedule.getEndTime());
        dto.setSlotDurationMinutes(schedule.getSlotDurationMinutes());
        return dto;
    }

    private LeaveRequestDTO mapToLeaveDTO(Leave leave) {
        LeaveRequestDTO dto = new LeaveRequestDTO();
        dto.setId(leave.getId());
        dto.setDoctorId(leave.getDoctor().getId());
        dto.setDoctorName(leave.getDoctor().getUser().getFullName());
        dto.setStartDate(leave.getStartDate());
        dto.setEndDate(leave.getEndDate());
        dto.setReason(leave.getReason());
        dto.setStatus(leave.getStatus());
        return dto;
    }
}
