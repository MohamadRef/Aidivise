import { useState, useEffect } from 'react';
import { Calendar, Heart, Moon, Zap, Smile, Frown, Meh, Edit3, Trash2, Save, Plus, Activity, Brain, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

export default function Log() {
  const [form, setForm] = useState({
    date: '',
    symptoms: '',
    mood: '',
    sleep_hours: '',
    pain_level: '',
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [editId, setEditId] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Mock data for demo
  const mockLogs = [
    {
      id: 1,
      date: '2024-06-15',
      symptoms: 'Mild headache, feeling tired',
      mood: 'Good',
      sleep_hours: 7,
      pain_level: 3
    },
    {
      id: 2,
      date: '2024-06-14',
      symptoms: 'Sore throat, runny nose',
      mood: 'Fair',
      sleep_hours: 6,
      pain_level: 2
    }
  ];

  useEffect(() => {
    // Simulate loading
    setFetching(true);
    setTimeout(() => {
      setLogs(mockLogs);
      setFetching(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e) => {
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

    // Simulate API call
    setTimeout(() => {
      if (editId) {
        // Update existing log
        setLogs(prev => prev.map(log => 
          log.id === editId 
            ? { ...form, id: editId, sleep_hours: sleep, pain_level: pain }
            : log
        ));
      } else {
        // Add new log
        const newLog = {
          ...form,
          id: Date.now(),
          sleep_hours: sleep,
          pain_level: pain,
        };
        setLogs(prev => [newLog, ...prev]);
      }

      setForm({ date: '', symptoms: '', mood: '', sleep_hours: '', pain_level: '' });
      setEditId(null);
      setShowForm(false);
      setLoading(false);
    }, 1500);
  };

  const handleEdit = (log) => {
    setForm({
      date: log.date,
      symptoms: log.symptoms,
      mood: log.mood,
      sleep_hours: log.sleep_hours.toString(),
      pain_level: log.pain_level.toString(),
    });
    setEditId(log.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this log?')) {
      setLogs(prev => prev.filter(log => log.id !== id));
    }
  };

  const getMoodIcon = (mood) => {
    switch (mood.toLowerCase()) {
      case 'excellent': case 'great': case 'good': return <Smile className="w-5 h-5 text-green-400" />;
      case 'fair': case 'okay': case 'neutral': return <Meh className="w-5 h-5 text-yellow-400" />;
      case 'poor': case 'bad': case 'terrible': return <Frown className="w-5 h-5 text-red-400" />;
      default: return <Heart className="w-5 h-5 text-purple-400" />;
    }
  };

  const getPainColor = (level) => {
    if (level <= 3) return 'text-green-400';
    if (level <= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSleepColor = (hours) => {
    if (hours >= 7 && hours <= 9) return 'text-green-400';
    if (hours >= 6 || hours <= 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-bounce"></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-500"></div>
        <div className="absolute top-3/4 right-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-12 animate-bounce delay-1500"></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white opacity-10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-none px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-6xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6 animate-pulse">
            <Activity className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Health Log Tracker
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Track your daily health metrics with our intelligent logging system. Monitor symptoms, mood, sleep, and pain levels to gain insights into your wellbeing.
          </p>

          <div className="flex justify-center items-center gap-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Progress Tracking</span>
            </div>
            <div className="flex items-center gap-2 text-teal-400">
              <Brain className="w-5 h-5" />
              <span className="text-sm">Smart Analytics</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Daily Monitoring</span>
            </div>
          </div>
        </div>

        {/* Add New Entry Button */}
        <div className="max-w-6xl mx-auto px-4 mb-8">
          {!showForm && (
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                <span>Add New Health Entry</span>
                <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
              </button>
            </div>
          )}
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="max-w-4xl mx-auto px-4 mb-12">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Calendar className="w-7 h-7 text-emerald-400" />
                  {editId ? 'Edit Health Entry' : 'New Health Entry'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditId(null);
                    setForm({ date: '', symptoms: '', mood: '', sleep_hours: '', pain_level: '' });
                  }}
                  className="text-slate-400 hover:text-white transition-colors duration-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Date Input */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      onFocus={() => setFocusedField('date')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-400/50 focus:bg-white/10 transition-all duration-300"
                      required
                    />
                    {focusedField === 'date' && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-20 -z-10"></div>
                    )}
                  </div>
                </div>

                {/* Symptoms Input */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Symptoms</label>
                  <div className="relative">
                    <textarea
                      placeholder="Describe any symptoms you're experiencing..."
                      value={form.symptoms}
                      onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                      onFocus={() => setFocusedField('symptoms')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full h-24 bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder-slate-400 resize-none focus:outline-none focus:border-emerald-400/50 focus:bg-white/10 transition-all duration-300"
                    />
                    {focusedField === 'symptoms' && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-20 -z-10"></div>
                    )}
                  </div>
                </div>

                {/* Mood Input */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Mood</label>
                  <div className="relative">
                    <select
                      value={form.mood}
                      onChange={(e) => setForm({ ...form, mood: e.target.value })}
                      onFocus={() => setFocusedField('mood')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-400/50 focus:bg-white/10 transition-all duration-300"
                    >
                      <option value="" className="bg-slate-800">Select your mood...</option>
                      <option value="Excellent" className="bg-slate-800">😄 Excellent</option>
                      <option value="Good" className="bg-slate-800">😊 Good</option>
                      <option value="Fair" className="bg-slate-800">😐 Fair</option>
                      <option value="Poor" className="bg-slate-800">😔 Poor</option>
                      <option value="Terrible" className="bg-slate-800">😢 Terrible</option>
                    </select>
                    {focusedField === 'mood' && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-20 -z-10"></div>
                    )}
                  </div>
                </div>

                {/* Sleep and Pain Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sleep Hours */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Sleep Hours (0-24)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        placeholder="7.5"
                        value={form.sleep_hours}
                        onChange={(e) => setForm({ ...form, sleep_hours: e.target.value })}
                        onFocus={() => setFocusedField('sleep')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400/50 focus:bg-white/10 transition-all duration-300"
                      />
                      <Moon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      {focusedField === 'sleep' && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-20 -z-10"></div>
                      )}
                    </div>
                  </div>

                  {/* Pain Level */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Pain Level (0-10)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        placeholder="0"
                        value={form.pain_level}
                        onChange={(e) => setForm({ ...form, pain_level: e.target.value })}
                        onFocus={() => setFocusedField('pain')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400/50 focus:bg-white/10 transition-all duration-300"
                      />
                      <AlertTriangle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      {focusedField === 'pain' && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-20 -z-10"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`group inline-flex items-center gap-3 ${
                      editId 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                    } text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-xl`}
                  >
                    {loading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                        <span>{editId ? 'Update Entry' : 'Save Entry'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Logs Section */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Heart className="w-8 h-8 text-emerald-400" />
              Your Health Journey
            </h2>
            <p className="text-slate-400">Track your progress over time</p>
          </div>

          {fetching ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 text-slate-400">
                <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                <span className="text-lg">Loading your health logs...</span>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16">
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-12 border border-white/10">
                <Activity className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">No health logs yet</h3>
                <p className="text-slate-500">Start tracking your health journey by adding your first entry!</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {logs.map((log, index) => (
                <div 
                  key={log.id} 
                  className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-emerald-400/30"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Date Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{log.date}</h3>
                          <p className="text-sm text-emerald-400">Health Entry #{logs.length - index}</p>
                        </div>
                      </div>

                      {/* Health Metrics Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {/* Symptoms */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-medium text-slate-300">Symptoms</span>
                          </div>
                          <p className="text-white text-sm">{log.symptoms || 'None reported'}</p>
                        </div>

                        {/* Mood */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            {getMoodIcon(log.mood)}
                            <span className="text-sm font-medium text-slate-300">Mood</span>
                          </div>
                          <p className="text-white text-sm">{log.mood}</p>
                        </div>

                        {/* Sleep */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Moon className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-slate-300">Sleep</span>
                          </div>
                          <p className={`font-semibold ${getSleepColor(log.sleep_hours)}`}>
                            {log.sleep_hours} hours
                          </p>
                        </div>

                        {/* Pain */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-sm font-medium text-slate-300">Pain Level</span>
                          </div>
                          <p className={`font-semibold ${getPainColor(log.pain_level)}`}>
                            {log.pain_level}/10
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(log)}
                        className="group p-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 hover:border-amber-400/50 rounded-xl transition-all duration-300 hover:scale-110"
                      >
                        <Edit3 className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
                      </button>
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="group p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-400/50 rounded-xl transition-all duration-300 hover:scale-110"
                      >
                        <Trash2 className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-1500 {
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  );
}