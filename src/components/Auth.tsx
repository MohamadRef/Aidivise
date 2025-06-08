import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();

  async function handleSignUp() {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage('✅ Check your email for confirmation link!');
    setLoading(false);
  }

  async function handleLogin() {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      setShowReset(true); // Show forgot password only after failed login
    } else {
      setMessage('✅ Logged in successfully!');
    }
    setLoading(false);
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

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white/10 backdrop-blur-md text-white rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold mb-6 text-center">Login / Sign Up</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-4 border border-gray-300 rounded-md bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-6 border border-gray-300 rounded-md bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex space-x-4">
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`flex-1 p-3 rounded-md text-white ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className={`flex-1 p-3 rounded-md text-white ${
            loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
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
    </div>
  );
}
