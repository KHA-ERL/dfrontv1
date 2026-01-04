import api from './api';
import { mapUser } from './mappers';
import type { User, SignupData, LoginData } from '../types';

interface AuthResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
  user?: any;
}

export const authService = {
  async login(data: LoginData): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/login', {
      email: data.email,
      password: data.password,
    });
    
    const dataResp = response.data as AuthResponse;
    const token = dataResp.accessToken ?? dataResp.access_token ?? dataResp.token ?? '';
    
    if (token) localStorage.setItem('token', token);
    
    const user = mapUser(dataResp.user ?? dataResp);
    return { user, token };
  },

  async signup(data: SignupData): Promise<{ user: User; token: string }> {
    const payload = {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      whatsapp: data.whatsapp,
      houseAddress: data.houseAddress,
      substituteAddress: data.substituteAddress,
      bankAccountNumber: data.bankAccount,
      bankName: data.bankName,
    };
    
    const response = await api.post('/auth/signup', payload);
    const dataResp = response.data as AuthResponse;
    const token = dataResp.accessToken ?? dataResp.access_token ?? dataResp.token ?? '';
    
    if (token) localStorage.setItem('token', token);
    
    const user = mapUser(dataResp.user ?? dataResp);
    return { user, token };
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/users/me');
    const raw = response.data;
    return mapUser(raw);
  },

  async acceptTerms(): Promise<User> {
    const response = await api.post('/auth/accept-terms');
    const raw = response.data;
    return mapUser(raw);
  },
};
