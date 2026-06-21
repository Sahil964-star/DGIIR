import axiosClient from './axiosClient';

export const officerApi = {
  getMyComplaints: async (params) => {
    const response = await axiosClient.get('/officer/my-complaints', { params });
    return response.data;
  },

  getWorkload: async () => {
    const response = await axiosClient.get('/officer/workload');
    return response.data;
  },

  getPerformance: async () => {
    const response = await axiosClient.get('/officer/performance');
    return response.data;
  },
};
