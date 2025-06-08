import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : '✅ Check your email for confirmation link!');
    setLoading(false);
  }

  async function handleLogin() {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : '✅ Logged in successfully!');
    setLoading(false);
  }

  return (
    <div className="max-w-md w-full mx-auto p-8 rounded-2xl shadow-xl backdrop-blur-md bg-white/10 text-white border border-white/20">
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">Login / Sign Up</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-4 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-6 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex space-x-4">
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`flex-1 p-3 rounded-md font-semibold transition text-white ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className={`flex-1 p-3 rounded-md font-semibold transition text-white ${
            loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </div>

      {message && (
        <p className="mt-6 text-center text-sm font-medium text-red-400">{message}</p>
      )}
    </div>
  );
}
