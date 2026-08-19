import api from './api';

export const doctorService = {
  getProfile: async () => {
    const res = await api.get('/doctor/profile');
    return res.data;
  },

  getAppointments: async () => {
    const res = await api.get('/doctor/appointments');
    return res.data;
  },

  toggleAvailability: async () => {
    const res = await api.put('/doctor/availability/toggle');
    return res.data;
  },

  requestLeave: async (leaveData) => {
    const res = await api.post('/doctor/leaves', leaveData);
    return res.data;
  },

  getLeaves: async () => {
    const res = await api.get('/doctor/leaves');
    return res.data;
  }
};
