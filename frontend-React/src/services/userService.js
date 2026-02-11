import api from './api';

const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data.users;
  },

  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data.user;
  },

  delete: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

export default userService;