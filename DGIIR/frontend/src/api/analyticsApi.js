import axiosClient from './axiosClient';

export const analyticsApi = {
  getOperationsOverview: async () => {
    const response = await axiosClient.get('/analytics/operations/overview');
    return response.data;
  },

  getOperationsSla: async () => {
    const response = await axiosClient.get('/analytics/operations/sla');
    return response.data;
  },

  getCmOverview: async (params) => {
    const response = await axiosClient.get('/analytics/cm/overview', { params });
    return response.data;
  },

  getCmTopConcerns: async (params) => {
    const response = await axiosClient.get('/analytics/cm/top-concerns', { params });
    return response.data;
  },

  getCmDistrictRisk: async (params) => {
    const response = await axiosClient.get('/analytics/cm/district-risk', { params });
    return response.data;
  },

  getCmResolutionTime: async (params) => {
    const response = await axiosClient.get('/analytics/cm/resolution-time', { params });
    return response.data;
  },

  getCmPriority: async (params) => {
    const response = await axiosClient.get('/analytics/cm/priority', { params });
    return response.data;
  },
};
