import { useState, useEffect } from 'react';
import {
  Activity,
  Brain,
  Sparkles,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import PdfReport from '../components/PdfReport';

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

  // Generate and download PDF using react-pdf
  const handleDownloadPdf = async () => {
    if (!analysis) return;
    const blob = await pdf(
      <PdfReport
        symptoms={input}
        suggestion={analysis}
        patientName="Patient"
        reportId={undefined}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aidvise-health-report-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const symptomsList = [
    'headache', 'fever', 'cough', 'fatigue', 'nausea', 'dizziness',
    'sore throat', 'body aches', 'runny nose', 'chest pain', 'stomach pain', 'difficulty breathing'
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none"> ... rest of JSX unchanged ... </div>
    </div>
  );
}
