import api from './api';
import type { User, LoginCredentials, SignupData } from '../types';

interface AuthResponse {
  user: any; // backend User shape
  access_token?: string;
  token_type?: string;
}

function mapUser(raw: any): User {
  // Convert backend field names to the frontend User type expected in contexts
  return {
    id: String(raw.id),
    email: raw.email,
    fullName: raw.full_name ?? raw.fullName ?? '',
    whatsapp: raw.whatsapp ?? '',
    houseAddress: raw.house_address ?? raw.houseAddress ?? '',
    substituteAddress: raw.substitute_address ?? raw.substituteAddress ?? '',
    bankAccount: raw.bank_account_number ?? raw.bankAccount ?? '',
    bankName: raw.bank_name ?? raw.bankName ?? '',
    role: (raw.role === 'admin' ? 'admin' : 'regular') as 'admin' | 'regular',
    createdAt: raw.created_at ?? new Date().toISOString(),
    hasAcceptedTerms: !!raw.accepted_terms_at,
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/login', credentials);
    const data = response.data as AuthResponse;

    const token = data.access_token ?? (data as any).token ?? '';
    if (token) localStorage.setItem('token', token);

    const user = mapUser((data as any).user ?? (data as any));
    return { user, token };
  },

  async signup(data: SignupData): Promise<{ user: User; token: string }> {
  const payload = {
    email: data.email,
    password: data.password,
    full_name: data.fullName,
    whatsapp: data.whatsapp,
    house_address: data.houseAddress,
    substitute_address: data.substituteAddress,
    bank_account_number: data.bankAccount,
    bank_name: data.bankName,
  };

  const response = await api.post('/auth/signup', payload);
  const dataResp = response.data as AuthResponse;

  const token = dataResp.access_token ?? (dataResp as any).token ?? '';
  if (token) localStorage.setItem('token', token);

  const user = mapUser((dataResp as any).user ?? (dataResp as any));
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
