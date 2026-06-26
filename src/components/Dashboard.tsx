import { useState, useEffect } from 'react';
import { FlashDesign, BookingSlot } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { Header } from './Header';
import { FlashDesignsSection } from './FlashDesignsSection';
import { BookingSlotsSection } from './BookingSlotsSection';
import { BookingDialog } from './BookingDialog';
import { Skeleton } from '@/components/ui/skeleton';

export function Dashboard() {
  const [designs, setDesigns] = useState<FlashDesign[]>([]);
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<FlashDesign | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: designsData } = await supabase
      .from('flash_designs')
      .select('*')
      .order('created_at');

    const { data: slotsData } = await supabase
      .from('booking_slots')
      .select('*')
      .order('slot_date')
      .order('slot_time');

    if (designsData) setDesigns(designsData);
    if (slotsData) setSlots(slotsData);
    setLoading(false);
  };

  const handleSelectDesign = (design: FlashDesign) => {
    setSelectedDesign(design);
    setDialogOpen(true);
  };

  const handleSelectSlot = (slot: BookingSlot) => {
    if (slot.status === 'booked') return;
    setSelectedSlot(slot);
    setDialogOpen(true);
  };

  const handleClearSelection = () => {
    setSelectedDesign(null);
    setSelectedSlot(null);
    fetchData();
  };

  const handleNewBooking = () => {
    setSelectedDesign(null);
    setSelectedSlot(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent" />
      <div className="relative z-10">
        <Header onNewBooking={handleNewBooking} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="space-y-8">
              <div>
                <Skeleton className="h-8 w-48 bg-zinc-800 mb-2" />
                <Skeleton className="h-4 w-64 bg-zinc-800" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square bg-zinc-800" />
                    <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                    <Skeleton className="h-4 w-1/2 bg-zinc-800" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <FlashDesignsSection designs={designs} onSelectDesign={handleSelectDesign} />
              <BookingSlotsSection
                slots={slots}
                onSelectSlot={handleSelectSlot}
                selectedSlotId={selectedSlot?.id || null}
              />
            </>
          )}
        </main>
        <footer className="border-t border-zinc-800 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-zinc-500 text-sm">
              INKWELL STUDIOS - Tattoo Art Collective
            </p>
            <p className="text-zinc-600 text-xs mt-2">
              Premium tattoo artistry since 2015
            </p>
          </div>
        </footer>
      </div>

      <BookingDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        design={selectedDesign}
        slot={selectedSlot}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
}
