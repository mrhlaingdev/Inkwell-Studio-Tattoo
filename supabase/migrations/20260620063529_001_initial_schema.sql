-- Flash designs table (pre-made tattoo designs)
CREATE TABLE flash_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  style TEXT NOT NULL,
  size TEXT NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Booking slots (available time slots for appointments)
CREATE TABLE booking_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'booked', 'waitlist')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bookings (user bookings)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flash_design_id UUID REFERENCES flash_designs(id),
  booking_slot_id UUID NOT NULL REFERENCES booking_slots(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE flash_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Flash designs are publicly readable
CREATE POLICY "read_flash_designs" ON flash_designs FOR SELECT
  TO public USING (true);

-- Booking slots are publicly readable
CREATE POLICY "read_booking_slots" ON booking_slots FOR SELECT
  TO public USING (true);

-- Bookings: users can only see their own bookings
CREATE POLICY "select_own_bookings" ON bookings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_bookings" ON bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_bookings" ON bookings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_bookings" ON bookings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Insert flash designs
INSERT INTO flash_designs (name, description, image_url, style, size, price) VALUES
('Eternal Serpent', 'Coiled snake wrapping around a dagger with roses', 'https://images.pexels.com/photos/1109515/pexels-photo-1109515.jpeg?auto=compress&cs=tinysrgb&w=600', 'Traditional', 'Medium', 250),
('Sacred Heart', 'Flaming sacred heart with thorns and roses', 'https://images.pexels.com/photos/1109514/pexels-photo-1109514.jpeg?auto=compress&cs=tinysrgb&w=600', 'Neo-Traditional', 'Small', 180),
('Geometric Wolf', 'Wolf head with geometric patterns and sacred geometry', 'https://images.pexels.com/photos/1109513/pexels-photo-1109513.jpeg?auto=compress&cs=tinysrgb&w=600', 'Geometric', 'Medium', 300),
('Japanese Dragon', 'Traditional Japanese style dragon with clouds', 'https://images.pexels.com/photos/1109512/pexels-photo-1109512.jpeg?auto=compress&cs=tinysrgb&w=600', 'Japanese', 'Large', 450),
('Rose Mandala', 'Intricate mandala pattern with blooming roses', 'https://images.pexels.com/photos/1109511/pexels-photo-1109511.jpeg?auto=compress&cs=tinysrgb&w=600', 'Mandala', 'Medium', 280);

-- Insert booking slots for the next 2 weeks (starting from 2026-06-20)
-- Weekday slots: 10am, 12pm, 2pm, 4pm
INSERT INTO booking_slots (slot_date, slot_time, status)
SELECT 
  d::date,
  t::time,
  CASE 
    WHEN random() < 0.3 THEN 'booked'
    WHEN random() < 0.4 THEN 'waitlist'
    ELSE 'available'
  END
FROM generate_series('2026-06-21'::date, '2026-07-04'::date, '1 day'::interval) d
CROSS JOIN (VALUES 
  ('10:00:00'), 
  ('12:00:00'), 
  ('14:00:00'), 
  ('16:00:00')
) AS times(t)
WHERE EXTRACT(dow FROM d) NOT IN (0, 6);