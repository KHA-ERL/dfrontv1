import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { sellerService } from '../../services/sellerService';
import type { Order } from '../../types';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';

const isDeliveredAndSatisfied = (o: Order) =>
  (o.status === 'DELIVERED' || o.status === 'COMPLETED') &&
  o.satisfactionStatus === 'SATISFIED';

export const MySales: React.FC = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    // 1. Fetch detailed orders for display
    orderService
      .getOrders(user.id)
      .then(orders => {
        const mySales = orders.filter(o => o.sellerId === user.id);
        setSales(mySales);
      })
      .catch(() => setSales([]));

    // 2. Fetch total revenue from backend stats
    sellerService.getStats()
      .then(stats => setTotalRevenue(stats.revenue ?? 0))
      .catch(() => setTotalRevenue(0));
  }, [user]);

  const deliveredSatisfied = sales.filter(isDeliveredAndSatisfied);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Sales</h2>

      {/* ✅ Always backend authoritative revenue */}
      <div className="mb-4 font-semibold">
        Total Revenue: {formatCurrency(totalRevenue)}
      </div>

      <div className="space-y-3">
        {deliveredSatisfied.map(o => (
          <Card key={o.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{o.product?.name}</div>
                <div className="text-sm text-gray-500">
                  {o.product?.location_state}
                </div>
              </div>
              <div className="font-semibold">
                {formatCurrency(o.totalAmount ?? o.product?.price ?? 0)}
              </div>
            </div>
          </Card>
        ))}
        {deliveredSatisfied.length === 0 && <p>No delivered & satisfied sales yet.</p>}
      </div>
    </div>
  );
};

export default MySales;
