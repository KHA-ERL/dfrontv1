import api from './api';

export const sellerService = {
  async getStats() {
    const resp = await api.get('/seller/stats');
    return resp.data;
  },
  async getSalesSummary() {
    const res = await api.get('/seller/sales/summary');
    return res.data; // { total_sales: number }
  }
};
