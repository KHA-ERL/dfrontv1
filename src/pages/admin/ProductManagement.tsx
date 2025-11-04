import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, MapPin, Calendar, DollarSign } from 'lucide-react';
import type { Product } from '../../types';
import { productService } from '../../services/productService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [searchTerm]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({ search: searchTerm });
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const conditionColors = {
    new: 'text-green-800 bg-green-100',
    used: 'text-yellow-800 bg-yellow-100',
    refurbished: 'text-blue-800 bg-blue-100',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage all products on the platform
        </p>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </Card>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden">
          {loading ? (
            <LoadingSpinner className="py-20" size="lg" />
          ) : (
            <Table headers={['Product', 'Price', 'Condition', 'Location', 'Seller', 'Date', 'Actions']}>
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <DollarSign size={14} className="mr-1" />
                      {product.price}
                    </div>
                    <div className="text-xs text-gray-500">+${product.deliveryFee} delivery</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${conditionColors[product.condition]}`}>
                      {product.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin size={14} className="mr-1" />
                      {product.location}, {product.state}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.seller.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(product.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(product)}
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

      {/* Product Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Product Details"
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedProduct.name}</h3>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <p className="font-semibold">${selectedProduct.price}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Delivery Fee:</span>
                    <p className="font-semibold">${selectedProduct.deliveryFee}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Condition:</span>
                    <p className="font-semibold capitalize">{selectedProduct.condition}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <p className="font-semibold capitalize">{selectedProduct.status}</p>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Location:</span>
                  <p className="font-semibold">{selectedProduct.location}, {selectedProduct.state}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Seller:</span>
                  <p className="font-semibold">{selectedProduct.seller.fullName}</p>
                  <p className="text-sm text-gray-600">{selectedProduct.seller.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};