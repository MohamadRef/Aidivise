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
    if (error) setMessage(error.message);
    else setMessage('✅ Check your email for confirmation link!');
    setLoading(false);
  }

  async function handleLogin() {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else setMessage('✅ Logged in successfully!');
    setLoading(false);
  }

  return (
    <div className="max-w-md w-full mx-auto p-8 rounded-2xl shadow-2xl backdrop-blur-sm bg-white/90 text-black">
      <h2 className="text-3xl font-bold mb-6 text-center">Login / Sign Up</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex space-x-4">
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`flex-1 p-3 rounded-lg text-white font-semibold transition ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className={`flex-1 p-3 rounded-lg text-white font-semibold transition ${
            loading
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </div>

      {message && (
        <p className="mt-6 text-center text-sm font-medium text-gray-700">{message}</p>
      )}
    </div>
  );
}
