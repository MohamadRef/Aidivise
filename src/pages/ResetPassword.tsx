import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ResetPassword() { // This component handles the password reset functionality.
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [sessionChecked, setSessionChecked] = useState(false);
  const [error, setError] = useState('');

  // Listen for auth token in URL (from Supabase)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSessionChecked(true);
      } else {
        // No session = redirect to login
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
  // this effect checks if the user is authenticated and sets sessionChecked to true if they are.
  async function handleUpdatePassword() {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(error.message);
    } else {
      navigate('/'); // Redirect to login page
    }
  }
  // This function updates the user's password using Supabase's updateUser method and handles any errors that may occur.
  return sessionChecked ? (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Reset your password</h2>
        <input
          type="password"
          placeholder="New password"
          className="w-full p-3 mb-4 border rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handleUpdatePassword}
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          Update Password
        </button>
        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  ) : null;
}
