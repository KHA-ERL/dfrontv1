import React, { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import type { Product } from '../../types';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/validation';
import { useAuth } from '../../contexts/AuthContext';
import { Edit2, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';

export const MyListings: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const loadProducts = () => {
    if (!user) return;
    productService.getMyProducts(user.id).then(setProducts).catch(() => setProducts([]));
  };

  useEffect(() => {
    loadProducts();
  }, [user]);

  const handleEditClick = (product: Product) => {
    setEditingId(String(product.id));
    setEditPrice(product.price);
  };

  const handleSavePrice = async (productId: string) => {
    if (editPrice <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      await productService.updateProduct(productId, { price: editPrice });
      toast.success('Price updated successfully!');
      setEditingId(null);
      loadProducts();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to update price');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditPrice(0);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Listings</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <Card key={p.id} className="p-4">
            <img src={(p.images?.[0]) || ''} alt={p.name} className="w-full h-40 object-cover rounded mb-3" />
            <div className="font-semibold">{p.name}</div>

            {editingId === String(p.id) ? (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">₦</span>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSavePrice(String(p.id))}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                  >
                    <Check size={16} />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 text-sm"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center justify-between">
                <div className="text-gray-600 font-semibold">{formatCurrency(p.price)}</div>
                <button
                  onClick={() => handleEditClick(p)}
                  className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm"
                  title="Edit price"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
              </div>
            )}

            <div className="text-sm text-gray-500 mt-1">{p.location_state}</div>
          </Card>
        ))}
        {products.length === 0 && <p>No listings yet.</p>}
      </div>
    </div>
  );
};
export default MyListings;
