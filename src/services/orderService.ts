import api from './api';
import { mapOrder as _mapOrder } from './mappers';
import type { Order } from '../types';

export const orderService = {
  /**
   * Fetch all orders for current user or globally (admin)
   */
  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const endpoint = userId ? '/orders/my' : '/orders';
      const response = await api.get(endpoint);
      return (response.data ?? []).map((d: any) => _mapOrder(d));
    } catch (error) {
      console.error('Failed to fetch orders', error);
      throw error;
    }
  },

  /**
   * Get only current user's orders (alias)
   */
  async getMyOrders(): Promise<Order[]> {
    try {
      const response = await api.get('/orders/my');
      return (response.data ?? []).map((d: any) => _mapOrder(d));
    } catch (error) {
      console.error('Failed to fetch my orders', error);
      throw error;
    }
  },

  /**
   * ✅ Update order status (for sellers)
   * Example: /orders/{order_id}/status { status: "SHIPPED" }
   */
  async updateStatus(orderId: string, status: string): Promise<Order> {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return _mapOrder(response.data);
    } catch (error) {
      console.error(`Failed to update status for order ${orderId}`, error);
      throw error;
    }
  },

  /**
   * 🧩 Backward-compatible alias (old name)
   */
  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return this.updateStatus(orderId, status);
  },

  /**
   * Buyer confirms they received the item (DELIVERED)
   */
  async confirmReceipt(orderId: string): Promise<void> {
    try {
      await api.post(`/orders/${orderId}/confirm_received`);
    } catch (error) {
      console.error(`Failed to confirm receipt for order ${orderId}`, error);
      throw error;
    }
  },

  /**
   * Buyer marks order as satisfied (COMPLETED)
   */
  async markSatisfied(orderId: string): Promise<void> {
    try {
      await api.post(`/orders/${orderId}/confirm_satisfied`);
    } catch (error) {
      console.error(`Failed to mark order ${orderId} as satisfied`, error);
      throw error;
    }
  },
};
