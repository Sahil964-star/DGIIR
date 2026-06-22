import axiosClient from './axiosClient';

export const complaintApi = {
  /**
   * Creates a complaint. Accepts either a plain object or a FormData instance.
   * If a plain object is passed, the image (optional File) should be included
   * as the `image` key — this fn will build the FormData automatically.
   */
  createComplaint: async (data) => {
    let payload;
    let headers = {};

    if (data instanceof FormData) {
      payload = data;
      headers = { 'Content-Type': 'multipart/form-data' };
    } else {
      // Build FormData so the server can handle text + optional image in one request
      const fd = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          fd.append('image', value);
        } else if (value !== undefined && value !== null) {
          fd.append(key, String(value));
        }
      });
      payload = fd;
      headers = { 'Content-Type': 'multipart/form-data' };
    }

    const response = await axiosClient.post('/complaints', payload, { headers });
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

  updateStatus: async (id, data) => {
    const response = await axiosClient.patch(`/complaints/${id}/status`, data);
    return response.data;
  },

  overrideClassification: async (id, data) => {
    const response = await axiosClient.patch(`/complaints/${id}/ai-override`, data);
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
