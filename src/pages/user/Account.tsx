import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Mail, Phone, MapPin, Building2, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export const Account: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localUser, setLocalUser] = useState(user);
  const [formData, setFormData] = useState({
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
                <Input
                  value={displayUser.fullName}
                  disabled
                  icon={<User className="w-5 h-5" />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  value={displayUser.email}
                  disabled
                  icon={<Mail className="w-5 h-5" />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <Input
                  value={displayUser.whatsapp || 'Not provided'}
                  disabled
                  icon={<Phone className="w-5 h-5" />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Role
                </label>
                <Input
                  value={displayUser.role === 'admin' ? 'Administrator' : 'Regular User'}
                  disabled
                  icon={<User className="w-5 h-5" />}
                />
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
                  House Address (Primary)
                </label>
                <Input
                  value={displayUser.houseAddress || 'Not provided'}
                  disabled
                  icon={<Building2 className="w-5 h-5" />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Substitute Address (Alternate) {isEditing && <span className="text-orange-500">*</span>}
                </label>
                <Input
                  value={isEditing ? formData.substituteAddress : (displayUser.substituteAddress || 'Not provided')}
                  onChange={(e) => handleChange('substituteAddress', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter alternate address"
                  icon={<Building2 className="w-5 h-5" />}
                />
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
                <Input
                  value={isEditing ? formData.bankName : (displayUser.bankName || 'Not provided')}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  disabled={!isEditing}
                  placeholder="e.g., GTBank, Access Bank"
                  icon={<Building2 className="w-5 h-5" />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number {isEditing && <span className="text-orange-500">*</span>}
                </label>
                <Input
                  value={isEditing ? formData.bankAccountNumber : (displayUser.bankAccount || 'Not provided')}
                  onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                  disabled={!isEditing}
                  placeholder="10-digit account number"
                  icon={<CreditCard className="w-5 h-5" />}
                  maxLength={10}
                />
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
