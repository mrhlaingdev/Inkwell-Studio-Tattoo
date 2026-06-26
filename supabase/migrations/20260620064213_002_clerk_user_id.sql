-- Drop existing policies first
DROP POLICY IF EXISTS select_own_bookings ON bookings;
DROP POLICY IF EXISTS insert_own_bookings ON bookings;
DROP POLICY IF EXISTS update_own_bookings ON bookings;
DROP POLICY IF EXISTS delete_own_bookings ON bookings;

-- Drop the foreign key constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;

-- Change user_id column type from UUID to TEXT
ALTER TABLE bookings ALTER COLUMN user_id TYPE TEXT;

-- Re-create policies using auth.jwt() for Clerk
CREATE POLICY "select_own_bookings" ON bookings FOR SELECT
  TO authenticated USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "insert_own_bookings" ON bookings FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "update_own_bookings" ON bookings FOR UPDATE
  TO authenticated USING (user_id = auth.jwt() ->> 'sub') WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "delete_own_bookings" ON bookings FOR DELETE
  TO authenticated USING (user_id = auth.jwt() ->> 'sub');