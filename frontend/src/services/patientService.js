import api from './api';

export const patientService = {
  getProfile: async () => {
    const res = await api.get('/patient/profile');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put('/patient/profile', data);
    return res.data;
  },

  searchDoctors: async (specialization = '') => {
    const res = await api.get(`/patient/doctors${specialization ? `?specialization=${specialization}` : ''}`);
    return res.data;
  },

  bookAppointment: async (bookingData) => {
    const res = await api.post('/patient/appointments/book', bookingData);
    return res.data;
  },

  getAppointments: async () => {
    const res = await api.get('/patient/appointments');
    return res.data;
  },

  cancelAppointment: async (id) => {
    const res = await api.delete(`/patient/appointments/${id}`);
    return res.data;
  },

  getBookedSlots: async (doctorId, date) => {
    const res = await api.get(`/patient/appointments/booked-slots?doctorId=${doctorId}&date=${date}`);
    return res.data;
  }
};
