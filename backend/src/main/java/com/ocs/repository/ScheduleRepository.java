package com.ocs.repository;

import com.ocs.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDoctorId(Long doctorId);
    Optional<Schedule> findByDoctorIdAndDayOfWeekIgnoreCase(Long doctorId, String dayOfWeek);
}
