import React from 'react';
import { Card } from '../components/ui/Card';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Cribhub</h1>
            <p className="text-xl text-gray-600">
              Your trusted marketplace for buying and selling everything
            </p>
          </div>

          {/* About Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cribhub is a modern e-commerce platform that connects buyers and sellers 
              in a seamless, secure environment. Whether you're decluttering your home 
              or looking for great deals, we make it easy.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to create a trusted community where everyone can buy and 
              sell with confidence, backed by secure payments and reliable delivery.
            </p>
          </Card>

          {/* Contact Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a 
                    href="mailto:contact@ourcribhub.com" 
                    className="text-orange-600 hover:underline"
                  >
                    contact@ourcribhub.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a 
                    href="tel:+2348130233489" 
                    className="text-orange-600 hover:underline"
                  >
                    +234 813 023 3489
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">WhatsApp</h3>
                  <a 
                    href="https://wa.me/2348130233489" 
                    className="text-orange-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat with us
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Address</h3>
                  <p className="text-gray-600">
                    17 Soji Oshodi Str<br />
                    Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Features */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Why Choose Cribhub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">🔒 Secure Payments</h3>
                <p className="text-gray-600">
                  All transactions are protected with industry-standard encryption
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">📦 Easy Shipping</h3>
                <p className="text-gray-600">
                  Track your orders from purchase to delivery
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">💬 24/7 Support</h3>
                <p className="text-gray-600">
                  Our team is always here to help you
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
