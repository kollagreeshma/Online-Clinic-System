package com.ocs.repository;

import com.ocs.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserId(Long userId);
    List<Doctor> findBySpecializationContainingIgnoreCaseAndIsAvailableTrue(String specialization);
    List<Doctor> findByIsAvailableTrue();
    List<Doctor> findBySpecializationIgnoreCaseAndIsAvailableTrueAndIdNot(String specialization, Long doctorId);
}
