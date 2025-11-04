import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { Order } from '../../types';
import { orderService } from '../../services/orderService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatCurrency, formatDateTime } from '../../utils/validation';
import { toast } from 'react-toastify';

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadOrders();
  }, [searchTerm, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      let filteredOrders = data;
      
      if (searchTerm) {
        filteredOrders = filteredOrders.filter(order =>
          order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.buyer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.seller.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
      }
      
      setOrders(filteredOrders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'UNDER_REVIEW':
        return <Clock className="text-yellow-600" size={16} />;
      case 'PROCESSING':
        return <Package className="text-blue-600" size={16} />;
      case 'SHIPPED':
        return <Package className="text-purple-600" size={16} />;
      case 'DELIVERED':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'COMPLETED':
        return <CheckCircle className="text-green-800" size={16} />;
      default:
        return <AlertCircle className="text-gray-600" size={16} />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'UNDER_REVIEW':
        return 'text-yellow-800 bg-yellow-100';
      case 'PROCESSING':
        return 'text-blue-800 bg-blue-100';
      case 'SHIPPED':
        return 'text-purple-800 bg-purple-100';
      case 'DELIVERED':
        return 'text-green-800 bg-green-100';
      case 'COMPLETED':
        return 'text-green-900 bg-green-200';
      default:
        return 'text-gray-800 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage all orders across the platform
        </p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="COMPLETED">Completed</option>
            </select>
            
            <Button variant="outline" className="flex items-center justify-center">
              Export Orders
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden">
          {loading ? (
            <LoadingSpinner className="py-20" size="lg" />
          ) : (
            <Table headers={['Order ID', 'Product', 'Buyer', 'Seller', 'Amount', 'Status', 'Date', 'Actions']}>
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={order.product.images[0]}
                        alt={order.product.name}
                        className="h-12 w-12 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.product.name}</div>
                        <div className="text-sm text-gray-500">{order.product.condition}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.buyer.fullName}</div>
                    <div className="text-sm text-gray-500">{order.buyer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.seller.fullName}</div>
                    <div className="text-sm text-gray-500">{order.seller.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Card>
      </motion.div>

      {/* Order Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Product Information</h4>
                <div className="space-y-3">
                  <img
                    src={selectedOrder.product.images[0]}
                    alt={selectedOrder.product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{selectedOrder.product.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.product.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Price:</span>
                      <p className="font-semibold">{formatCurrency(selectedOrder.product.price)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Delivery:</span>
                      <p className="font-semibold">{formatCurrency(selectedOrder.product.deliveryFee)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500 text-sm">Order ID:</span>
                    <p className="font-semibold">#{selectedOrder.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Total Amount:</span>
                    <p className="font-semibold text-lg">{formatCurrency(selectedOrder.totalAmount)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Current Status:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusIcon(selectedOrder.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Order Date:</span>
                    <p className="font-semibold">{formatDateTime(selectedOrder.createdAt)}</p>
                  </div>
                  {selectedOrder.deliveredAt && (
                    <div>
                      <span className="text-gray-500 text-sm">Delivered At:</span>
                      <p className="font-semibold">{formatDateTime(selectedOrder.deliveredAt)}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <h5 className="font-medium text-gray-900 mb-2">Update Status</h5>
                  <div className="space-y-2">
                    {['UNDER_REVIEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selectedOrder.status === status ? 'primary' : 'outline'}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status as Order['status'])}
                        className="w-full justify-start"
                      >
                        {status.replace('_', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Buyer Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Name:</span> {selectedOrder.buyer.fullName}</p>
                  <p><span className="text-gray-500">Email:</span> {selectedOrder.buyer.email}</p>
                  <p><span className="text-gray-500">WhatsApp:</span> {selectedOrder.buyer.whatsapp}</p>
                  <p><span className="text-gray-500">Address:</span> {selectedOrder.buyer.houseAddress}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Seller Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Name:</span> {selectedOrder.seller.fullName}</p>
                  <p><span className="text-gray-500">Email:</span> {selectedOrder.seller.email}</p>
                  <p><span className="text-gray-500">WhatsApp:</span> {selectedOrder.seller.whatsapp}</p>
                  <p><span className="text-gray-500">Bank:</span> {selectedOrder.seller.bankName}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};