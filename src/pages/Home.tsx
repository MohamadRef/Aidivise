import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const navigate = useNavigate();

  const symptoms = [
    'Headache', 'Fever', 'Fatigue', 'Abdominal Pain', 'Back Pain',
    'Skin Rash', 'Cough', 'Cold & Flu', 'UTI', 'Dizziness',
    'Anxiety', 'Depression', 'Insomnia', 'Thyroid',
    'Joint Pain', 'Chest Tightness', 'Digestive Issues',
  ];

  const testimonials = [
    { name: 'Layla M.', quote: 'Aidvise helped me connect the dots between my stress levels and physical symptoms. I feel in control.', avatar: 'https://i.pravatar.cc/100?img=10' },
    { name: 'Natali Y.', quote: 'As someone with chronic migraines, the PDF reports were a game changer. My neurologist loves them.', avatar: 'https://i.pravatar.cc/100?img=20' },
    { name: 'Nora A.', quote: 'The nutrition tracking opened my eyes. I didn’t realize how unbalanced my meals were until now.', avatar: 'https://i.pravatar.cc/100?img=30' },
    { name: 'Elias J.', quote: 'Using Aidvise daily became part of my routine. Everything I need to track is in one simple dashboard.', avatar: 'https://i.pravatar.cc/100?img=40' },
    { name: 'Emad D.', quote: 'I live abroad without regular healthcare. Aidvise gave me confidence until I could see a doctor.', avatar: 'https://i.pravatar.cc/100?img=50' },
    { name: 'Tariq Y.', quote: 'Aidvise helped me discover that my fatigue was hydration-related. Small changes, big difference.', avatar: 'https://i.pravatar.cc/100?img=60' },
    { name: 'Amina H.', quote: 'I log my anxiety symptoms every morning. Seeing my trends helped reduce panic attacks significantly.', avatar: 'https://i.pravatar.cc/100?img=70' },
    { name: 'Zayd F.', quote: 'It’s like having a mini health assistant! Clean design, smart insights, and super easy to use.', avatar: 'https://i.pravatar.cc/100?img=80' },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused && scrollRef.current) {
        scrollRef.current.scrollLeft += 1;
      }
    }, 20);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center px-6 py-12">
      <motion.div
        className="w-full max-w-6xl text-center"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <motion.h1 className="text-4xl md:text-5xl font-extrabold mb-8">
          🩺 Welcome to <span className="text-teal-400">Aidvise</span>
        </motion.h1>

        <motion.p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed">
          Track your health, analyze symptoms with AI, monitor nutrition & hydration, and share reports with your doctor.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {[
            {
              title: '🧠 AI Symptom Checker',
              desc: 'Enter your symptoms and get instant AI-powered suggestions.',
              color: 'text-teal-300',
              hover: 'hover:bg-teal-600',
              path: '/symptoms',
            },
            {
              title: '📅 Health Log Tracker',
              desc: 'Track your symptoms, mood, sleep, and pain levels daily.',
              color: 'text-blue-300',
              hover: 'hover:bg-blue-600',
              path: '/log',
            },
            {
              title: '🥦 Nutrition & 💧 Hydration',
              desc: 'Log your meals and water intake for complete wellness tracking.',
              color: 'text-yellow-300',
              hover: 'hover:bg-yellow-600',
              path: '/nutrition',
            },
          ].map((f, i) => (
            <motion.button
              key={i}
              onClick={() => navigate(f.path)}
              className={`bg-gray-800 p-6 rounded-xl shadow-md ${f.hover} transition-all duration-300 text-left`}
              whileHover={{ scale: 1.03 }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={i}
            >
              <h2 className={`text-2xl font-semibold mb-2 ${f.color}`}>{f.title}</h2>
              <p className="text-gray-300">{f.desc}</p>
            </motion.button>
          ))}
        </div>

        <motion.p
          className="text-sm text-red-400 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.5 } }}
        >
          ⚠️ Aidvise is not a substitute for professional medical advice. Always consult a licensed healthcare provider.
        </motion.p>
      </motion.div>

      {/* How to Use */}
      <div className="mt-24 text-left w-full max-w-6xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">How to Use Aidvise</h2>
        <div className="grid md:grid-cols-3 gap-8 text-gray-200">
          {[
            {
              title: '1️⃣ Input Your Symptoms',
              desc: 'Start by entering one or multiple symptoms into the AI Symptom Checker. Aidvise understands a wide variety of health indicators.',
            },
            {
              title: '2️⃣ Answer Questions',
              desc: 'Follow-up prompts help refine results. The AI will ask context-specific questions for better accuracy.',
            },
            {
              title: '3️⃣ Get Insights',
              desc: 'Instantly receive AI-generated feedback: possible causes, health suggestions, and what to monitor next.',
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <h3 className="text-xl font-semibold text-teal-400 mb-2">{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Who It's For */}
      <div className="mt-24 text-left w-full max-w-6xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Who It's For</h2>
        <div className="grid md:grid-cols-4 gap-8 text-gray-200">
          {[
            { label: '👨 Adults', text: 'Tailored for adults looking to better understand ongoing or sudden symptoms and trends.' },
            { label: '👩 Women', text: 'Insightful support for tracking women’s health — from cycles to hormone-driven symptoms.' },
            { label: '👨‍👩‍👧 Parents', text: 'Worried about your child’s symptoms? Use the tool to assess common childhood conditions.' },
            { label: '👱 Men', text: 'Supports symptom tracking and guidance tailored to common men’s health concerns.' },
          ].map((group, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2 text-pink-400">{group.label}</h3>
              <p>{group.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="mt-24 text-left w-full max-w-6xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Common Symptoms You Can Track</h2>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-white">
          {symptoms.map((symptom) => (
            <span
              key={symptom}
              className="bg-gray-700 px-3 py-1 rounded-full hover:bg-teal-500 hover:text-black transition"
            >
              {symptom}
            </span>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-32 w-full px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">💬 What Users Are Saying</h2>
        <p className="text-center text-gray-400 mb-8 max-w-3xl mx-auto">
          Aidvise is changing lives by helping people understand, track, and improve their health with confidence.
        </p>

        <div
          ref={scrollRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex overflow-x-auto space-x-6 scrollbar-hide"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="min-w-[320px] max-w-[320px] bg-gray-800 text-white p-6 rounded-xl shadow-md flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <p className="text-teal-400 text-xl mb-4">“</p>
              <p className="text-gray-100 mb-6 leading-relaxed">{t.quote}</p>
              <div className="flex items-center gap-3 mt-auto">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                <span className="font-semibold">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
