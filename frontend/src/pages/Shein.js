import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Plus, Search, Download, Edit, Trash2, Filter } from 'lucide-react';
import OrderModal from '../components/OrderModal';


const PLATFORM = 'Shein';
const PLATFORM_COLOR = '#FF6B9D';

const STATUS_COLORS = {
  Pending: '#FBBF24',
  Ordered: '#60A5FA',
  Shipped: '#FB923C',
  Delivered: '#4ADE80',
  Cancelled: '#F87171'
};

const Shein = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders', {
        params: { platform: PLATFORM }
      });
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleAddOrder = () => {
    setSelectedOrder(null);
    setModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await api.delete(`/api/orders/${id}`);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleSaveOrder = () => {
    fetchOrders();
  };

  const exportToCSV = () => {
    const headers = ['Customer Name', 'Phone', 'City', 'Product', 'Price', 'Quantity', 'Shipping', 'Total', 'Status', 'Notes'];
    const rows = filteredOrders.map(order => [
      order.customer_name,
      order.customer_phone,
      order.customer_city,
      order.product_name,
      order.product_price_gbp,
      order.quantity,
      order.shipping_cost,
      order.total_price,
      order.status,
      order.notes
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${PLATFORM}-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ color: PLATFORM_COLOR }}>
            {PLATFORM} Orders
          </h1>
          <p className="text-gray-400 mt-1">{filteredOrders.length} orders</p>
        </div>
        <button
          onClick={handleAddOrder}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          style={{ backgroundColor: PLATFORM_COLOR, color: 'white' }}
        >
          <Plus size={20} />
          Add Order
        </button>
      </div>

      {/* Filters */}
      <div className="bg-primary-card border border-primary-border rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by customer or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-primary-dark border border-primary-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-blue"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-primary-dark border border-primary-border rounded-lg text-white focus:outline-none focus:border-primary-blue"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Ordered">Ordered</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-primary-card border border-primary-border rounded-lg hover:bg-primary-border transition-colors text-white"
          >
            <Download size={20} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-primary-card border border-primary-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary-border">
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Customer</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Product</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Price</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Qty</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Total</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-primary-border hover:bg-primary-border/50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{order.customer_name}</p>
                        <p className="text-gray-400 text-sm">{order.customer_city}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {order.product_image_url && (
                          <img
                            src={order.product_image_url}
                            alt={order.product_name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="truncate max-w-xs">
                          <p className="text-white">{order.product_name}</p>
                          {order.product_url && (
                            <a
                              href={order.product_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-blue text-sm hover:underline"
                            >
                              View Product
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white">£{order.product_price_gbp?.toFixed(2)}</td>
                    <td className="py-4 px-6 text-white">{order.quantity}</td>
                    <td className="py-4 px-6 text-white font-medium">£{order.total_price?.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${STATUS_COLORS[order.status]}20`,
                          color: STATUS_COLORS[order.status]
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="p-2 hover:bg-primary-border rounded-lg transition-colors"
                        >
                          <Edit size={18} className="text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
        platform={PLATFORM}
        onSave={handleSaveOrder}
      />
    </div>
  );
};

export default Shein;
