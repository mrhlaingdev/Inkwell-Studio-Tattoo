import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/AuthForm';
import { Dashboard } from '@/components/Dashboard';
import { ArtistDashboard } from '@/components/ArtistDashboard';
import { Button } from '@/components/ui/button';
import { Palette, Users } from 'lucide-react';

function App() {
  const { loading, user } = useAuth();
  const [viewMode, setViewMode] = useState<'customer' | 'artist'>('customer');

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-2 w-32 bg-zinc-800 rounded" />
          <div className="h-2 w-24 bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onArtistLogin={() => setViewMode('artist')} />;
  }

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-zinc-900/90 border border-zinc-700 rounded-lg p-2 backdrop-blur-sm">
        <Button
          variant={viewMode === 'customer' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('customer')}
          className={viewMode === 'customer' ? 'bg-red-700 hover:bg-red-600' : 'text-zinc-400 hover:text-zinc-100'}
        >
          <Users className="w-4 h-4 mr-2" />
          Customer
        </Button>
        <Button
          variant={viewMode === 'artist' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('artist')}
          className={viewMode === 'artist' ? 'bg-red-700 hover:bg-red-600' : 'text-zinc-400 hover:text-zinc-100'}
        >
          <Palette className="w-4 h-4 mr-2" />
          Artist
        </Button>
      </div>

      {viewMode === 'customer' ? <Dashboard /> : <ArtistDashboard />}
    </div>
  );
}

export default App;
