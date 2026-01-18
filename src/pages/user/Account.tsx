import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { User, Mail, Phone, MapPin, Building2, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export const Account: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localUser, setLocalUser] = useState(user);
  const [formData, setFormData] = useState({
    whatsapp: user?.whatsapp || '',
    houseAddress: user?.houseAddress || '',
    substituteAddress: user?.substituteAddress || '',
    bankAccountNumber: user?.bankAccount || '',
    bankName: user?.bankName || '',
  });

  if (!user) return null;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await userService.updateProfile(formData);
      
      // Fetch updated user data
      const updatedUser = await authService.getCurrentUser();
      setLocalUser(updatedUser);
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      whatsapp: localUser?.whatsapp || '',
      houseAddress: localUser?.houseAddress || '',
      substituteAddress: localUser?.substituteAddress || '',
      bankAccountNumber: localUser?.bankAccount || '',
      bankName: localUser?.bankName || '',
    });
    setIsEditing(false);
  };

  const displayUser = localUser || user;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="primary">
                Edit Profile
              </Button>
            )}
          </div>

          {/* Personal Information - READ ONLY */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={displayUser.fullName}
                    disabled
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={displayUser.email}
                    disabled
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number {isEditing && <span className="text-orange-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={isEditing ? formData.whatsapp : (displayUser.whatsapp || 'Not provided')}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., +234 801 234 5678"
                    className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={displayUser.role === 'admin' ? 'Administrator' : 'Regular User'}
                    disabled
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Address Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Address Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House Address (Primary) {isEditing && <span className="text-orange-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={isEditing ? formData.houseAddress : (displayUser.houseAddress || 'Not provided')}
                    onChange={(e) => handleChange('houseAddress', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your primary address"
                    className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Substitute Address (Alternate) {isEditing && <span className="text-orange-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={isEditing ? formData.substituteAddress : (displayUser.substituteAddress || 'Not provided')}
                    onChange={(e) => handleChange('substituteAddress', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter alternate address"
                    className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Banking Information - EDITABLE */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Banking Information {isEditing && <span className="text-sm text-orange-500 font-normal">(Editable)</span>}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name {isEditing && <span className="text-orange-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={isEditing ? formData.bankName : (displayUser.bankName || 'Not provided')}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., GTBank, Access Bank"
                    className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number {isEditing && <span className="text-orange-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={isEditing ? formData.bankAccountNumber : (displayUser.bankAccount || 'Not provided')}
                    onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                    disabled={!isEditing}
                    placeholder="10-digit account number"
                    maxLength={10}
                    className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>
            </div>
          </Card>

          {isEditing && (
            <div className="flex justify-end gap-4">
              <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
