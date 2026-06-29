-- Drop existing Clerk-based policies
DROP POLICY IF EXISTS select_own_bookings ON bookings;
DROP POLICY IF EXISTS insert_own_bookings ON bookings;
DROP POLICY IF EXISTS update_own_bookings ON bookings;
DROP POLICY IF EXISTS delete_own_bookings ON bookings;

-- Change user_id column type back to UUID
ALTER TABLE bookings ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- Re-create policies using auth.uid() for Supabase auth
CREATE POLICY "select_own_bookings" ON bookings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_bookings" ON bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_bookings" ON bookings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_bookings" ON bookings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);