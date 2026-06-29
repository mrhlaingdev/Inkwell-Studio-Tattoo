CREATE POLICY "select_all_bookings" ON bookings FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "update_all_bookings" ON bookings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);