const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/stats/dashboard', async (req, res) => {
  try {
    const supabase = req.supabase;

    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const { data: revenueData } = await supabase
      .from('orders')
      .select('total_price');

    const totalRevenue = revenueData?.reduce((sum, order) => sum + (Number(order.total_price) || 0), 0) || 0;

    const { data: platformData } = await supabase
      .from('orders')
      .select('platform');

    const ordersByPlatform = platformData?.reduce((acc, order) => {
      acc[order.platform] = (acc[order.platform] || 0) + 1;
      return acc;
    }, {}) || {};

    const { data: statusData } = await supabase
      .from('orders')
      .select('status');

    const ordersByStatus = statusData?.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {}) || {};

    const { data: recentOrders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    res.json({
      totalOrders: totalOrders || 0,
      totalRevenue,
      ordersByPlatform,
      ordersByStatus,
      recentOrders: recentOrders || []
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { platform, status, search } = req.query;
    const supabase = req.supabase;

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (platform) {
      query = query.eq('platform', platform);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,product_name.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await req.supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('orders')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await req.supabase
      .from('orders')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await req.supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
