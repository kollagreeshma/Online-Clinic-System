package com.ocs.service.impl;

import com.ocs.dto.DoctorDTO;
import com.ocs.dto.PatientDTO;
import com.ocs.entity.Doctor;
import com.ocs.entity.Patient;
import com.ocs.entity.User;
import com.ocs.exception.ResourceNotFoundException;
import com.ocs.repository.DoctorRepository;
import com.ocs.repository.PatientRepository;
import com.ocs.repository.UserRepository;
import com.ocs.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public PatientDTO getPatientByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + email));
        return mapToPatientDTO(patient);
    }

    @Override
    @Transactional
    public PatientDTO updatePatientProfile(String email, PatientDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getAge() != null) patient.setAge(dto.getAge());
        if (dto.getGender() != null) patient.setGender(dto.getGender());
        if (dto.getBloodGroup() != null) patient.setBloodGroup(dto.getBloodGroup());
        if (dto.getPhone() != null) patient.setPhone(dto.getPhone());
        if (dto.getAddress() != null) patient.setAddress(dto.getAddress());

        userRepository.save(user);
        Patient updated = patientRepository.save(patient);
        return mapToPatientDTO(updated);
    }

    @Override
    public List<DoctorDTO> searchDoctors(String specialization) {
        if (specialization == null || specialization.trim().isEmpty()) {
            return getAllAvailableDoctors();
        }
        return doctorRepository.findBySpecializationContainingIgnoreCaseAndIsAvailableTrue(specialization)
                .stream()
                .map(this::mapToDoctorDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorDTO> getAllAvailableDoctors() {
        return doctorRepository.findByIsAvailableTrue().stream()
                .map(this::mapToDoctorDTO)
                .collect(Collectors.toList());
    }

    private PatientDTO mapToPatientDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setUserId(patient.getUser().getId());
        dto.setFullName(patient.getUser().getFullName());
        dto.setEmail(patient.getUser().getEmail());
        dto.setAge(patient.getAge());
        dto.setGender(patient.getGender());
        dto.setBloodGroup(patient.getBloodGroup());
        dto.setPhone(patient.getPhone());
        dto.setAddress(patient.getAddress());
        return dto;
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
}
