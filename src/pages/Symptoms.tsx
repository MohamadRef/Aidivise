export default function Symptoms() {
    return (
      <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">🧠 AI Symptom Checker</h1>
  
        <div className="max-w-3xl mx-auto text-gray-300 space-y-8">
          <p>
            Aidvise helps you analyze symptoms quickly using AI technology. Just enter what you're feeling and receive suggestions to guide your next steps.
          </p>
  
          <div>
            <h2 className="text-xl font-semibold text-teal-400 mb-2">✨ Key Features</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Smart symptom interpretation using OpenAI</li>
              <li>Quick suggestions based on symptom patterns</li>
              <li>Easy logging of symptom severity and duration</li>
            </ul>
          </div>
  
          <div>
            <h2 className="text-xl font-semibold text-teal-400 mb-2">📌 Use Cases</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Feeling unwell and unsure what it might be</li>
              <li>Wanting to track symptom changes over time</li>
              <li>Prepping notes before a doctor's visit</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  