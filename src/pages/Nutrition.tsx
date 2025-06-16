import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Log() {
  const [form, setForm] = useState({
    date: '',
    symptoms: '',
    mood: '',
    sleep_hours: '',
    pain_level: '',
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchLogs = async () => {
    setFetching(true);
    const user = (await supabase.auth.getUser()).data.user;
    const { data, error } = await supabase
      .from('health_logs')
      .select('*')
      .eq('user_id', user?.id)
      .order('date', { ascending: false });

    if (!error) setLogs(data);
    setFetching(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const sleep = Number(form.sleep_hours);
    const pain = Number(form.pain_level);
    if (isNaN(sleep) || sleep < 0 || sleep > 24) {
      alert('Sleep hours must be between 0 and 24');
      return;
    }
    if (isNaN(pain) || pain < 0 || pain > 10) {
      alert('Pain level must be between 0 and 10');
      return;
    }

    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;

    if (editId) {
      // Update existing log
      await supabase
        .from('health_logs')
        .update({
          ...form,
          sleep_hours: sleep,
          pain_level: pain,
        })
        .eq('id', editId);
    } else {
      // Insert new log
      await supabase.from('health_logs').insert([
        {
          ...form,
          sleep_hours: sleep,
          pain_level: pain,
          user_id: user?.id,
        },
      ]);
    }

    setForm({ date: '', symptoms: '', mood: '', sleep_hours: '', pain_level: '' });
    setEditId(null);
    await fetchLogs();
    setLoading(false);
  };

  const handleEdit = (log: any) => {
    setForm({
      date: log.date,
      symptoms: log.symptoms,
      mood: log.mood,
      sleep_hours: log.sleep_hours,
      pain_level: log.pain_level,
    });
    setEditId(log.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this log?')) {
      await supabase.from('health_logs').delete().eq('id', id);
      await fetchLogs();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-teal-400 mb-6 text-center">📅 Health Log Tracker</h1>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-gray-800 p-6 rounded-md mb-12">
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full mb-4 p-2 text-black rounded"
          required
        />
        <input
          type="text"
          placeholder="Symptoms"
          value={form.symptoms}
          onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
          className="w-full mb-4 p-2 text-black rounded"
        />
        <input
          type="text"
          placeholder="Mood"
          value={form.mood}
          onChange={(e) => setForm({ ...form, mood: e.target.value })}
          className="w-full mb-4 p-2 text-black rounded"
        />
        <input
          type="number"
          placeholder="Sleep Hours (0–24)"
          value={form.sleep_hours}
          onChange={(e) => setForm({ ...form, sleep_hours: e.target.value })}
          className="w-full mb-4 p-2 text-black rounded"
        />
        <input
          type="number"
          placeholder="Pain Level (0–10)"
          value={form.pain_level}
          onChange={(e) => setForm({ ...form, pain_level: e.target.value })}
          className="w-full mb-4 p-2 text-black rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            editId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-teal-500 hover:bg-teal-600'
          } text-white font-semibold py-2 rounded transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Saving...' : editId ? 'Update Log' : 'Save Entry'}
        </button>
      </form>

      <div className="max-w-3xl mx-auto space-y-4">
        {fetching ? (
          <p className="text-center text-gray-400">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-center text-gray-500">No logs yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-gray-800 p-4 rounded border border-teal-600 relative">
              <p className="text-teal-300 font-semibold">🗓 {log.date}</p>
              <p>🩺 Symptoms: {log.symptoms}</p>
              <p>😊 Mood: {log.mood}</p>
              <p>😴 Sleep: {log.sleep_hours} hrs</p>
              <p>💢 Pain: {log.pain_level}/10</p>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleEdit(log)}
                  className="text-yellow-400 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="text-red-400 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
