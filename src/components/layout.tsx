// src/components/layout.tsx
import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/');
  }

  const base = "text-sm px-3 py-2 rounded-md transition-colors duration-200";
  const active = "bg-teal-500 text-black";
  const inactive = "text-white hover:bg-gray-800";

  function handleProtectedNav(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    if (!session) {
      e.preventDefault();
      window.alert("⚠️ You must be logged in or registered to access that page.");
    }
  }

  const links: { to: string; label: string }[] = [
    { to: "/home", label: "Home" },
    { to: "/symptoms", label: "Symptoms" },
    { to: "/log", label: "Log" },
    { to: "/nutrition", label: "Nutrition" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative z-20">
      <header className="w-full px-6 py-4 bg-black/60 text-white backdrop-blur-md shadow-md fixed top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/home" className="text-xl font-bold tracking-wide hover:text-teal-400 transition-colors">
            Aidvise
          </NavLink>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-4">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={handleProtectedNav}
                className={({ isActive }) =>
                  `${base} ${isActive ? active : inactive}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Logout button */}
          {session && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 pt-20 pb-4">
        {children}
      </main>

      <footer className="w-full px-6 py-4 text-sm text-center text-white bg-black/60 backdrop-blur-md">
        © {new Date().getFullYear()} Aidvise. All rights reserved.
      </footer>
    </div>
  );
}
