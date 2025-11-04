import React from 'react';
import { motion } from 'framer-motion';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { 
      label: 'Total Users', 
      value: '2,847', 
      change: '+12%', 
      icon: Users, 
      color: 'blue' 
    },
    { 
      label: 'Total Products', 
      value: '1,239', 
      change: '+8%', 
      icon: Package, 
      color: 'green' 
    },
    { 
      label: 'Total Orders', 
      value: '3,892', 
      change: '+23%', 
      icon: ShoppingCart, 
      color: 'orange' 
    },
    { 
      label: 'Revenue', 
      value: '$89,342', 
      change: '+18%', 
      icon: DollarSign, 
      color: 'purple' 
    },
  ];

  const recentActivity = [
    { user: 'Alice Johnson', action: 'purchased iPhone 14 Pro', time: '2 hours ago' },
    { user: 'Bob Smith', action: 'listed MacBook Air M2', time: '4 hours ago' },
    { user: 'Carol Wilson', action: 'completed order #1234', time: '6 hours ago' },
    { user: 'David Brown', action: 'filed complaint for order #1235', time: '8 hours ago' },
  ];

  const colorMap = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    orange: 'text-orange-600 bg-orange-100',
    purple: 'text-purple-600 bg-purple-100',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of platform activity and key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${colorMap[stat.color as keyof typeof colorMap]}`}>
                  <stat.icon size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className="text-sm text-green-600 flex items-center">
                      <TrendingUp size={14} className="mr-1" />
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Users (24h)</span>
                <span className="font-semibold text-green-600">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Orders Today</span>
                <span className="font-semibold text-blue-600">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Listings</span>
                <span className="font-semibold text-purple-600">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Resolution Rate</span>
                <span className="font-semibold text-green-600">94.2%</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};