import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, AlertCircle, Eye, MessageSquare } from 'lucide-react';
import type { Order } from '../../types';
import { orderService } from '../../services/orderService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatCurrency, formatDateTime } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

export const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintReasons, setComplaintReasons] = useState<string[]>([]);
  const [complaintDescription, setComplaintDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'buying' | 'selling'>('buying');
  const [statusUpdates, setStatusUpdates] = useState<{ [orderId: string]: string }>({});

  useEffect(() => {
    loadOrders();
  }, [user, activeTab]);

  const loadOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await orderService.getOrders(user.id);
      const filteredOrders = data.filter(order =>
        activeTab === 'buying' ? order.buyerId === user.id : order.sellerId === user.id
      );
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

  const handleConfirmReceipt = async (orderId: string) => {
    try {
      await orderService.confirmReceipt(orderId);
      setOrders(orders.map(order =>
        order.id === orderId
          ? { ...order, status: 'DELIVERED', deliveredAt: new Date().toISOString() }
          : order
      ));
      toast.success('Receipt confirmed! You have 1 hour to report any issues.');
    } catch (error) {
      toast.error('Failed to confirm receipt');
    }
  };

  const handleMarkSatisfied = async (orderId: string) => {
    try {
      await orderService.markSatisfied(orderId);
      const updated = await orderService.getOrders(user!.id);
      setOrders(updated.filter(o => activeTab === 'buying' ? o.buyerId === user!.id : o.sellerId === user!.id));
      toast.success('Order marked as satisfied!');
    } catch (error) {
      toast.error('Failed to mark order as satisfied');
    }
  };

  // ✅ NEW FUNCTION: Seller updates status
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      if (!newStatus) {
        toast.error('Please select a valid status');
        return;
      }
      await orderService.updateStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order status');
    }
  };

  const handleComplaint = (order: Order) => {
    setSelectedOrder(order);
    setIsComplaintModalOpen(true);
  };

  const submitComplaint = async () => {
    if (!selectedOrder || complaintReasons.length === 0) {
      toast.error('Please select at least one reason for your complaint');
      return;
    }

    try {
      toast.success('Complaint submitted successfully. Admin will review it shortly.');
      setIsComplaintModalOpen(false);
      setComplaintReasons([]);
      setComplaintDescription('');
    } catch (error) {
      toast.error('Failed to submit complaint');
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

  const complaintOptions = [
    'Product not as described',
    'Damaged during shipping',
    'Wrong item received',
    'Poor quality',
    'Missing parts/accessories',
    'Late delivery',
    'Other'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">Track your buying and selling activities</p>
      </div>

      <div className="mb-8 flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg">
          {(['buying', 'selling'] as const).map(mode => (
            <Button
              key={mode}
              variant={activeTab === mode ? 'primary' : 'outline'}
              onClick={() => setActiveTab(mode)}
              className="mx-1 capitalize"
            >
              {mode === 'buying' ? 'My Purchases' : 'My Sales'}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner className="py-20" size="lg" />
      ) : orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab === 'buying' ? 'purchases' : 'sales'} yet
          </h3>
          <p className="text-gray-600">
            {activeTab === 'buying'
              ? 'Start browsing products to make your first purchase'
              : 'List your first product to start selling'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex items-start space-x-4">
                    {order.product?.images?.length ? (
                      <img
                        src={order.product.images[0]}
                        alt={order.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                        📦
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{order.product?.name || 'Unknown Product'}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {activeTab === 'buying' ? `Sold by ${order.seller.fullName}` : `Bought by ${order.buyer.fullName}`}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatDateTime(order.createdAt)}</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(order)}>
                        <Eye size={14} className="mr-1" />
                        Details
                      </Button>

                      {/* ✅ NEW: Seller can update order status */}
                      {activeTab === 'selling' && ['PAID', 'PROCESSING'].includes(order.status.toUpperCase()) && (
                        <div className="flex items-center space-x-2">
                          <select
                            value={statusUpdates[order.id] || order.status}
                            onChange={e => setStatusUpdates({ ...statusUpdates, [order.id]: e.target.value })}
                            className="border rounded-md px-2 py-1 text-sm"
                          >
                            <option value="PAID">PAID</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                          </select>
                          <Button
                            size="sm"
                            className="bg-blue-600 text-white"
                            onClick={() =>
                              handleUpdateStatus(order.id, statusUpdates[order.id] || order.status)
                            }
                          >
                            Update
                          </Button>
                        </div>
                      )}

                      {/* Buyer actions */}
                      {activeTab === 'buying' && (
                        <>
                          {order.status?.toUpperCase() === 'SHIPPED' && (
                            <Button
                              size="sm"
                              className="bg-green-600 text-white"
                              onClick={() => handleConfirmReceipt(order.id)}
                            >
                              Confirm Received
                            </Button>
                          )}
                          {order.status?.toUpperCase() === 'DELIVERED' &&
                            order.satisfactionStatus?.toUpperCase() === 'NOT_SATISFIED' && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 text-white"
                                  onClick={() => handleMarkSatisfied(order.id)}
                                >
                                  Confirm Satisfied
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => handleComplaint(order)}>
                                  <MessageSquare size={14} className="mr-1" />
                                  Complaint
                                </Button>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* LEFT SIDE - Product Info */}
              <div>
                {selectedOrder.product?.images?.length ? (
                  <img
                    src={selectedOrder.product.images[0]}
                    alt={selectedOrder.product.name}
                    className="w-full h-56 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-56 rounded-lg bg-gray-200 flex items-center justify-center mb-4">
                    📦
                  </div>
                )}
                <h3 className="font-semibold text-xl text-gray-900 mb-1">
                  {selectedOrder.product?.name || "Unknown Product"}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {selectedOrder.product?.description || "No description"}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Condition:</span>
                    <p className="font-semibold capitalize">
                      {selectedOrder.product?.condition || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <p className="font-semibold">
                      {selectedOrder.product?.location_state || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE - Summary & Status */}
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Product Price:</span>
                      <span>{formatCurrency(selectedOrder.product?.price || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>{formatCurrency(selectedOrder.product?.delivery_fee || 0)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Seller/Buyer Info */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {activeTab === "buying" ? "Seller" : "Buyer"} Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    {activeTab === "buying" ? (
                      <>
                        <p><span className="text-gray-500">Name:</span> {selectedOrder.seller.fullName}</p>
                        <p><span className="text-gray-500">Email:</span> {selectedOrder.seller.email}</p>
                        <p><span className="text-gray-500">WhatsApp:</span> {selectedOrder.seller.whatsapp}</p>
                      </>
                    ) : (
                      <>
                        <p><span className="text-gray-500">Name:</span> {selectedOrder.buyer.fullName}</p>
                        <p><span className="text-gray-500">Email:</span> {selectedOrder.buyer.email}</p>
                        <p><span className="text-gray-500">WhatsApp:</span> {selectedOrder.buyer.whatsapp}</p>

                        <div className="mt-3 border-t pt-2">
                          <p className="text-gray-500 font-medium mb-1">Delivery Address</p>
                          <p>
                            <strong>Primary:</strong>{' '}
                            {selectedOrder.buyer.houseAddress || 'Not provided'}
                          </p>
                          <p>
                            <strong>Alternate:</strong>{' '}
                            {selectedOrder.buyer.substituteAddress || 'Not provided'}
                          </p>
                        </div>
                      </>
                    )}

                  </div>
                </div>

                {/* Order Status */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Order Status</h4>
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(selectedOrder.status)}
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Ordered on {formatDateTime(selectedOrder.createdAt)}
                  </p>
                  {selectedOrder.deliveredAt && (
                    <p className="text-sm text-gray-600">
                      Delivered on {formatDateTime(selectedOrder.deliveredAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>


      <Modal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        title="File a Complaint"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">What's wrong with your order?</h4>
            <div className="space-y-2">
              {complaintOptions.map((option) => (
                <label key={option} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={complaintReasons.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setComplaintReasons([...complaintReasons, option]);
                      } else {
                        setComplaintReasons(complaintReasons.filter(r => r !== option));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Details
            </label>
            <textarea
              value={complaintDescription}
              onChange={(e) => setComplaintDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please provide more details about the issue..."
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsComplaintModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={submitComplaint}>
              Submit Complaint
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};