import { useState, useEffect } from 'react';
import {
  Activity,
  Brain,
  Download,
  Sparkles,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

// OpenAI API call for symptom analysis
const analyzeSymptoms = async (symptoms: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Did you add VITE_OPENAI_API_KEY to .env.local?');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a knowledgeable medical AI assistant. Analyze the symptoms provided and give helpful health insights. Structure your response as follows:

🔍 **SYMPTOM ANALYSIS**
- Brief overview of the symptoms presented

🏥 **POSSIBLE CONDITIONS**
- List potential conditions (from mild to more serious)
- Include likelihood indicators when appropriate

💡 **RECOMMENDATIONS**
- Immediate care suggestions
- Lifestyle modifications
- Home remedies that might help

⚠️ **WHEN TO SEEK MEDICAL ATTENTION**
- Red flag symptoms to watch for
- Timeline for seeking care

📋 **NEXT STEPS**
- Follow-up recommendations
- Monitoring suggestions

IMPORTANT: Always emphasize that this analysis is for educational purposes only and should not replace professional medical advice. Encourage consultation with healthcare providers for proper diagnosis and treatment.`
        },
        { role: 'user', content: `Please analyze these symptoms: ${symptoms}` }
      ],
      max_tokens: 1000,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export default function Symptoms() {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusState, setFocusState] = useState(false);
  const [typingEffect, setTypingEffect] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [error, setError] = useState('');

  // Typing effect for display
  useEffect(() => {
    if (analysis && showResults) {
      setTypingEffect('');
      let i = 0;
      const timer = setInterval(() => {
        if (i < analysis.length) {
          setTypingEffect(analysis.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [analysis, showResults]);

  // Main symptom checking
  const handleCheckSymptoms = async () => {
    if (!input.trim()) {
      setError('Please describe your symptoms first.');
      return;
    }
    if (input.trim().length < 10) {
      setError('Please provide more detailed symptom description for better analysis.');
      return;
    }

    setLoading(true);
    setError('');
    setShowResults(false);
    setPulseAnimation(true);

    try {
      const result = await analyzeSymptoms(input.trim());
      setAnalysis(result);
      setShowResults(true);
    } catch (e: any) {
      console.error(e);
      if (e.message.includes('API key')) setError('API configuration error. Please check your OpenAI API key in .env.local.');
      else if (e.message.includes('429')) setError('Rate limit exceeded. Please try again later.');
      else if (e.message.includes('401')) setError('Invalid API key. Please check your OpenAI API key.');
      else if (e.message.includes('insufficient_quota')) setError('OpenAI API quota exceeded. Please check your billing.');
      else setError('Unable to analyze symptoms at this time. Please try again later.');
    } finally {
      setLoading(false);
      setPulseAnimation(false);
    }
  };

  // Generate & download PDF via React-PDF
  const handleDownloadPdf = async () => {
    if (!analysis) return;
    
    const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>AI Health Assessment Report</title>
      <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { border-bottom: 2px solid #ccc; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin-bottom: 30px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .warning { background-color: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; }
      </style>
  </head>
  <body>
      <div class="header">
          <h1>AI Health Assessment</h1>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
      </div>
      <div class="section">
          <h2>Reported Symptoms</h2>
          <p>${input}</p>
      </div>
      <div class="section">
          <h2>AI Analysis</h2>
          <pre style="white-space: pre-wrap; font-family: inherit;">${analysis.replace(/[^\x00-\x7F]/g, "")}</pre>
      </div>
      <div class="warning">
          <h3>Important Medical Disclaimer</h3>
          <p>This AI-generated assessment is for informational purposes only and should not be considered as professional medical advice, diagnosis, or treatment.</p>
      </div>
  </body>
  </html>`;
  
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aidvise-health-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const symptomsList = [
    'headache', 'fever', 'cough', 'fatigue', 'nausea', 'dizziness',
    'sore throat', 'body aches', 'runny nose', 'chest pain',
    'stomach pain', 'difficulty breathing'
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
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
          />
        ))}
      </div>

      <div className="relative z-10 px-6 py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-6 animate-pulse">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            AI Health Assistant
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience next-generation symptom analysis powered by OpenAI's advanced artificial intelligence. Get instant, personalized health insights from our intelligent diagnostic assistant.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-green-400"><CheckCircle className="w-5 h-5" /> OpenAI Powered</div>
            <div className="flex items-center gap-2 text-blue-400"><Brain className="w-5 h-5" /> Instant Analysis</div>
            <div className="flex items-center gap-2 text-purple-400"><Sparkles className="w-5 h-5" /> Secure & Private</div>
          </div>
        </div>

        {/* Input Card */}
        <div
          className={`max-w-6xl mx-auto px-4 mb-12 backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl transition-transform duration-500 ${focusState ? 'scale-105 border-cyan-400/50 shadow-cyan-500/25' : ''} ${pulseAnimation ? 'animate-pulse' : ''}`}
        >
          {/* Quick Symptom Tags */}
          <div className="mb-6">
            <p className="text-sm text-slate-400 mb-3">Quick select common symptoms:</p>
            <div className="flex flex-wrap gap-2">
              {symptomsList.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput((prev) => (prev ? `${prev}, ${s}` : s))}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-cyan-400/50 rounded-full text-sm text-slate-300 hover:text-white transition-all duration-300"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="relative mb-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setFocusState(true)}
              onBlur={() => setFocusState(false)}
              placeholder="Describe your symptoms in detail… (e.g., 'I have had a persistent headache for 2 days, feeling very tired, mild fever of 100.5°F, and some nausea')"
              className="w-full h-40 bg-white/5 border border-white/20 rounded-2xl p-6 text-white placeholder-slate-400 resize-none focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all duration-300 text-lg leading-relaxed"
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-500">{input.length}/500</div>
            {focusState && (<div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 -z-10" />)}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <div className="text-center">
            <button
              onClick={handleCheckSymptoms}
              disabled={loading || !input.trim()}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-xl"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Brain className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              )}
              <span>{loading ? 'Analyzing with OpenAI…' : 'Analyze Symptoms'}</span>
              {!loading && (<Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />)}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10" />
            </button>
          </div>
        </div>

        {/* Results */}
        {showResults && analysis && (
          <div className="max-w-6xl mx-auto px-4 mt-8 opacity-0 animate-fade-in">
            <div className="backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700/50">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">OpenAI Health Analysis</h2>
                  <p className="text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4" /> Generated just now</p>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-lg">
                  {typingEffect}
                  {typingEffect.length < analysis.length && (<span className="inline-block w-2 h-6 bg-cyan-400 ml-1 animate-pulse" />)}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-700/50 flex gap-4">
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Download className="w-5 h-5" /> Download PDF Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="text-center mt-16 max-w-6xl mx-auto px-4">
          <div className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex justify-center items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Medical Disclaimer</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              This AI health assistant provides educational information only and should not replace professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0) rotate(0); }
          50%    { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fade-in {
          from { opacity:0; transform: translateY(40px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}