import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { X, Loader2 } from 'lucide-react';


const OrderModal = ({ isOpen, onClose, order, platform, onSave }) => {
  const [formData, setFormData] = useState({
    platform: platform || 'Shein',
    customer_name: '',
    customer_phone: '',
    customer_city: '',
    product_name: '',
    product_image_url: '',
    product_url: '',
    product_price_gbp: '',
    quantity: 1,
    shipping_cost: 0,
    total_price: 0,
    status: 'Pending',
    notes: '',
    brand_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (order) {
      setFormData({
        ...order,
        product_price_gbp: order.product_price_gbp || '',
        quantity: order.quantity || 1,
        shipping_cost: order.shipping_cost || 0,
        total_price: order.total_price || 0
      });
    } else {
      setFormData(prev => ({
        ...prev,
        platform: platform || 'Shein'
      }));
    }
  }, [order, platform]);

  const calculateTotal = () => {
    const price = parseFloat(formData.product_price_gbp) || 0;
    const quantity = parseInt(formData.quantity) || 1;
    const shipping = parseFloat(formData.shipping_cost) || 0;
    return (price * quantity) + shipping;
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      total_price: calculateTotal()
    }));
  }, [formData.product_price_gbp, formData.quantity, formData.shipping_cost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchProductDetails = async () => {
    if (!formData.product_url) {
      setError('Please enter a product URL first');
      return;
    }

    setFetchingProduct(true);
    setError('');

    try {
      const response = await api.post('/api/products/fetch-product', {
        url: formData.product_url
      });

      setFormData(prev => ({
        ...prev,
        product_name: response.data.productName || prev.product_name,
        product_price_gbp: response.data.productPrice || prev.product_price_gbp,
        product_image_url: response.data.productImage || prev.product_image_url
      }));
    } catch (err) {
      setError('Failed to fetch product details. Please enter them manually.');
      console.error(err);
    } finally {
      setFetchingProduct(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        product_price_gbp: parseFloat(formData.product_price_gbp),
        quantity: parseInt(formData.quantity),
        shipping_cost: parseFloat(formData.shipping_cost),
        total_price: parseFloat(formData.total_price)
      };

      if (order) {
        await api.put(`/api/orders/${order.id}`, payload);
      } else {
        await api.post('/api/orders', payload);
      }

      onSave();
      onClose();
    } catch (err) {
      setError('Failed to save order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-primary-card border border-primary-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-primary-border">
          <h2 className="text-xl font-semibold text-white">
            {order ? 'Edit Order' : 'Add New Order'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-border rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Platform
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-primary-dark border border-primary-border rounded-lg text-white focus:outline-none focus:border-primary-blue"
              required
            >
              <option value="Shein">Shein</option>
              <option value="Temu">Temu</option>
              <option value="Primark">Primark</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Brand Name (only for Other platform) */}
          {formData.platform === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                name="brand_name"
                value={formData.brand_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-primary-dark border border-primary-border rounded-lg text-white focus:outline-none focus:border-primary-blue"
                placeholder="e.g., Marks & Spencer"
              />
            </div>
          )}

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-primary-dark border border-primary-border rounded-lg text-white focus:outline-none focus:border-primary-blue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Customer Phone
              </label>
              <input
                type="text"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-primary-dark border border-primary-border rounded-lg text-white focus:outline-none focus:border-primary-blue"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Customer City (Morocco)
            </label>
            <input
              type="text"
              name="customer_city"
              value={formData.customer_city}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-primary-dark border border-primary-border rounded-lg text-white focus:outline-none focus:border-primary-blue"
              required
            />
          </div>

          {/* Product URL and Auto-fetch */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                name="product_url"
                value={formData.product_url}
                onChange={handleChange}
                className="flex-1 px-4 py-3 bg-primary-dark border border-primary-border rounded-lg text-white focus:outline-none focus:border-primary-blue"
                placeholder="https://shein.com/product/..."
              />
              <button
                type="button"
                onClick={fetchProductDetails}
                disabled={fetchingProduct}
                className="px-4 py-3 bg-primary-blue hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {fetchingProduct ? <Loader2 size={20} className="animate-spin" /> : 'Fetch'}
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-primary-dark border border-primary-border rounded-lg text-white focus:outline-none focus:border-primary-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Image URL
            </label>
            <input
              type="url"
              name="product_image_url"
              value={formData.product_image_url}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-primary-dark border border-primary-border rounded-lg text-white focus:outline-none focus:border-primary-blue"
            />
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (GBP)
              </label>
              <input
                type="number"
                step="0.01"
                name="product_price_gbp"
                value={formData.product_price_gbp}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-primary-dark border border-primary-border rounded-lg text-white focus:outline-none focus:border-primary-blue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 bg-primary-dark border border-primary-border rounded-lg text-white focus:outline-none focus:border-primary-blue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Shipping Cost (GBP)
              </label>
              <input
                type="number"
                step="0.01"
                name="shipping_cost"
                value={formData.shipping_cost}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-primary-dark border border-primary-border rounded-lg text-white focus:outline-none focus:border-primary-blue"
                required
              />
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-primary-dark p-4 rounded-lg border border-primary-border">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Price:</span>
              <span className="text-2xl font-bold text-white">£{formData.total_price.toFixed(2)}</span>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-primary-dark border border-primary-border rounded-lg text-white focus:outline-none focus:border-primary-blue"
              required
            >
              <option value="Pending">Pending</option>
              <option value="Ordered">Ordered</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-primary-dark border border-primary-border rounded-lg text-white focus:outline-none focus:border-primary-blue resize-none"
              placeholder="Additional notes..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-primary-card border border-primary-border text-white rounded-lg hover:bg-primary-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary-blue hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
