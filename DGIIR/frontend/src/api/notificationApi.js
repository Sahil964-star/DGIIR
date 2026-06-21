import axiosClient from './axiosClient';

export const notificationApi = {
  getNotifications: async (params) => {
    const response = await axiosClient.get('/notifications', { params });
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await axiosClient.patch(`/notifications/${id}/read`);
    return response.data;
  },
};
