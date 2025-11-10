-- LuxeStay Hotel Reservation System
-- Supabase Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE room_category AS ENUM ('SINGLE', 'DOUBLE', 'SUITE', 'DELUXE', 'PRESIDENTIAL');
CREATE TYPE reservation_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- Hotels table
CREATE TABLE hotels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
    amenities TEXT[], -- Array of amenities
    images TEXT[], -- Array of image URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms table
CREATE TABLE rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    number VARCHAR(10) NOT NULL,
    category room_category NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    max_occupancy INTEGER DEFAULT 2,
    size_sqm INTEGER,
    description TEXT,
    amenities TEXT[], -- Array of room-specific amenities
    images TEXT[], -- Array of room image URLs
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(hotel_id, number)
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    preferences JSONB, -- User preferences as JSON
    loyalty_points INTEGER DEFAULT 0,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations table
CREATE TABLE reservations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    status reservation_status DEFAULT 'PENDING',
    special_requests TEXT,
    booking_reference VARCHAR(20) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (check_out > check_in),
    CHECK (guests > 0)
);

-- Payments table
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    status payment_status DEFAULT 'PENDING',
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE,
    refund_amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    images TEXT[], -- Array of review image URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, reservation_id)
);

-- Amenities table
CREATE TABLE amenities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50), -- Icon class or emoji
    category VARCHAR(50), -- e.g., 'room', 'hotel', 'business', 'recreation'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room amenities junction table
CREATE TABLE room_amenities (
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (room_id, amenity_id)
);

-- Hotel amenities junction table
CREATE TABLE hotel_amenities (
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (hotel_id, amenity_id)
);

-- Favorites table
CREATE TABLE favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    hotel_id UUID REFERENCES hotels(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, hotel_id)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- info, warning, success, error
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_room_id ON reservations(room_id);
CREATE INDEX idx_reservations_dates ON reservations(check_in, check_out);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_rooms_hotel_id ON rooms(hotel_id);
CREATE INDEX idx_rooms_category ON rooms(category);
CREATE INDEX idx_rooms_available ON rooms(is_available);
CREATE INDEX idx_reviews_hotel_id ON reviews(hotel_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_payments_reservation_id ON payments(reservation_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate booking reference function
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_reference = 'LX' || UPPER(SUBSTRING(MD5(NEW.id::text), 1, 8));
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add booking reference trigger
CREATE TRIGGER generate_booking_reference_trigger BEFORE INSERT ON reservations
    FOR EACH ROW EXECUTE FUNCTION generate_booking_reference();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can only see and edit their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own reservations
CREATE POLICY "Users can view own reservations" ON reservations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create reservations" ON reservations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reservations" ON reservations
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see their own payments
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM reservations 
            WHERE reservations.id = payments.reservation_id 
            AND reservations.user_id = auth.uid()
        )
    );

-- Users can only see and create their own reviews
CREATE POLICY "Users can view all reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create own reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see and manage their own favorites
CREATE POLICY "Users can view own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites" ON favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for hotels, rooms, and amenities
CREATE POLICY "Anyone can view hotels" ON hotels
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view rooms" ON rooms
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view amenities" ON amenities
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view room amenities" ON room_amenities
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view hotel amenities" ON hotel_amenities
    FOR SELECT USING (true);

-- Insert sample data
INSERT INTO amenities (name, icon, category, description) VALUES
('WiFi', '📶', 'connectivity', 'Free high-speed internet'),
('Air Conditioning', '❄️', 'comfort', 'Climate control'),
('TV', '📺', 'entertainment', 'Flat-screen television'),
('Minibar', '🍷', 'food', 'In-room refreshments'),
('Safe', '🔒', 'security', 'Personal safe box'),
('Balcony', '🌅', 'view', 'Private balcony'),
('Pool', '🏊', 'recreation', 'Swimming pool'),
('Gym', '💪', 'recreation', 'Fitness center'),
('Spa', '🧘', 'wellness', 'Spa and wellness center'),
('Restaurant', '🍽️', 'food', 'On-site restaurant'),
('Bar', '🍸', 'food', 'Bar and lounge'),
('Room Service', '🛎️', 'service', '24/7 room service'),
('Concierge', '👨‍💼', 'service', 'Concierge service'),
('Valet Parking', '🚗', 'transport', 'Valet parking service'),
('Business Center', '💼', 'business', 'Business facilities');

-- Sample hotels
INSERT INTO hotels (name, description, location, address, city, country, star_rating, amenities, images) VALUES
('The Grand Luxe Hotel', 'A magnificent 5-star hotel in the heart of the city', 'Downtown Manhattan, New York', '123 Luxury Avenue', 'New York', 'USA', 5, 
 ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Concierge', 'Valet Parking'], 
 ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa']),

('Ocean View Resort', 'Beachfront luxury resort with stunning ocean views', 'Malibu Beach, California', '456 Coastal Drive', 'Malibu', 'USA', 4,
 ARRAY['WiFi', 'Pool', 'Gym', 'Restaurant', 'Bar', 'Room Service'],
 ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791']),

('Mountain Peak Lodge', 'Cozy mountain retreat with spectacular alpine views', 'Swiss Alps, Switzerland', '789 Alpine Road', 'Zermatt', 'Switzerland', 4,
 ARRAY['WiFi', 'Spa', 'Restaurant', 'Bar', 'Concierge'],
 ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d']);

-- Sample rooms for the first hotel
INSERT INTO rooms (hotel_id, number, category, price, max_occupancy, size_sqm, description, amenities, images, is_available) VALUES
((SELECT id FROM hotels WHERE name = 'The Grand Luxe Hotel'), '101', 'SINGLE', 299.99, 1, 25, 'Elegant single room with city view', ARRAY['WiFi', 'Air Conditioning', 'TV', 'Safe'], ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304'], true),
((SELECT id FROM hotels WHERE name = 'The Grand Luxe Hotel'), '102', 'DOUBLE', 499.99, 2, 35, 'Spacious double room with premium amenities', ARRAY['WiFi', 'Air Conditioning', 'TV', 'Minibar', 'Safe'], ARRAY['https://images.unsplash.com/photo-1611892440504-42a792e24d32'], true),
((SELECT id FROM hotels WHERE name = 'The Grand Luxe Hotel'), '201', 'SUITE', 899.99, 4, 65, 'Luxury suite with separate living area', ARRAY['WiFi', 'Air Conditioning', 'TV', 'Minibar', 'Safe', 'Balcony'], ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427'], true),
((SELECT id FROM hotels WHERE name = 'The Grand Luxe Hotel'), '301', 'PRESIDENTIAL', 1999.99, 6, 120, 'Presidential suite with panoramic city views', ARRAY['WiFi', 'Air Conditioning', 'TV', 'Minibar', 'Safe', 'Balcony'], ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'], true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('room-images', 'room-images', true),
('hotel-images', 'hotel-images', true),
('avatars', 'avatars', true),
('review-images', 'review-images', true);

-- Storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own avatar" ON storage.objects 
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Authenticated users can upload review images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'review-images' AND auth.role() = 'authenticated');
