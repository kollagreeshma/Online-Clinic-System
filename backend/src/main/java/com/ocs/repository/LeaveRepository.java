package com.ocs.repository;

import com.ocs.entity.Leave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByDoctorId(Long doctorId);
    List<Leave> findByStatus(String status);
}
