export interface FlashDesign {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  style: string;
  size: string;
  price: number;
  created_at: string;
}

export interface BookingSlot {
  id: string;
  slot_date: string;
  slot_time: string;
  status: 'available' | 'booked' | 'waitlist';
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  flash_design_id: string | null;
  booking_slot_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}
