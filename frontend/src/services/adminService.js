import api from './api';

export const adminService = {
  getStats: async () => {
    const res = await api.get('/admin/dashboard/stats');
    return res.data;
  },

  addDoctor: async (doctorData) => {
    const res = await api.post('/admin/doctors', doctorData);
    return res.data;
  },

  getAllDoctors: async () => {
    const res = await api.get('/admin/doctors');
    return res.data;
  },

  updateDoctor: async (id, doctorData) => {
    const res = await api.put(`/admin/doctors/${id}`, doctorData);
    return res.data;
  },

  deleteDoctor: async (id) => {
    const res = await api.delete(`/admin/doctors/${id}`);
    return res.data;
  },

  getAllPatients: async () => {
    const res = await api.get('/admin/patients');
    return res.data;
  },

  getAllAppointments: async () => {
    const res = await api.get('/admin/appointments');
    return res.data;
  },

  createSchedule: async (scheduleData) => {
    const res = await api.post('/admin/schedules', scheduleData);
    return res.data;
  },

  getDoctorSchedules: async (doctorId) => {
    const res = await api.get(`/admin/schedules/${doctorId}`);
    return res.data;
  },

  getAllLeaves: async () => {
    const res = await api.get('/admin/leaves');
    return res.data;
  },

  updateLeaveStatus: async (id, status) => {
    const res = await api.put(`/admin/leaves/${id}/status?status=${status}`);
    return res.data;
  },

  getAlternateDoctors: async (appointmentId) => {
    const res = await api.get(`/admin/appointments/${appointmentId}/alternate-doctors`);
    return res.data;
  },

  reassignDoctor: async (appointmentId, newDoctorId) => {
    const res = await api.put(`/admin/appointments/${appointmentId}/reassign/${newDoctorId}`);
    return res.data;
  }
};
