import Auth from './components/Auth';

export default function App() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 🔁 Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/Background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🌑 Optional: dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

      {/* 🧩 Login Form */}
      <div className="relative z-20 w-full px-4">
        <Auth />
      </div>
    </div>
  );
}
