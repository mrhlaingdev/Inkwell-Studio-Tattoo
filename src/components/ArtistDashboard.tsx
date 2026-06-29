import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LogOut,
  RefreshCw,
  Calendar,
  Mail,
  Phone,
  Palette,
  Clock,
  User,
} from 'lucide-react';

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  tattoo_design: string | null;
  flash_design_id: string | null;
  booking_date: string | null;
  booking_time: string | null;
  booking_slot_id: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  flash_designs?: {
    name: string;
  } | null;
}

export function ArtistDashboard() {
  const { user, signOut } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*, flash_designs(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  }

  async function handleUpdateStatus(bookingId: string, newStatus: string) {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      fetchBookings();
    }
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      pending: 'bg-amber-900/80 text-amber-400 border-amber-700',
      confirmed: 'bg-emerald-900/80 text-emerald-400 border-emerald-700',
      completed: 'bg-blue-900/80 text-blue-400 border-blue-700',
      cancelled: 'bg-red-900/80 text-red-400 border-red-700',
    };
    return styles[status] || 'bg-zinc-700 text-zinc-400';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent" />

      <header className="relative z-20 bg-zinc-950/95 border-b border-zinc-800 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold tracking-tight">
                INKWELL <span className="text-red-600">STUDIOS</span>
              </h1>
              <Badge className="bg-red-700 text-white ml-2">Artist Dashboard</Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-400 hidden sm:inline">{user?.email}</span>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={signOut}
                variant="ghost"
                className="text-red-400 hover:text-red-300 hover:bg-zinc-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-zinc-100">All Bookings ({bookings.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-zinc-400">Loading bookings...</div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">No bookings yet</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-700 hover:bg-zinc-800/50">
                      <TableHead className="text-zinc-400">Customer</TableHead>
                      <TableHead className="text-zinc-400">Contact</TableHead>
                      <TableHead className="text-zinc-400">Design</TableHead>
                      <TableHead className="text-zinc-400">Date & Time</TableHead>
                      <TableHead className="text-zinc-400">Status</TableHead>
                      <TableHead className="text-zinc-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id} className="border-zinc-800 hover:bg-zinc-800/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-zinc-500" />
                            <span className="font-medium text-zinc-100">{booking.customer_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm text-zinc-300">
                              <Mail className="w-3 h-3 text-zinc-500" />
                              {booking.customer_email}
                            </div>
                            {booking.customer_phone && (
                              <div className="flex items-center gap-1 text-sm text-zinc-400">
                                <Phone className="w-3 h-3 text-zinc-500" />
                                {booking.customer_phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4 text-purple-400" />
                            <span className="text-zinc-200">
                              {booking.flash_designs?.name || booking.tattoo_design || 'Custom Design'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {booking.booking_date && (
                              <div className="flex items-center gap-1 text-sm text-zinc-300">
                                <Calendar className="w-3 h-3 text-zinc-500" />
                                {new Date(booking.booking_date).toLocaleDateString()}
                              </div>
                            )}
                            {booking.booking_time && (
                              <div className="flex items-center gap-1 text-sm text-zinc-400">
                                <Clock className="w-3 h-3 text-zinc-500" />
                                {booking.booking_time}
                              </div>
                            )}
                            {!booking.booking_date && !booking.booking_time && (
                              <span className="text-zinc-500 text-sm">Not scheduled</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadge(booking.status)} border capitalize`}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {booking.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                className="bg-emerald-700 hover:bg-emerald-600 text-xs"
                              >
                                Confirm
                              </Button>
                            )}
                            {booking.status === 'confirmed' && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                className="bg-blue-700 hover:bg-blue-600 text-xs"
                              >
                                Complete
                              </Button>
                            )}
                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                className="border-red-700 text-red-400 hover:bg-red-900/30 text-xs"
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {bookings.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardContent className="p-4">
                <div className="text-zinc-400 text-sm">Pending</div>
                <div className="text-2xl font-bold text-amber-400">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardContent className="p-4">
                <div className="text-zinc-400 text-sm">Confirmed</div>
                <div className="text-2xl font-bold text-emerald-400">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardContent className="p-4">
                <div className="text-zinc-400 text-sm">Completed</div>
                <div className="text-2xl font-bold text-blue-400">
                  {bookings.filter(b => b.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/60 border-zinc-800">
              <CardContent className="p-4">
                <div className="text-zinc-400 text-sm">Cancelled</div>
                <div className="text-2xl font-bold text-red-400">
                  {bookings.filter(b => b.status === 'cancelled').length}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-zinc-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-zinc-500 text-sm">INKWELL STUDIOS - Artist Dashboard</p>
        </div>
      </footer>
    </div>
  );
}
