import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Auth from './components/Auth';
import Account from './components/account';
import Layout from './components/layout';

export default function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🔁 Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/Background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🌑 Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

      {/* 🌐 Layout with nav/footer and main content */}
      <Layout>
        {session ? <Account /> : <Auth />}
      </Layout>
    </div>
  );
}
