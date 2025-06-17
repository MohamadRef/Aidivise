// src/components/Auth.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type LoadingAction = '' | 'login' | 'signup';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loadingAction, setLoadingAction] = useState<LoadingAction>('');
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();

  async function handleSignUp() {
    setLoadingAction('signup');
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('✅ Check your email for confirmation link!');
    }
    setLoadingAction('');
  }

  async function handleLogin() {
    setLoadingAction('login');
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      setShowReset(true);
    } else {
      setMessage('✅ Logged in successfully!');
      // navigate('/home');
    }
    setLoadingAction('');
  }

  async function handlePasswordReset() {
    if (!email) {
      setMessage('⚠️ Please enter your email to receive a reset link.');
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('✅ Check your inbox to reset your password.');
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleLogin();
    }
  }

  const isLoggingIn = loadingAction === 'login';
  const isSigningUp = loadingAction === 'signup';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[url('/background.jpg')] bg-cover">
      <div
        className={`w-full max-w-md p-6 bg-white/10 backdrop-blur-md text-white rounded-xl shadow-xl ${
          message.includes('Invalid') ? 'animate-shake' : 'animate-fadeIn'
        }`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login / Sign Up</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border border-gray-300 rounded-md bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <div className="flex space-x-4">
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className={`flex-1 p-3 rounded-md transition-transform transform hover:scale-105 active:scale-95 ${
              isLoggingIn ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoggingIn ? 'Logging in…' : 'Log In'}
          </button>

          <button
            onClick={handleSignUp}
            disabled={isSigningUp}
            className={`flex-1 p-3 rounded-md transition-transform transform hover:scale-105 active:scale-95 ${
              isSigningUp ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSigningUp ? 'Signing up…' : 'Sign Up'}
          </button>
        </div>

        {showReset && (
          <p
            onClick={handlePasswordReset}
            className="mt-4 text-sm text-center text-blue-400 hover:underline cursor-pointer"
          >
            Forgot your password?
          </p>
        )}

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-red-400">{message}</p>
        )}

        {/* ❤️ About Aidvise */}
        <div className="mt-10 text-sm text-center text-gray-300 px-4">
          <hr className="border-gray-600 mb-6" />
          <p className="mb-3 italic">
            Aidvise was built with care, love, and purpose — inspired by two remarkable doctors who also happen to be my parents.
          </p>
          <p className="text-gray-400">
            Their dedication to helping others motivated me to create a smart health companion that brings the power of wellness tracking to everyone.
          </p>
        </div>
      </div>
    </div>
  );
}
