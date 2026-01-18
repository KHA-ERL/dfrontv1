import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, TrendingUp, DollarSign } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import type { Order, Product, SellerStats } from '../../types';
import { formatCurrency } from '../../utils/validation';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const isCompleted = (o: any) => (o.status ?? '').toString() === 'COMPLETED';

const isDelivered = (o: any) => {
  const s = (o.status ?? '').toString();
  return s === 'DELIVERED' || s === 'COMPLETED';
};

// Check if order is successful (PAID, PROCESSING, SHIPPED, DELIVERED, or COMPLETED)
const isSuccessfulOrder = (o: any) => {
  const s = (o.status ?? '').toString().toUpperCase();
  return ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(s);
};

const getOrderBuyerId = (o: any) => String(o.buyerId ?? o.buyer?.id ?? o.buyer_id ?? '');
const getOrderSellerId = (o: any) => String(o.sellerId ?? o.seller?.id ?? o.seller_id ?? '');
const getOrderProductId = (o: any) => String(o.productId ?? o.product?.id ?? o.product_id ?? '');
const getOrderPrice = (o: any) => {
  const p = Number(o.price ?? o.totalAmount ?? o.product?.price ?? 0);
  return Number.isFinite(p) ? p : 0;
};

export const Dashboard: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'buying' | 'selling'>('buying');
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [sales, setSales] = useState<Order[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) {
        setPurchases([]);
        setSales([]);
        setMyProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let orders: any[] = [];
        if (typeof orderService.getMyOrders === 'function') {
          orders = await orderService.getMyOrders();
        } else {
          try {
            orders = await orderService.getOrders('me');
          } catch {
            orders = await orderService.getOrders('me');
          }
        }

        let products: any[] = [];
        if (typeof productService.getMyProducts === 'function') {
          products = await productService.getMyProducts(String(user.id));
        } else {
          products = await productService.getProducts();
        }

        if (!mounted) return;

        const uid = String(user.id);
        const userPurchases = (orders ?? []).filter(o => getOrderBuyerId(o) === uid);
        const userSales = (orders ?? []).filter(o => getOrderSellerId(o) === uid);

        const myProds = (products ?? []).filter((p: any) => {
          const sid = String(
            p.sellerId ?? p.seller?.id ?? p.seller_id ?? p.seller_id ?? ''
          );
          return sid === uid;
        });

        setPurchases(userPurchases as Order[]);
        setSales(userSales as Order[]);
        setMyProducts(myProds as Product[]);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  const buyingStats = useMemo(() => {
    // Only count successful orders (exclude PENDING and CANCELLED)
    const successfulOrders = purchases.filter(isSuccessfulOrder);
    const totalOrders = successfulOrders.length;
    const activeOrders = successfulOrders.filter(o => !isDelivered(o)).length;
    const completedOrders = successfulOrders.filter(isDelivered).length;

    // Only sum amount for successful orders
    const amountSpent = successfulOrders.reduce(
      (sum, o) => sum + getOrderPrice(o),
      0
    );

    return { totalOrders, activeOrders, completedOrders, amountSpent };
  }, [purchases]);

  const sellingStats: SellerStats = useMemo(() => {
    const itemsListed = myProducts.length;

    const deliveredProductIds = new Set(
      (sales ?? [])
        .filter(isCompleted)
        .map(o => getOrderProductId(o))
    );

    const itemsSold = (sales ?? []).filter(isCompleted).length;

    const activeListings = myProducts.filter(p => {
      const pid = String(p.id ?? '');
      const disabled = !!p.isDisabled;
      return !disabled && !deliveredProductIds.has(pid);
    }).length;

    const revenue = (sales ?? [])
      .filter(isCompleted)
      .reduce((sum, o) => sum + getOrderPrice(o), 0);

    return { itemsListed, itemsSold, activeListings, revenue };
  }, [myProducts, sales]);

  const colorMap: Record<string, string> = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    orange: 'text-orange-600 bg-orange-100',
    purple: 'text-purple-600 bg-purple-100',
  };

  const statsConfig = {
    buying: [
      { label: 'Total Orders', value: String(buyingStats.totalOrders), icon: ShoppingCart, color: 'blue' },
      { label: 'Active Orders', value: String(buyingStats.activeOrders), icon: Package, color: 'orange' },
      { label: 'Completed', value: String(buyingStats.completedOrders), icon: TrendingUp, color: 'green' },
      { label: 'Amount Spent', value: formatCurrency(buyingStats.amountSpent), icon: DollarSign, color: 'purple' },
    ],
    selling: [
      { label: 'Items Listed', value: String(sellingStats.itemsListed), icon: Package, color: 'blue' },
      { label: 'Items Sold', value: String(sellingStats.itemsSold), icon: TrendingUp, color: 'green' },
      { label: 'Active Listings', value: String(sellingStats.activeListings), icon: ShoppingCart, color: 'orange' },
      { label: 'Revenue', value: formatCurrency(sellingStats.revenue), icon: DollarSign, color: 'purple' },
    ],
  } as const;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div>Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your buying and selling activities</p>
      </div>

      {/* Mode Toggle */}
      <div className="mb-8 flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg">
          {(['buying', 'selling'] as const).map((mode) => (
            <Button
              key={mode}
              variant={activeMode === mode ? 'primary' : 'outline'}
              onClick={() => setActiveMode(mode)}
              className="mx-1 capitalize"
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsConfig[activeMode].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${colorMap[stat.color]}`}>
                  <stat.icon size={22} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeMode === 'buying' ? (
            <>
              <Button className="w-full" onClick={() => navigate('/browse')}>Browse Products</Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/orders')}>Track Orders</Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/orders')}>Order History</Button>
            </>
          ) : (
            <>
              <Button className="w-full" onClick={() => navigate('/sell/new')}>List New Item</Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/my-listings')}>Manage Listings</Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/my-sales')}>View Sales</Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
