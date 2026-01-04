import api from './api';
import { mapUser } from './mappers';
import type { User } from '../types';

interface UpdateUserData {
  substituteAddress?: string;
  bankAccountNumber?: string;
  bankName?: string;
}

export const userService = {
  async updateProfile(data: UpdateUserData): Promise<User> {
    // Use PUT instead of PATCH to match backend
    const response = await api.put('/users/me', data);
    return mapUser(response.data);
  },
};
