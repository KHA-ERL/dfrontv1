import api from './api';

export const userService = {
  async getProfile() {
    const resp = await api.get('/users/me');
    return resp.data;
  },

  async updateProfile(payload: any) {
    const resp = await api.put('/users/me', payload);
    return resp.data;
  },
};
