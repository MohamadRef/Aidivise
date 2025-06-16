import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PdfReport } from '../components/PdfReport';

export default function Symptoms() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckSymptoms = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/symptom-checker`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ symptoms: input }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setResponse(data.result);
      } else {
        setResponse(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setResponse('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4 text-teal-400">🩺 Symptom Checker</h1>
      <p className="text-gray-300 text-center max-w-xl mb-6">
        Enter one or more symptoms and get AI-powered suggestions. Your responses are securely logged for future review.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. headache, sore throat, fever"
        className="w-full max-w-xl h-32 p-4 text-black rounded-md mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
      />

      <button
        onClick={handleCheckSymptoms}
        disabled={loading}
        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded transition disabled:opacity-50 flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"
              />
            </svg>
            Checking...
          </>
        ) : (
          'Check Symptoms'
        )}
      </button>

      {response && (
        <div className="mt-8 max-w-xl bg-gray-800 p-6 rounded-md border border-teal-500 shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-teal-300">🤖 AI Suggestion:</h2>
          <p className="text-gray-100 whitespace-pre-wrap mb-4">{response}</p>

          <PDFDownloadLink
            document={<PdfReport symptoms={input} suggestion={response} />}
            fileName="symptom-report.pdf"
          >
            {({ loading }) =>
              loading ? (
                <span className="text-sm text-gray-400">Preparing PDF...</span>
              ) : (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  📄 Download PDF Report
                </button>
              )
            }
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
}
