package com.ocs.service;

import java.util.List;

import com.ocs.dto.DoctorDTO;
import com.ocs.dto.PatientDTO;

public interface PatientService {
    PatientDTO getPatientByEmail(String email);
    PatientDTO updatePatientProfile(String email, PatientDTO patientDTO);
    List<DoctorDTO> searchDoctors(String specialization);
    List<DoctorDTO> getAllAvailableDoctors();
}
