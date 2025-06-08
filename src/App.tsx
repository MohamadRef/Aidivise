import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import ResetPassword from './pages/ResetPassword';

import {
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';

import Auth from './components/Auth';
import Account from './components/account';
import Layout from './components/layout';
import Home from './pages/Home';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 to check current route

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) navigate('/home');
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) navigate('/home');
      else navigate('/');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🎥 Show video background only on the login page */}
      {location.pathname === '/' && (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src="/Background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
        </>
      )}

      {/* 🌐 Main content routes */}
      <Routes>
        <Route path="/" element={<Layout><Auth /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}
