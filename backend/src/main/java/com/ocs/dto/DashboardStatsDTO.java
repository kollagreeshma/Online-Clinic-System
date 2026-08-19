package com.ocs.dto;

public class DashboardStatsDTO {
    private Long totalDoctors;
    private Long totalPatients;
    private Long totalAppointments;
    private Long pendingLeaves;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(Long totalDoctors, Long totalPatients, Long totalAppointments, Long pendingLeaves) {
        this.totalDoctors = totalDoctors;
        this.totalPatients = totalPatients;
        this.totalAppointments = totalAppointments;
        this.pendingLeaves = pendingLeaves;
    }

    public Long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(Long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public Long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(Long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public Long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(Long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public Long getPendingLeaves() {
        return pendingLeaves;
    }

    public void setPendingLeaves(Long pendingLeaves) {
        this.pendingLeaves = pendingLeaves;
    }
}
