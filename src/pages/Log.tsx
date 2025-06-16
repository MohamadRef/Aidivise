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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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
    if (isNaN(sleep) || sleep < 0 || sleep > 24) return alert('Sleep 0–24');
    if (isNaN(pain) || pain < 0 || pain > 10) return alert('Pain 0–10');

    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase.from('health_logs').insert([
      { ...form, sleep_hours: sleep, pain_level: pain, user_id: user?.id },
    ]);

    if (!error) {
      setForm({ date: '', symptoms: '', mood: '', sleep_hours: '', pain_level: '' });
      fetchLogs();
    }

    setLoading(false);
  };

  const handleEdit = (log: any) => {
    setEditingId(log.id);
    setEditingData(log);
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('health_logs')
      .update({
        ...editingData,
        sleep_hours: Number(editingData.sleep_hours),
        pain_level: Number(editingData.pain_level),
      })
      .eq('id', editingId!);

    if (!error) {
      setEditingId(null);
      setEditingData({});
      fetchLogs();
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('health_logs').delete().eq('id', id);
    if (!error) fetchLogs();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-teal-400 mb-6 text-center">
        📅 Health Log Tracker
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-gray-800 p-6 rounded-md mb-12"
      >
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
          className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </form>

      <div className="max-w-3xl mx-auto space-y-4">
        {fetching ? (
          <p className="text-center text-gray-400">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-center text-gray-500">No logs yet.</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="bg-gray-800 p-4 rounded border border-teal-600 space-y-1"
            >
              {editingId === log.id ? (
                <>
                  <input
                    type="date"
                    value={editingData.date}
                    onChange={(e) => setEditingData({ ...editingData, date: e.target.value })}
                    className="w-full p-1 text-black rounded"
                  />
                  <input
                    value={editingData.symptoms}
                    onChange={(e) => setEditingData({ ...editingData, symptoms: e.target.value })}
                    className="w-full p-1 text-black rounded"
                  />
                  <input
                    value={editingData.mood}
                    onChange={(e) => setEditingData({ ...editingData, mood: e.target.value })}
                    className="w-full p-1 text-black rounded"
                  />
                  <input
                    type="number"
                    value={editingData.sleep_hours}
                    onChange={(e) => setEditingData({ ...editingData, sleep_hours: e.target.value })}
                    className="w-full p-1 text-black rounded"
                  />
                  <input
                    type="number"
                    value={editingData.pain_level}
                    onChange={(e) => setEditingData({ ...editingData, pain_level: e.target.value })}
                    className="w-full p-1 text-black rounded"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleUpdate}
                      className="bg-teal-500 px-3 py-1 rounded text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-600 px-3 py-1 rounded text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-teal-300 font-semibold">🗓 {log.date}</p>
                  <p>🩺 Symptoms: {log.symptoms}</p>
                  <p>😊 Mood: {log.mood}</p>
                  <p>😴 Sleep: {log.sleep_hours} hrs</p>
                  <p>💢 Pain: {log.pain_level}/10</p>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => handleEdit(log)}
                      className="text-sm text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="text-sm text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
