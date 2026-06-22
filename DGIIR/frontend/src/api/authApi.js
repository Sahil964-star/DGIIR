import axiosClient from './axiosClient';

export const authApi = {
  // Staff Login
  login: async ({ email, password }) => {
    const response = await axiosClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // Citizen OTP Request
  requestOtp: async (phone) => {
    const response = await axiosClient.post('/auth/request-otp', {
      phone,
    });
    return response.data;
  },

  // Citizen OTP Verification
  verifyOtp: async ({ phone, otp, name, email, districtId }) => {
    const response = await axiosClient.post('/auth/verify-otp', {
      phone,
      otp,
      name,
      email,
      districtId
    });
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (phone) => {
    const response = await axiosClient.post('/auth/forgot-password', {
      phone,
    });
    return response.data;
  },

  // Reset Password
  resetPassword: async ({ phone, otp, newPassword }) => {
    const response = await axiosClient.post('/auth/reset-password', {
      phone,
      otp,
      newPassword,
    });
    return response.data;
  },

  // Current User
  getCurrentUser: async () => {
    const response = await axiosClient.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosClient.post('/auth/logout');
    return response.data;
  },
};