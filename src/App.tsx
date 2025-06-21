import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
} from 'react-router-dom';

import Auth from './components/Auth';
import Layout from './components/layout';

import Home from './pages/Home';
import Symptoms from './pages/Symptoms';
import Log from './pages/Log';
import Nutrition from './pages/Nutrition';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  const [setSession] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check current session on first load
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);

      // Only redirect to /home if user is on the root path
      if (data.session && location.pathname === '/') {
        navigate('/home');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session && location.pathname === '/') {
        navigate('/home');
      } else if (!session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🎥 Show background video only on root auth page */}
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

      {/* 🧭 Routes */}
      <Routes>
          <Route path="/" element={<Layout><Auth /></Layout>} />
          <Route path="/home" element={<Layout><Home /></Layout>} />
          <Route path="/symptoms" element={<Layout><Symptoms /></Layout>} />
          <Route path="/log" element={<Layout><Log /></Layout>} />
          <Route path="/nutrition" element={<Layout><Nutrition /></Layout>} />
          <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>

    </div>
  );
}
