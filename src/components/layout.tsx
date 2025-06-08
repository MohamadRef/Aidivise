import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔝 Header */}
      <header className="w-full px-6 py-4 bg-black/60 text-white backdrop-blur-md shadow-md z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide">Aidvise</h1>
          <nav className="space-x-4 text-sm">
            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Contact</a>
          </nav>
        </div>
      </header>

      {/* 📦 Main content */}
      <main className="flex-1 flex items-center justify-center relative z-20 px-4">
        {children}
      </main>

      {/* 🔚 Footer */}
      <footer className="w-full px-6 py-4 text-sm text-center text-white bg-black/60 backdrop-blur-md z-50">
        © {new Date().getFullYear()} Aidvise All rights reserved.
      </footer>
    </div>
  );
}
