import { useState } from 'react';

export default function Symptoms() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckSymptoms = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');

    // 🔁 Replace with real OpenAI/Supabase function
    setTimeout(() => {
      setResponse(`🤖 Based on your symptoms "${input}", you may want to monitor for signs of flu, dehydration, or stress. Please consult a professional for any health concerns.`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-teal-400">🧠 Symptom Checker</h1>
      <p className="text-gray-300 text-center max-w-xl mb-8">
        Enter one or more symptoms and get AI-powered suggestions.
        This is not a replacement for medical advice.
      </p>

      <textarea
        className="w-full max-w-xl p-4 rounded-md bg-gray-800 text-white placeholder-gray-400 mb-4 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        rows={4}
        placeholder="e.g. headache, nausea, fatigue..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleCheckSymptoms}
        disabled={loading}
        className={`px-6 py-3 rounded-md font-semibold ${
          loading ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'
        } transition`}
      >
        {loading ? 'Analyzing...' : 'Check Symptoms'}
      </button>

      {response && (
        <div className="mt-8 max-w-xl bg-gray-800 p-6 rounded-xl shadow-md text-gray-100">
          <h2 className="text-lg font-semibold mb-2">AI Suggestions</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
