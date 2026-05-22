import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = {
  Shein: '#FF6B9D',
  Temu: '#FF8C42',
  Primark: '#4ADE80',
  Other: '#60A5FA'
};

const STATUS_COLORS = {
  Pending: '#FBBF24',
  Ordered: '#60A5FA',
  Shipped: '#FB923C',
  Delivered: '#4ADE80',
  Cancelled: '#F87171'
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders/stats/dashboard');
      setStats(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const platformData = stats?.ordersByPlatform 
    ? Object.entries(stats.ordersByPlatform).map(([name, value]) => ({
        name,
        value
      }))
    : [];

  const statusData = stats?.ordersByStatus
    ? Object.entries(stats.ordersByStatus).map(([name, value]) => ({
        name,
        value
      }))
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-primary-card border border-primary-border rounded-lg hover:bg-primary-border transition-colors"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-primary-card border border-primary-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-blue/20 rounded-lg">
              <ShoppingCart className="text-primary-blue" size={24} />
            </div>
            <span className="text-3xl font-bold text-white">{stats?.totalOrders || 0}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Orders</p>
        </div>

        <div className="bg-primary-card border border-primary-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <DollarSign className="text-green-400" size={24} />
            </div>
            <span className="text-3xl font-bold text-white">
              £{stats?.totalRevenue?.toFixed(2) || '0.00'}
            </span>
          </div>
          <p className="text-gray-400 text-sm">Total Revenue</p>
        </div>

        <div className="bg-primary-card border border-primary-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-pink/20 rounded-lg">
              <Package className="text-primary-pink" size={24} />
            </div>
            <span className="text-3xl font-bold text-white">
              {stats?.ordersByStatus?.Pending || 0}
            </span>
          </div>
          <p className="text-gray-400 text-sm">Pending Orders</p>
        </div>

        <div className="bg-primary-card border border-primary-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="text-green-400" size={24} />
            </div>
            <span className="text-3xl font-bold text-white">
              {stats?.ordersByStatus?.Delivered || 0}
            </span>
          </div>
          <p className="text-gray-400 text-sm">Delivered Orders</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-primary-card border border-primary-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Orders by Platform</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-primary-card border border-primary-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#60A5FA">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#8884d8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-primary-card border border-primary-border rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-border">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Product</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Platform</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Total</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-primary-border hover:bg-primary-border/50">
                    <td className="py-3 px-4 text-white">{order.customer_name}</td>
                    <td className="py-3 px-4 text-white truncate max-w-xs">{order.product_name}</td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${COLORS[order.platform]}20`,
                          color: COLORS[order.platform]
                        }}
                      >
                        {order.platform}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white">£{order.total_price?.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${STATUS_COLORS[order.status]}20`,
                          color: STATUS_COLORS[order.status]
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
