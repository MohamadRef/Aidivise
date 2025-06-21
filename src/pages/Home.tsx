import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Heart,
  Brain,
  Calendar,
  Apple,
  Users,
  Star,
  Play,
  Pause,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSymptom, setActiveSymptom] = useState<number | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // how much the mouse movement is dampened (10% of real movement)
  const DAMPING = 0.1;

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI Symptom Checker',
      desc: 'Enter your symptoms and get instant AI-powered suggestions with machine learning insights.',
      color: 'from-teal-400 to-cyan-600',
      path: '/symptoms',
      demo: 'Interactive symptom analysis'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Health Log Tracker',
      desc: 'Track your symptoms, mood, sleep, and pain levels with beautiful visualizations.',
      color: 'from-blue-400 to-indigo-600',
      path: '/log',
      demo: 'Real-time health monitoring'
    },
    {
      icon: <Apple className="w-8 h-8" />,
      title: 'Nutrition & Hydration',
      desc: 'Log meals and water intake with smart recommendations and progress tracking.',
      color: 'from-green-400 to-emerald-600',
      path: '/nutrition',
      demo: 'Smart nutrition insights'
    }
  ];

  const symptoms = [
    { name: 'Headache', intensity: 'high', category: 'neurological' },
    { name: 'Fever', intensity: 'high', category: 'infectious' },
    { name: 'Fatigue', intensity: 'medium', category: 'general' },
    { name: 'Abdominal Pain', intensity: 'high', category: 'gastrointestinal' },
    { name: 'Back Pain', intensity: 'medium', category: 'musculoskeletal' },
    { name: 'Skin Rash', intensity: 'low', category: 'dermatological' },
    { name: 'Cough', intensity: 'medium', category: 'respiratory' },
    { name: 'Cold & Flu', intensity: 'medium', category: 'infectious' },
    { name: 'UTI', intensity: 'high', category: 'urological' },
    { name: 'Dizziness', intensity: 'medium', category: 'neurological' },
    { name: 'Anxiety', intensity: 'high', category: 'mental' },
    { name: 'Depression', intensity: 'high', category: 'mental' },
    { name: 'Insomnia', intensity: 'medium', category: 'sleep' },
    { name: 'Thyroid', intensity: 'high', category: 'endocrine' },
    { name: 'Joint Pain', intensity: 'medium', category: 'musculoskeletal' },
    { name: 'Chest Tightness', intensity: 'high', category: 'cardiac' },
    { name: 'Digestive Issues', intensity: 'medium', category: 'gastrointestinal' }
  ];

  const testimonials = [
    {
      name: 'Layla M.',
      quote: 'Aidvise helped me connect the dots between my stress levels and physical symptoms. I feel in control.',
      avatar: 'https://i.pravatar.cc/100?img=10',
      rating: 5,
      condition: 'Stress Management'
    },
    {
      name: 'Natali Y.',
      quote: 'As someone with chronic migraines, the PDF reports were a game changer. My neurologist loves them.',
      avatar: 'https://i.pravatar.cc/100?img=20',
      rating: 5,
      condition: 'Chronic Migraines'
    },
    {
      name: 'Nora A.',
      quote: "The nutrition tracking opened my eyes. I didn't realize how unbalanced my meals were until now.",
      avatar: 'https://i.pravatar.cc/100?img=30',
      rating: 5,
      condition: 'Nutrition Goals'
    },
    {
      name: 'Elias J.',
      quote: 'Using Aidvise daily became part of my routine. Everything I need to track is in one simple dashboard.',
      avatar: 'https://i.pravatar.cc/100?img=40',
      rating: 5,
      condition: 'Daily Wellness'
    },
    {
      name: 'Emad D.',
      quote: 'I live abroad without regular healthcare. Aidvise gave me confidence until I could see a doctor.',
      avatar: 'https://i.pravatar.cc/100?img=50',
      rating: 5,
      condition: 'Remote Healthcare'
    },
    {
      name: 'Tariq Y.',
      quote: 'Aidvise helped me discover that my fatigue was hydration-related. Small changes, big difference.',
      avatar: 'https://i.pravatar.cc/100?img=60',
      rating: 5,
      condition: 'Fatigue Analysis'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Users', icon: <Users className="w-6 h-6" /> },
    { number: '1M+', label: 'Symptoms Tracked', icon: <Heart className="w-6 h-6" /> },
    { number: '98%', label: 'User Satisfaction', icon: <Star className="w-6 h-6" /> },
    { number: '24/7', label: 'AI Support', icon: <Brain className="w-6 h-6" /> }
  ];

  // Parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Rotate features
  useEffect(() => {
    if (!isPlaying) return;
    const iv = setInterval(() => {
      setCurrentFeature(p => (p + 1) % features.length);
    }, 4000);
    return () => clearInterval(iv);
  }, [isPlaying]);

  // Rotate testimonials
  useEffect(() => {
    const iv = setInterval(() => {
      setTestimonialIndex(p => (p + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const getSymptomColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'bg-red-500 hover:bg-red-400';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-400';
      case 'low': return 'bg-green-500 hover:bg-green-400';
      default: return 'bg-gray-500 hover:bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Slow-moving particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse transition-transform duration-1000 ease-out"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: '8s',
              transform: `translate(
                ${mousePosition.x * DAMPING}px,
                ${mousePosition.y * DAMPING}px
              )`,
            }}
          />
        ))}
      </div>

      {/* Hero */}
      <section ref={heroRef} className="relative flex items-center justify-center min-h-screen px-6 py-20">
        <div className="max-w-7xl mx-auto text-center relative z-10">

          <h1 className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse">
            🩺 Aidvise
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Your AI-powered health companion that tracks symptoms, analyzes patterns, and empowers you with insights
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((s, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition cursor-pointer"
                style={{ transform: `translateY(${Math.sin(Date.now() / 1000 + i) * 5}px)` }}
              >
                <div className="flex justify-center mb-2 text-cyan-400 group-hover:scale-125 transition">
                  {s.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1">{s.number}</div>
                <div className="text-gray-300 text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Feature Showcase */}
          <div className="relative max-w-5xl mx-auto">
            <div className="flex justify-center mb-8 space-x-2 bg-white/5 backdrop-blur-md rounded-full p-2">
              {features.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentFeature(i);
                  }}
                  className={`w-3 h-3 rounded-full transition ${
                    i === currentFeature ? 'bg-cyan-400 scale-125' : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
              <button
                onClick={() => setIsPlaying(p => !p)}
                className="ml-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>

            <div className="relative h-80 perspective-1000">
              {features.map((feat, i) => (
                <div
                  key={i}
                  onClick={() => navigate(feat.path)}
                  className={[
                    'absolute inset-0 transition-all duration-1000',
                    i === currentFeature
                      ? 'opacity-100 translate-y-0 rotate-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-20 rotate-12 pointer-events-none'
                  ].join(' ')}
                >
                  <div
                    className={`h-full p-8 rounded-3xl shadow-2xl overflow-hidden group cursor-pointer bg-gradient-to-br ${feat.color}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                      <div className="mb-4 text-white group-hover:scale-110 transition">{feat.icon}</div>
                      <h3 className="text-3xl font-bold text-white mb-4">{feat.title}</h3>
                      <p className="text-white/90 mb-6 max-w-md">{feat.desc}</p>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          navigate(feat.path);
                        }}
                        className="text-white/80 text-sm font-medium bg-white/10 rounded-full px-4 py-2 transition hover:bg-white/20"
                      >
                        {feat.demo}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16">
              <ChevronDown className="w-8 h-8 mx-auto animate-bounce text-cyan-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Symptoms Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Track <span className="text-cyan-400">Any Symptom</span>
          </h2>
          <p className="text-gray-300 mb-12 max-w-2xl mx-auto">
            Click on symptoms to see detailed tracking options
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {symptoms.map((symptom, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveSymptom(activeSymptom === i ? null : i);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition transform hover:scale-105 ${
                  activeSymptom === i
                    ? `${getSymptomColor(symptom.intensity)} text-white scale-105 shadow-lg`
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {symptom.name}
              </button>
            ))}
          </div>

          {activeSymptom !== null && (
            <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-in slide-in-from-bottom duration-500">
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                {symptoms[activeSymptom].name}
              </h3>
              <p className="text-gray-300 mb-4">
                Category:{' '}
                <span className="text-white capitalize">
                  {symptoms[activeSymptom].category}
                </span>
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Severity:</span>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getSymptomColor(
                    symptoms[activeSymptom].intensity
                  )} text-white`}
                >
                  {symptoms[activeSymptom].intensity.toUpperCase()}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-cyan-400">Real Stories</span> from Real Users
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-3xl">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`transition-all duration-1000 ${
                  i === testimonialIndex
                    ? 'opacity-100 translate-x-0'
                    : i < testimonialIndex
                    ? 'opacity-0 -translate-x-full absolute inset-0'
                    : 'opacity-0 translate-x-full absolute inset-0'
                }`}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-20 h-20 rounded-full border-4 border-cyan-400/50"
                    />
                    <div className="text-center md:text-left">
                      <div className="flex justify-center md:justify-start mb-4">
                        {[...Array(t.rating)].map((_, si) => (
                          <Star key={si} className="w-5 h-5 text-yellow-400" />
                        ))}
                      </div>
                      <blockquote className="italic text-gray-100 mb-4">
                        "{t.quote}"
                      </blockquote>
                      <div className="text-cyan-400 font-semibold text-lg">{t.name}</div>
                      <div className="text-gray-400 text-sm">{t.condition}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`w-3 h-3 rounded-full transition ${
                  i === testimonialIndex ? 'bg-cyan-400 scale-125' : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Advisory */}
      <section className="py-8 px-6 text-center">
        <Heart className="mx-auto w-6 h-6 text-red-400 mb-2" />
        <p className="text-sm text-red-400 max-w-md mx-auto">
          ⚠️ Aidvise is not a substitute for professional medical advice. Always consult a licensed healthcare provider.
        </p>
      </section>
    </div>
  );
}
