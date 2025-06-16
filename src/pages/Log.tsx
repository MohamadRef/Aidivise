import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Calendar,
  Heart,
  Moon,
  Zap,
  Smile,
  Frown,
  Meh,
  Edit3,
  Trash2,
  Save,
  Plus,
  Activity,
  Brain,
  Clock,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

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
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchLogs = async () => {
    setFetching(true);
    const user = (await supabase.auth.getUser()).data.user;
    const { data, error } = await supabase
      .from('health_logs')
      .select('*')
      .eq('user_id', user?.id)
      .order('date', { ascending: false });

    if (!error) setLogs(data || []);
    setFetching(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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
      setShowForm(false);
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
    if (confirm('Are you sure you want to delete this log?')) {
      const { error } = await supabase.from('health_logs').delete().eq('id', id);
      if (!error) fetchLogs();
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'excellent':
      case 'great':
      case 'good':
        return <Smile className="w-5 h-5 text-green-400" />;
      case 'fair':
      case 'okay':
      case 'neutral':
        return <Meh className="w-5 h-5 text-yellow-400" />;
      case 'poor':
      case 'bad':
      case 'terrible':
        return <Frown className="w-5 h-5 text-red-400" />;
      default:
        return <Heart className="w-5 h-5 text-purple-400" />;
    }
  };

  const getPainColor = (level: number) => {
    if (level <= 3) return 'text-green-400';
    if (level <= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSleepColor = (hours: number) => {
    if (hours >= 7 && hours <= 9) return 'text-green-400';
    if (hours >= 6 || hours <= 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-pink-500 rounded-full blur-xl opacity-10 animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full blur-xl opacity-15 animate-pulse delay-500"></div>
        <div className="absolute top-3/4 right-1/3 w-64 h-64 bg-indigo-500 rounded-full blur-xl opacity-12 animate-bounce delay-1500"></div>
      </div>
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white opacity-10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-6 py-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6 animate-pulse">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Health Log Tracker
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Track your daily health metrics with our intelligent logging system. Monitor symptoms, mood, sleep, and pain levels to gain insights into your wellbeing.
          </p>
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2 text-emerald-400"><TrendingUp /><span>Progress Tracking</span></div>
            <div className="flex items-center gap-2 text-teal-400"><Brain /><span>Smart Analytics</span></div>
            <div className="flex items-center gap-2 text-cyan-400"><Clock /><span>Daily Monitoring</span></div>
          </div>
        </div>

        {/* Add New Entry */}
        <div className="text-center mb-8">
          {!showForm && (
            <div className="relative inline-block group">
              <button
                onClick={() => setShowForm(true)}
                className="relative z-10 inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-8 rounded-2xl transition-transform hover:scale-105 hover:shadow-xl"
              >
                <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
                <span>Add New Health Entry</span>
                <Zap className="w-5 h-5 transition-transform group-hover:scale-110" />
              </button>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none" />
            </div>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="max-w-4xl mx-auto mb-12 px-4">
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-emerald-400" /> New Health Entry
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setForm({ date: '', symptoms: '', mood: '', sleep_hours: '', pain_level: '' });
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date */}
                <div className="relative">
                  <label className="block text-sm text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    onFocus={() => setFocusedField('date')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-emerald-400 transition"
                    required
                  />
                  {focusedField === 'date' && <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-20 pointer-events-none" />}
                </div>

                {/* Symptoms */}
                <div className="relative">
                  <label className="block text-sm text-slate-300 mb-1">Symptoms</label>
                  <textarea
                    placeholder="Describe any symptoms..."
                    value={form.symptoms}
                    onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                    onFocus={() => setFocusedField('symptoms')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white h-24 resize-none focus:border-emerald-400 transition"
                  />
                  {focusedField === 'symptoms' && <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-20 pointer-events-none" />}
                </div>

                {/* Mood */}
                <div className="relative">
                  <label className="block text-sm text-slate-300 mb-1">Mood</label>
                  <select
                    value={form.mood}
                    onChange={(e) => setForm({ ...form, mood: e.target.value })}
                    onFocus={() => setFocusedField('mood')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-emerald-400 transition"
                    required
                  >
                    <option value="" disabled>Select mood…</option>
                    <option value="Excellent">😄 Excellent</option>
                    <option value="Good">😊 Good</option>
                    <option value="Fair">😐 Fair</option>
                    <option value="Poor">😔 Poor</option>
                    <option value="Terrible">😢 Terrible</option>
                  </select>
                  {focusedField === 'mood' && <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-20 pointer-events-none" />}
                </div>

                {/* Sleep & Pain */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm text-slate-300 mb-1">Sleep Hours</label>
                    <input
                      type="number"
                      min="0" max="24" step="0.5"
                      placeholder="7.5"
                      value={form.sleep_hours}
                      onChange={(e) => setForm({ ...form, sleep_hours: e.target.value })}
                      onFocus={() => setFocusedField('sleep')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-emerald-400 transition"
                    />
                    <Moon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    {focusedField === 'sleep' && <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-20 pointer-events-none" />}
                  </div>
                  <div className="relative">
                    <label className="block text-sm text-slate-300 mb-1">Pain Level</label>
                    <input
                      type="number"
                      min="0" max="10"
                      placeholder="0"
                      value={form.pain_level}
                      onChange={(e) => setForm({ ...form, pain_level: e.target.value })}
                      onFocus={() => setFocusedField('pain')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-emerald-400 transition"
                    />
                    <AlertTriangle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    {focusedField === 'pain' && <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-20 pointer-events-none" />}
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-2xl transition ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-xl'
                    }`}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span>{loading ? 'Saving...' : 'Save Entry'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Logs */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Heart className="text-emerald-400" /> Your Health Journey
          </h2>
          <p className="text-slate-400">Track your progress over time</p>
        </div>

        {fetching ? (
          <div className="text-center py-16 text-slate-400">
            <span>Loading your health logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16">
            <Activity className="mx-auto text-slate-500 mb-4" />
            <p className="text-slate-400">No health logs yet. Add an entry above to get started!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {logs.map((log, idx) => (
              <div
                key={log.id}
                className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition transform hover:scale-[1.02]"
                style={{ animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both` }}
              >
                {editingId === log.id ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Edit3 className="text-amber-400" /> Edit Entry
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="date"
                        value={editingData.date}
                        onChange={(e) => setEditingData({ ...editingData, date: e.target.value })}
                        className="bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-emerald-400 transition"
                      />
                      <input
                        placeholder="Symptoms"
                        value={editingData.symptoms}
                        onChange={(e) => setEditingData({ ...editingData, symptoms: e.target.value })}
                        className="bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-emerald-400 transition"
                      />
                      <select
                        value={editingData.mood}
                        onChange={(e) => setEditingData({ ...editingData, mood: e.target.value })}
                        className="bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-emerald-400 transition"
                      >
                        <option>Excellent</option>
                        <option>Good</option>
                        <option>Fair</option>
                        <option>Poor</option>
                        <option>Terrible</option>
                      </select>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        placeholder="Sleep hrs"
                        value={editingData.sleep_hours}
                        onChange={(e) => setEditingData({ ...editingData, sleep_hours: e.target.value })}
                        className="bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-emerald-400 transition"
                      />
                      <input
                        type="number"
                        min="0"
                        max="10"
                        placeholder="Pain lvl"
                        value={editingData.pain_level}
                        onChange={(e) => setEditingData({ ...editingData, pain_level: e.target.value })}
                        className="bg-white/5 border border-white/20 rounded-xl p-3 text-white focus:border-emerald-400 transition"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleUpdate}
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-2 px-4 rounded-xl transition hover:scale-105"
                      >
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-xl transition hover:bg-slate-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{log.date}</h3>
                          <p className="text-emerald-400 text-sm">Entry #{logs.length - idx}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <div className="flex items-center gap-2 mb-2"><Heart className="text-purple-400 w-4 h-4" /><span className="text-slate-300 text-sm">Symptoms</span></div>
                          <p className="text-white text-sm">{log.symptoms || 'None'}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <div className="flex items-center gap-2 mb-2">{getMoodIcon(log.mood)}<span className="text-slate-300 text-sm">Mood</span></div>
                          <p className="text-white text-sm">{log.mood}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <div className="flex items-center gap-2 mb-2"><Moon className="w-4 h-4 text-blue-400" /><span className="text-slate-300 text-sm">Sleep</span></div>
                          <p className={`font-semibold ${getSleepColor(log.sleep_hours)}`}>{log.sleep_hours} hrs</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-slate-300 text-sm">Pain</span></div>
                          <p className={`font-semibold ${getPainColor(log.pain_level)}`}>{log.pain_level}/10</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button onClick={() => handleEdit(log)} className="p-3 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl transition hover:scale-110">
                        <Edit3 className="text-amber-400 w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(log.id)} className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition hover:scale-110">
                        <Trash2 className="text-red-400 w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
