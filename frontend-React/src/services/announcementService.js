import api from './api';

const announcementService = {
  getAll: async () => {
    const response = await api.get('/announcements');
    return response.data.announcements;
  },

  create: async (data) => {
    const response = await api.post('/announcements', data);
    return response.data.announcement;
  },

  update: async (id, data) => {
    const response = await api.put(`/announcements/${id}`, data);
    return response.data.announcement;
  },

  delete: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },
};

export default announcementService;