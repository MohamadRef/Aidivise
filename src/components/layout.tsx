import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  return (
    <div className="min-h-screen flex flex-col z-20 relative">
      {/* Header */}
      <header className="w-full px-6 py-4 bg-black/60 text-white backdrop-blur-md shadow-md z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide">Aidvise</h1>
          <div className="flex items-center space-x-4">
          <a href="#" className="hover:underline text-sm">Home</a>
            <a href="#" className="hover:underline text-sm">About</a>
            <a href="#" className="hover:underline text-sm">Contact</a>
            {session && (
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-4 text-sm text-center text-white bg-black/60 backdrop-blur-md z-50">
        © {new Date().getFullYear()} Aidvise. All rights reserved.
      </footer>
    </div>
  );
}
