import { useState, useEffect } from 'react';
import { Activity, Brain, Download, Sparkles, Stethoscope, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';

export default function Symptoms() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusState, setFocusState] = useState(false);
  const [typingEffect, setTypingEffect] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  // Typing effect for response
  useEffect(() => {
    if (response && showResults) {
      setTypingEffect('');
      let i = 0;
      const timer = setInterval(() => {
        if (i < response.length) {
          setTypingEffect(response.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [response, showResults]);

  const handleCheckSymptoms = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResponse('');
    setShowResults(false);
    setPulseAnimation(true);
    
    // Simulate API call for demo
    setTimeout(() => {
      const mockResponse = `Based on your symptoms "${input}", here are some initial observations:

🔍 **Preliminary Assessment:**
Your symptoms suggest a possible viral infection or seasonal illness. The combination of symptoms you've described is commonly associated with:

• Upper respiratory tract infection
• Possible flu-like illness
• Stress-related symptoms

⚠️ **Recommendations:**
1. Rest and stay hydrated
2. Monitor your temperature
3. Consider over-the-counter symptom relief
4. Consult a healthcare provider if symptoms worsen

📋 **When to seek immediate care:**
- High fever (>101.3°F)
- Difficulty breathing
- Persistent chest pain
- Severe dehydration

*This is AI-generated guidance and should not replace professional medical advice.*`;
      
      setResponse(mockResponse);
      setLoading(false);
      setShowResults(true);
      setPulseAnimation(false);
    }, 2000);
  };

  const symptoms = ['headache', 'fever', 'cough', 'fatigue', 'nausea', 'dizziness'];

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
        {[...Array(30)].map((_, i) => (
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mb-6 animate-pulse">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            AI Health Assistant
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience next-generation symptom analysis powered by artificial intelligence. 
            Get instant, personalized health insights with our advanced diagnostic assistant.
          </p>
          
          <div className="flex justify-center items-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Brain className="w-5 h-5" />
              <span className="text-sm">Instant Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm">Secure & Private</span>
            </div>
          </div>
        </div>

        {/* Main Input Section */}
        <div className="max-w-6xl mx-auto px-4">
          <div className={`backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl transition-all duration-500 ${focusState ? 'scale-105 border-cyan-400/50 shadow-cyan-500/25' : ''} ${pulseAnimation ? 'animate-pulse' : ''}`}>
            
            {/* Quick Symptom Tags */}
            <div className="mb-6">
              <p className="text-sm text-slate-400 mb-3">Quick select common symptoms:</p>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => setInput(prev => prev ? `${prev}, ${symptom}` : symptom)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-cyan-400/50 rounded-full text-sm text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Textarea */}
            <div className="relative mb-6">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setFocusState(true)}
                onBlur={() => setFocusState(false)}
                placeholder="Describe your symptoms in detail... (e.g., persistent headache for 2 days, mild fever, feeling tired)"
                className="w-full h-40 bg-white/5 border border-white/20 rounded-2xl p-6 text-white placeholder-slate-400 resize-none focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all duration-300 text-lg leading-relaxed"
              />
              
              {/* Character Counter */}
              <div className="absolute bottom-4 right-4 text-xs text-slate-500">
                {input.length}/500
              </div>
              
              {/* Focus Glow Effect */}
              {focusState && (
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-20 -z-10"></div>
              )}
            </div>

            {/* Analyze Button */}
            <div className="text-center">
              <button
                onClick={handleCheckSymptoms}
                disabled={loading || !input.trim()}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/25"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing Symptoms...</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <Brain className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Analyze Symptoms</span>
                    <Zap className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </>
                )}
                
                {/* Button Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
              </button>
            </div>
          </div>

          {/* Results Section */}
          {showResults && response && (
            <div className="mt-12 max-w-6xl mx-auto px-4 opacity-0 animate-fade-in">
              <div className="backdrop-blur-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
                
                {/* Results Header */}
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700/50">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">AI Health Analysis</h2>
                    <p className="text-slate-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Generated just now
                    </p>
                  </div>
                </div>

                {/* Typing Effect Content */}
                <div className="prose prose-invert max-w-none">
                  <div className="text-slate-200 whitespace-pre-wrap leading-relaxed text-lg">
                    {typingEffect}
                    {typingEffect.length < response.length && (
                      <span className="inline-block w-2 h-6 bg-cyan-400 ml-1 animate-pulse"></span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-slate-700/50">
                  <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <Download className="w-5 h-5" />
                    Download PDF Report
                  </button>
                  
                  <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-cyan-400/50 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105">
                    <AlertCircle className="w-5 h-5" />
                    Find Nearby Doctors
                  </button>
                  
                  <button 
                    onClick={() => {
                      setInput('');
                      setResponse('');
                      setShowResults(false);
                      setTypingEffect('');
                    }}
                    className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5" />
                    New Analysis
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="text-center mt-16 max-w-4xl mx-auto px-4">
          <div className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Medical Disclaimer</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              This AI health assistant provides educational information only and should not replace professional medical advice, diagnosis, or treatment. 
              Always consult with qualified healthcare providers for medical concerns.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .delay-75 {
          animation-delay: 0.075s;
        }
        
        .delay-150 {
          animation-delay: 0.15s;
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