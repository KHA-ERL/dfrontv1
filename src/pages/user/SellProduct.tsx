import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import api from '../../services/api'; // axios instance
import { toast } from 'react-toastify';

export const SellProduct: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [condition, setCondition] = useState('used');
  const [locationState, setLocationState] = useState('');
  const [deliveryFee, setDeliveryFee] = useState<number | ''>('');

  // 🟢 NEW: Product type & quantity
  const [type, setType] = useState<'Declutter' | 'Online Store'>('Declutter');
  const [quantity, setQuantity] = useState<number>(1);

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const MAX_IMAGES = 4;
  const MAX_VIDEOS = 2;
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
  const MAX_VIDEO_SIZE = 5 * 1024 * 1024;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return toast.error('Name and price are required');

    if (images.length > MAX_IMAGES) return toast.error('Max 4 images');
    if (videos.length > MAX_VIDEOS) return toast.error('Max 2 videos');

    for (const f of images)
      if (f.size > MAX_IMAGE_SIZE) return toast.error('Each image must be ≤ 2MB');
    for (const f of videos)
      if (f.size > MAX_VIDEO_SIZE) return toast.error('Each video must be ≤ 5MB');

    // 🟢 Validate quantity for Online Store
    if (type === 'Online Store') {
      if (quantity < 1 || quantity > 50000000) {
        return toast.error('Quantity must be between 1 and 50,000,000');
      }
    }

    const fd = new FormData();
    fd.append('name', name);
    fd.append('description', description);
    fd.append('price', String(price));
    fd.append('condition', condition);
    fd.append('location_state', locationState);
    fd.append('delivery_fee', String(deliveryFee || 0));

    // 🟢 Append new fields
    fd.append('type', type);
    fd.append('quantity', String(type === 'Online Store' ? quantity : 1));

    images.forEach((f) => fd.append('images', f));
    videos.forEach((f) => fd.append('videos', f));

    setLoading(true);
    try {
      const res = await api.post('/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Product listed successfully!');
      navigate('/my-listings'); 
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">List a new item</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (Add Defects if any)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your item, including any defects..."
            />
          </div>
          <Input
            label="Price (NGN)"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || '')}
          />

          
          <div>
            <label className="block text-sm font-medium text-gray-700">Listing Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'Declutter' | 'Online Store')}
              className="mt-1 w-full border px-3 py-2 rounded"
            >
              <option value="Declutter">Declutter (single item)</option>
              <option value="Online Store">Online Store (multiple items)</option>
            </select>
          </div>

          
          {type === 'Online Store' && (
            <Input
              label="Quantity (max 50,000,000)"
              type="number"
              value={quantity}
              min={1}
              max={50000000}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded"
            >
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>

          <Input
            label="Location / State"
            value={locationState}
            onChange={(e) => setLocationState(e.target.value)}
          />
          <Input
            label="Delivery Fee (NGN)"
            type="number"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(Number(e.target.value) || '')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Images (max 4, each ≤ 2MB)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files || []).slice(0, 4))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Videos (max 2, each ≤ 5MB)
            </label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => setVideos(Array.from(e.target.files || []).slice(0, 2))}
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" loading={loading}>
              List Item
            </Button>
            <Button onClick={() => window.history.back()} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SellProduct;
