import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';
import type { Product } from '../../types';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/validation';

export const Browse: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  // debounce helper
  const debounce = useMemo(() => {
    let id: ReturnType<typeof setTimeout> | null = null;
    return (fn: () => void, wait = 300) => {
      if (id) clearTimeout(id);
      id = setTimeout(fn, wait);
    };
  }, []);

  const load = async (params?: { search?: string; condition?: string; location?: string }) => {
    setLoading(true);
    try {
      const list = await productService.getProducts({
        search: params?.search ?? search,
        condition: params?.condition ?? condition,
        location: params?.location ?? location,
      });
      setProducts(list);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  // load when filters change
  useEffect(() => {
    debounce(() => load({}), 250);
  }, [search, condition, location]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Products</h1>
        <p className="text-gray-600 mt-1">Search by name, condition or location</p>
      </div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name or description..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All conditions</option>
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location / State"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* More filters button intentionally commented out
            <div className="mt-3 text-right">
              <button className="text-sm text-gray-500 hover:text-gray-700">More filters</button>
            </div>
          */}
        </Card>
      </motion.div>

      <div>
        {loading ? (
          <Card className="py-16 flex justify-center"><LoadingSpinner /></Card>
        ) : products.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">No products found.</Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <Card
                  className="overflow-hidden hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  <div className="w-full h-44 bg-gray-100">
                    <img src={p.images?.[0]} alt={p.name} className="w-full h-44 object-cover" />
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                      <span className="text-blue-600 font-bold">{formatCurrency(p.price)}</span>
                    </div>

                    <div className="text-sm text-gray-600">
                     {p.location_state ? ` ${p.location_state}` : ''}
                    </div>

                    <div className="text-xs text-gray-500 capitalize">{p.condition}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Browse;
