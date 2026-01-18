import api from './api';
import { mapProduct as _mapProduct } from './mappers';
import type { Product } from '../types';

export const productService = {
  async getProducts(filters?: {
    search?: string;
    location?: string;
    condition?: string;
  }): Promise<Product[]> {
    const params: any = {};
    if (filters?.search?.trim()) params.search = filters.search.trim();
    if (filters?.location?.trim()) params.location = filters.location.trim().toLowerCase();
    if (filters?.condition?.trim()) params.condition = filters.condition.toLowerCase();

    const resp = await api.get('/products', { params });
    const rows = resp.data ?? [];
    return rows.map((r: any) => _mapProduct(r));
  },

  async getProduct(id: string): Promise<Product> {
    const resp = await api.get(`/products/${id}`);
    const mapped = _mapProduct(resp.data);
    if (!mapped) throw new Error('Product not found');
    return mapped;
  },

  async purchaseProduct(productId: string): Promise<{
    success?: boolean;
    orderId?: string;
    authorization_url?: string;
    reference?: string;
  }> {
    // call the backend to create order + initialize paystack transaction
    // Backend expects productId as an integer
    // Pass callback URL so Paystack redirects back after payment
    const callbackUrl = `${window.location.origin}/payment/callback`;
    const resp = await api.post('/payments/initialize', {
      productId: parseInt(productId, 10),
      callbackUrl
    });
    // backend returns authorization_url and reference and orderId
    const data = resp.data ?? {};
    const d = data;
    return {
      success: d.ok ?? false,
      orderId: d.orderId ?? d.order_id,
      authorization_url: d.authorization_url ?? d.authorizationUrl ?? d.raw?.data?.authorization_url,
      reference: d.reference ?? d.raw?.data?.reference,
    };
  },

  async getMyProducts(userId: string): Promise<Product[]> {
    const resp = await api.get('/products');
    const all = resp.data ?? [];
    // filter by seller id in raw payload (works across variants)
    const filtered = all.filter((p: any) => {
      const sid = String(p.sellerId ?? p.seller?.id ?? p.seller_id ?? '');
      return sid === String(userId);
    });
    return filtered.map((r: any) => _mapProduct(r));
  },

  async createProduct(data: FormData): Promise<Product> {
    const resp = await api.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const mapped = _mapProduct(resp.data);
    if (!mapped) throw new Error('Failed to create product');
    return mapped;
  },

  async updateProduct(productId: string, data: { price?: number; [key: string]: any }): Promise<Product> {
    const resp = await api.put(`/products/${productId}`, data);
    const mapped = _mapProduct(resp.data);
    if (!mapped) throw new Error('Failed to update product');
    return mapped;
  },
};
