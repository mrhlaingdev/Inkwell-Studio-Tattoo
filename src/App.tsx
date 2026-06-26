import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@/components/AuthForm';
import { Dashboard } from '@/components/Dashboard';

function App() {
  const { loading, user } = useAuth();

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
    return <AuthForm />;
  }

  return <Dashboard />;
}

export default App;
