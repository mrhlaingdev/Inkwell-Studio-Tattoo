CREATE TABLE simple_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE simple_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anon" ON simple_bookings
  FOR ALL USING (true) WITH CHECK (true);