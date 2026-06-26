import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FlashDesign, BookingSlot } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { Loader2, Check, Calendar, Clock } from 'lucide-react';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  design: FlashDesign | null;
  slot: BookingSlot | null;
  onClearSelection: () => void;
}

export function BookingDialog({ open, onOpenChange, design, slot, onClearSelection }: BookingDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [designs, setDesigns] = useState<FlashDesign[]>([]);
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(design?.id || null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(slot?.id || null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDesigns();
    fetchSlots();
  }, []);

  useEffect(() => {
    if (!design?.id) {
      fetchDesigns();
    }
  }, [design?.id]);

  async function fetchDesigns() {
    const { data } = await supabase.from('flash_designs').select('*').order('name');
    if (data) setDesigns(data);
  }

  async function fetchSlots() {
    const { data } = await supabase
      .from('booking_slots')
      .select('*')
      .eq('status', 'available')
      .order('slot_date')
      .order('slot_time');
    if (data) setSlots(data);
  }

  useEffect(() => {
    setSelectedDesignId(design?.id || null);
  }, [design?.id]);

  useEffect(() => {
    setSelectedSlotId(slot?.id || null);
  }, [slot?.id]);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (!open) {
      setName('');
      setEmail(user?.email || '');
      setPhone('');
      setNotes('');
      setSuccess(false);
      setLoading(false);
    }
  }, [open, user]);

  // Group slots by date
  const groupedSlots = slots.reduce((acc, s) => {
    const date = s.slot_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(s);
    return acc;
  }, {} as Record<string, BookingSlot[]>);

  const sortedDates = Object.keys(groupedSlots).sort();

  const selectedSlotData = slots.find(s => s.id === selectedSlotId);
  const selectedDesignData = designs.find(d => d.id === selectedDesignId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        flash_design_id: selectedDesignId,
        booking_slot_id: selectedSlotId,
        customer_name: name,
        customer_email: email,
        customer_phone: phone || null,
        notes: notes || null,
        status: 'pending',
      });

      if (error) throw error;

      await supabase
        .from('booking_slots')
        .update({ status: 'booked' })
        .eq('id', selectedSlotId);

      setSuccess(true);
      toast({
        title: 'Booking submitted!',
        description: 'We will contact you shortly to confirm your appointment.',
      });

      setTimeout(() => {
        onOpenChange(false);
        onClearSelection();
      }, 1800);
    } catch (err) {
      console.error('Booking error:', err);
      toast({
        title: 'Booking failed',
        description: 'There was an error submitting your booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), 'EEE, MMM d');
  };

  const formatTime = (timeStr: string) => {
    return format(new Date(`2000-01-01T${timeStr}`), 'h:mm a');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-2xl text-zinc-100">
            {success ? 'Booking Confirmed' : 'Book Your Tattoo Session'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {success
              ? 'Your booking request has been submitted successfully!'
              : 'Select a design and time slot, then complete the form below'}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-900/50 flex items-center justify-center">
              <Check className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-zinc-300 text-center">
              We'll send a confirmation to <span className="text-zinc-100 font-medium">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            {/* Design Selection */}
            <div className="space-y-3">
              <Label className="text-zinc-300 text-base font-semibold">Tattoo Design</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {designs.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDesignId(d.id)}
                    className={`cursor-pointer rounded-lg border-2 p-2 transition-all ${
                      selectedDesignId === d.id
                        ? 'border-red-600 bg-red-950/30'
                        : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600'
                    }`}
                  >
                    <img
                      src={d.image_url}
                      alt={d.name}
                      className="w-full aspect-square object-cover rounded mb-2"
                    />
                    <p className="text-zinc-100 text-sm font-medium truncate">{d.name}</p>
                    <p className="text-red-500 text-sm font-bold">${d.price}</p>
                  </div>
                ))}
              </div>
              {selectedDesignData && (
                <div className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700 rounded-lg p-3">
                  <img
                    src={selectedDesignData.image_url}
                    alt={selectedDesignData.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="text-zinc-100 font-medium">{selectedDesignData.name}</p>
                    <p className="text-zinc-400 text-sm">{selectedDesignData.style} - {selectedDesignData.size}</p>
                    <p className="text-red-500 font-bold">${selectedDesignData.price}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Date & Time Selection */}
            <div className="space-y-3">
              <Label className="text-zinc-300 text-base font-semibold">Select Date & Time</Label>
              {sortedDates.length === 0 ? (
                <p className="text-zinc-500 text-sm">No available slots. Please check back later.</p>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {sortedDates.slice(0, 7).map((date) => (
                    <div key={date} className="bg-zinc-800/30 border border-zinc-700 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-red-500" />
                        <span className="text-zinc-200 font-medium">{formatDate(date)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {groupedSlots[date]
                          .sort((a, b) => a.slot_time.localeCompare(b.slot_time))
                          .map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => setSelectedSlotId(s.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                                selectedSlotId === s.id
                                  ? 'bg-red-700 text-white'
                                  : 'bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700'
                              }`}
                            >
                              <Clock className="h-3 w-3" />
                              {formatTime(s.slot_time)}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {selectedSlotData && (
                <div className="flex items-center gap-3 bg-emerald-950/30 border border-emerald-700/50 rounded-lg p-3">
                  <Calendar className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-zinc-100 font-medium">
                      {format(parseISO(selectedSlotData.slot_date), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-emerald-400 text-sm">{formatTime(selectedSlotData.slot_time)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Details */}
            <div className="space-y-4 border-t border-zinc-700 pt-4">
              <Label className="text-zinc-300 text-base font-semibold">Your Details</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300">
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    disabled={loading}
                    className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:ring-red-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-zinc-300">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    disabled={loading}
                    className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:ring-red-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-zinc-300">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us about your tattoo idea or any special requests..."
                  disabled={loading}
                  rows={3}
                  className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:ring-red-600 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  onClearSelection();
                }}
                disabled={loading}
                className="flex-1 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !name || !email || !selectedSlotId}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Submit Booking'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
