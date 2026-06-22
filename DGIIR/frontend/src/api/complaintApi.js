import axiosClient from './axiosClient';

export const complaintApi = {
  createComplaint: async (data) => {
    const response = await axiosClient.post('/complaints', data);
    return response.data;
  },

  getComplaints: async (params) => {
    const response = await axiosClient.get('/complaints', { params });
    return response.data;
  },

  getComplaintById: async (id) => {
    const response = await axiosClient.get(`/complaints/${id}`);
    return response.data;
  },

  uploadMedia: async (id, formData) => {
    const response = await axiosClient.post(`/complaints/${id}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  verifyComplaint: async (id, verificationData) => {
    const response = await axiosClient.post(`/complaints/${id}/verify`, verificationData);
    return response.data;
  },

  updateStatus: async (id, statusData) => {
    const response = await axiosClient.patch(`/complaints/${id}/status`, statusData);
    return response.data;
  },

  assignComplaint: async (id, assignData) => {
    const response = await axiosClient.patch(`/complaints/${id}/assign`, assignData);
    return response.data;
  },

  acceptComplaint: async (id) => {
    const response = await axiosClient.post(`/complaints/${id}/accept`);
    return response.data;
  },

  rejectComplaint: async (id, rejectData) => {
    const response = await axiosClient.post(`/complaints/${id}/reject`, rejectData);
    return response.data;
  },

  escalateComplaint: async (id, escalateData) => {
    const response = await axiosClient.post(`/complaints/${id}/escalate`, escalateData);
    return response.data;
  },
};
