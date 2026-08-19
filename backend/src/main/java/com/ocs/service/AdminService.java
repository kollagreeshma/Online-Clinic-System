package com.ocs.service;

import java.util.List;

import com.ocs.dto.ApiResponse;
import com.ocs.dto.DashboardStatsDTO;
import com.ocs.dto.DoctorDTO;
import com.ocs.dto.LeaveRequestDTO;
import com.ocs.dto.ScheduleDTO;
import com.ocs.entity.Patient;

public interface AdminService {
    DoctorDTO addDoctor(DoctorDTO doctorDTO);
    List<DoctorDTO> getAllDoctors();
    DoctorDTO updateDoctor(Long doctorId, DoctorDTO doctorDTO);
    ApiResponse deleteDoctor(Long doctorId);
    
    List<Patient> getAllPatients();
    DashboardStatsDTO getDashboardStats();

    ScheduleDTO createOrUpdateSchedule(ScheduleDTO scheduleDTO);
    List<ScheduleDTO> getDoctorSchedules(Long doctorId);

    List<LeaveRequestDTO> getAllLeaves();
    ApiResponse updateLeaveStatus(Long leaveId, String status);

    List<DoctorDTO> getAlternateDoctors(Long appointmentId);
    ApiResponse reassignAppointmentDoctor(Long appointmentId, Long newDoctorId);
}
