import axiosClient from './axiosClient';

export const authApi = {
  login: async ({ email, password, role }) => {
    const response = await axiosClient.post('/auth/login', { email, password, role });
    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },

  requestOtp: async (phone) => {
    const response = await axiosClient.post('/auth/request-otp', { phone });
    return response.data;
  },

  verifyOtp: async ({ phone, otp }) => {
    const response = await axiosClient.post('/auth/verify-otp', { phone, otp });
    return response.data;
  },
};
