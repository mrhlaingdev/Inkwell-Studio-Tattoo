import { BookingSlot } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Zap } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface BookingSlotsSectionProps {
  slots: BookingSlot[];
  onSelectSlot: (slot: BookingSlot) => void;
  selectedSlotId: string | null;
}

export function BookingSlotsSection({ slots, onSelectSlot, selectedSlotId }: BookingSlotsSectionProps) {
  const groupedByDate = slots.reduce((acc, slot) => {
    const date = slot.slot_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, BookingSlot[]>);

  const sortedDates = Object.keys(groupedByDate).sort();

  const getStatusStyle = (status: BookingSlot['status'], isSelected: boolean) => {
    const base = 'cursor-pointer transition-all duration-200 border rounded-lg p-3 ';
    const selectedRing = isSelected ? 'ring-2 ring-red-600 ' : '';

    if (status === 'available') {
      return base + selectedRing + 'bg-emerald-950/30 border-emerald-800/50 hover:border-emerald-600/75 hover:bg-emerald-900/40';
    }
    if (status === 'booked') {
      return base + 'bg-zinc-900/30 border-zinc-700/50 opacity-50 cursor-not-allowed';
    }
    if (status === 'waitlist') {
      return base + selectedRing + 'bg-amber-950/30 border-amber-800/50 hover:border-amber-600/75 hover:bg-amber-900/40';
    }
    return base;
  };

  const getStatusBadge = (status: BookingSlot['status']) => {
    switch (status) {
      case 'available':
        return (
          <Badge className="bg-emerald-900/80 text-emerald-400 border-emerald-700 text-xs">
            Available
          </Badge>
        );
      case 'booked':
        return (
          <Badge className="bg-zinc-800 text-zinc-500 border-zinc-700 text-xs">
            Booked
          </Badge>
        );
      case 'waitlist':
        return (
          <Badge className="bg-amber-900/80 text-amber-400 border-amber-700 text-xs">
            Waitlist
          </Badge>
        );
    }
  };

  return (
    <section id="bookings" className="py-16">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-zinc-100 mb-2">Available Time Slots</h2>
        <p className="text-zinc-400">Select a time slot to book your tattoo session</p>
      </div>
      <div className="space-y-6">
        {sortedDates.map((date) => {
          const dateObj = parseISO(date);
          return (
            <div key={date} className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-zinc-100">
                  {format(dateObj, 'EEEE, MMMM d, yyyy')}
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {groupedByDate[date]
                  .sort((a, b) => a.slot_time.localeCompare(b.slot_time))
                  .map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    const isClickable = slot.status !== 'booked';
                    return (
                      <div
                        key={slot.id}
                        className={getStatusStyle(slot.status, isSelected)}
                        onClick={() => isClickable && onSelectSlot(slot)}
                        role={isClickable ? 'button' : undefined}
                        tabIndex={isClickable ? 0 : undefined}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && isClickable) onSelectSlot(slot);
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          {getStatusBadge(slot.status)}
                          {isSelected && <Zap className="h-4 w-4 text-red-500" />}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">
                            {format(new Date(`2000-01-01T${slot.slot_time}`), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
