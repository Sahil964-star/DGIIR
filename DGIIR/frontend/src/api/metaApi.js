import axiosClient from './axiosClient';

export const metaApi = {
  getDistricts: async () => {
    const response = await axiosClient.get('/meta/districts');
    return response.data;
  },

  getDepartments: async () => {
    const response = await axiosClient.get('/meta/departments');
    return response.data;
  },

  getCategories: async () => {
    const response = await axiosClient.get('/meta/categories');
    return response.data;
  },
};
