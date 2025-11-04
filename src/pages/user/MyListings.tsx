import React, { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import type { Product } from '../../types';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';

export const MyListings: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    if (!user) return;
    productService.getMyProducts(user.id).then(setProducts).catch(() => setProducts([]));
  }, [user]);
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Listings</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <Card key={p.id} className="p-4">
            <img src={(p.images?.[0]) || ''} alt={p.name} className="w-full h-40 object-cover rounded mb-3" />
            <div className="font-semibold">{p.name}</div>
            <div className="text-gray-600">{formatCurrency(p.price)}</div>
            <div className="text-sm text-gray-500">{p.location_state}</div>
          </Card>
        ))}
        {products.length === 0 && <p>No listings yet.</p>}
      </div>
    </div>
  );
};
export default MyListings;
