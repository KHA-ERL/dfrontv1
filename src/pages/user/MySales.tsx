import React, { useEffect, useState, useMemo } from 'react';
import { orderService } from '../../services/orderService';
import type { Order } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDateTime } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Package, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Check if order is a successful sale (paid and beyond)
const isSuccessfulSale = (o: Order) => {
  const status = (o.status ?? '').toUpperCase();
  return ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(status);
};

// Check if order is completed (money can be released)
const isCompletedSale = (o: Order) => {
  const status = (o.status ?? '').toUpperCase();
  return status === 'COMPLETED';
};

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PAID': return 'bg-blue-100 text-blue-800';
    case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
    case 'SHIPPED': return 'bg-purple-100 text-purple-800';
    case 'DELIVERED': return 'bg-green-100 text-green-800';
    case 'COMPLETED': return 'bg-green-200 text-green-900';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const MySales: React.FC = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    orderService
      .getOrders(user.id)
      .then(orders => {
        const userId = String(user.id);
        const mySales = orders.filter(o => String(o.sellerId) === userId);
        setSales(mySales);
      })
      .catch(() => setSales([]))
      .finally(() => setLoading(false));
  }, [user]);

  // Calculate stats from the orders
  const stats = useMemo(() => {
    const successfulSales = sales.filter(isSuccessfulSale);
    const completedSales = sales.filter(isCompletedSale);
    const pendingSales = sales.filter(o =>
      isSuccessfulSale(o) && !isCompletedSale(o)
    );

    const totalRevenue = completedSales.reduce(
      (sum, o) => sum + (o.totalAmount ?? o.price ?? 0),
      0
    );

    const pendingRevenue = pendingSales.reduce(
      (sum, o) => sum + (o.totalAmount ?? o.price ?? 0),
      0
    );

    return {
      totalSales: successfulSales.length,
      completedSales: completedSales.length,
      pendingSales: pendingSales.length,
      totalRevenue,
      pendingRevenue,
    };
  }, [sales]);

  const successfulSales = sales.filter(isSuccessfulSale);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Sales</h2>
        <Button variant="outline" onClick={() => navigate('/orders')}>
          View All Orders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <Package size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-xl font-bold">{stats.totalSales}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
              <Clock size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold">{stats.pendingSales}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <TrendingUp size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-bold">{stats.completedSales}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <DollarSign size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </Card>
      </div>

      {stats.pendingRevenue > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            <strong>{formatCurrency(stats.pendingRevenue)}</strong> pending in escrow
            (will be released when buyers confirm satisfaction)
          </p>
        </div>
      )}

      {/* Sales List */}
      <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
      <div className="space-y-3">
        {successfulSales.length === 0 ? (
          <Card className="p-8 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sales yet</h3>
            <p className="text-gray-600 mb-4">
              When someone buys your products, they'll appear here.
            </p>
            <Button onClick={() => navigate('/sell/new')}>List a Product</Button>
          </Card>
        ) : (
          successfulSales.map(o => (
            <Card key={o.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {o.product?.images?.[0] ? (
                    <img
                      src={o.product.images[0]}
                      alt={o.product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      📦
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{o.product?.name || 'Unknown Product'}</div>
                    <div className="text-sm text-gray-500">
                      Buyer: {o.buyer?.fullName || 'Unknown'} • {formatDateTime(o.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatCurrency(o.totalAmount ?? o.price ?? 0)}
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(o.status)}`}>
                    {o.status}
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MySales;
