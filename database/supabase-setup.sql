-- ============================================================
-- UK TO MOROCCO ORDER MANAGEMENT APP - SUPABASE DATABASE SETUP
-- ============================================================
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase project dashboard (https://supabase.com/dashboard)
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Copy and paste this entire SQL script
-- 5. Click "Run" to execute the script
-- 
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CREATE ORDERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('Shein', 'Temu', 'Primark', 'Other')),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_city VARCHAR(100) NOT NULL,
    product_name TEXT NOT NULL,
    product_image_url TEXT,
    product_url TEXT,
    product_price_gbp DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    shipping_cost DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Ordered', 'Shipped', 'Delivered', 'Cancelled')),
    notes TEXT,
    brand_name VARCHAR(100), -- For 'Other' platform
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_orders_platform ON orders(platform);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);
CREATE INDEX IF NOT EXISTS idx_orders_product_name ON orders(product_name);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================================
-- CREATE TRIGGER FOR UPDATED_AT
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can restrict this later)
-- For now, we'll allow all authenticated users to perform all operations
CREATE POLICY "Enable all for users" ON orders
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- CREATE SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================================

-- Uncomment the lines below to insert sample data for testing

/*
INSERT INTO orders (platform, customer_name, customer_phone, customer_city, product_name, product_image_url, product_url, product_price_gbp, quantity, shipping_cost, total_price, status, notes) VALUES
('Shein', 'Fatima Benali', '+212 6XX-XXXXXX', 'Casablanca', 'Women Floral Print Summer Dress', 'https://example.com/image1.jpg', 'https://shein.com/product/123', 15.99, 2, 5.00, 36.98, 'Ordered', 'Customer requested size M'),
('Temu', 'Ahmed El Fassi', '+212 6XX-XXXXXX', 'Rabat', 'Wireless Bluetooth Earbuds', 'https://example.com/image2.jpg', 'https://temu.com/product/456', 8.50, 1, 3.00, 11.50, 'Pending', 'Gift wrapping needed'),
('Primark', 'Sara Idrissi', '+212 6XX-XXXXXX', 'Marrakech', 'Basic Cotton T-Shirt Pack', 'https://example.com/image3.jpg', 'https://primark.com/product/789', 12.00, 3, 4.00, 40.00, 'Shipped', 'Expedited shipping'),
('Other', 'Youssef Amrani', '+212 6XX-XXXXXX', 'Tangier', 'Leather Belt', 'https://example.com/image4.jpg', 'https://marksandspencer.com/product/101', 25.00, 1, 3.50, 28.50, 'Delivered', 'Brand: Marks & Spencer');
*/

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Run these to verify your setup:

-- Check if table was created
-- SELECT * FROM orders;

-- Check table structure
-- \d orders

-- Check indexes
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'orders';

-- ============================================================
-- SETUP COMPLETE
-- ============================================================

-- Your database is now ready for the application!
-- Make sure to copy your Supabase URL and keys to the backend .env file
