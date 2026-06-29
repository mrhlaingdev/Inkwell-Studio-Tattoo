import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onNewBooking: () => void;
}

export function Header({ onNewBooking }: HeaderProps) {
  const { user, signOut } = useAuth();

  const email = user?.email || '';

  return (
    <header className="bg-zinc-950/95 border-b border-zinc-800 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold tracking-tight">
              INKWELL <span className="text-red-600">STUDIOS</span>
            </h1>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#flash" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                Flash Tattoos
              </a>
              <a href="#bookings" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
                Available Slots
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={onNewBooking}
              className="bg-red-700 hover:bg-red-600 text-white font-semibold"
            >
              Book a Session
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-zinc-300" />
                  </div>
                  <span className="text-sm hidden sm:inline">{email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium text-zinc-100">{email}</p>
                </div>
                <DropdownMenuItem
                  onClick={signOut}
                  className="text-red-400 focus:text-red-300 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
