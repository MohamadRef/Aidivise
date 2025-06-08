import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Account() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="text-white text-center space-y-4">
      <h1 className="text-2xl font-bold">Welcome, {userEmail}</h1>
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
      >
        Sign Out
      </button>
    </div>
  );
}
