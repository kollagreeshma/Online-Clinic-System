import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.accessToken) {
      localStorage.setItem('ocs_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  registerPatient: async (patientData) => {
    const response = await api.post('/auth/register', patientData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('ocs_user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('ocs_user') || 'null');
  }
};
