"use client";
// app/page.tsx
import QRCode from 'react-qr-code';
import Link from 'next/link';
import { FaMusic, FaUserShield, FaArrowRight } from 'react-icons/fa';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-6 sm:p-10 bg-gray-900 text-white relative overflow-hidden font-sans">
      {/* Floating Music Notes Animation */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <svg className="absolute left-10 top-10 animate-float-slow opacity-30" width="48" height="48" fill="none" viewBox="0 0 48 48"><path d="M24 4v32a8 8 0 1 0 4-6.93V12h12V4H24Z" fill="#a78bfa"/></svg>
        <svg className="absolute right-16 top-32 animate-float-medium opacity-20" width="36" height="36" fill="none" viewBox="0 0 36 36"><path d="M18 3v24a6 6 0 1 0 3-5.2V9h9V3H18Z" fill="#f472b6"/></svg>
        <svg className="absolute left-1/2 bottom-10 animate-float-fast opacity-25" width="32" height="32" fill="none" viewBox="0 0 32 32"><path d="M16 2v20a5 5 0 1 0 2.5-4.33V7h7V2H16Z" fill="#facc15"/></svg>
      </div>
      <div className="z-10 w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-2 tracking-tight drop-shadow-lg font-sans">
          <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
           <FaMusic className="inline-block text-pink-400 drop-shadow-md" size={48} /> 
            Jam with AiiSi
            <FaMusic className="inline-block text-pink-400 drop-shadow-md" size={48} />
          </span>
        </h1>
        <p className="text-lg sm:text-xl mb-4 opacity-90 font-medium">Unleash your inner superstar! Join the fun, submit your song, and sing your heart out.</p>
        <div className="flex flex-col sm:flex-row items-center gap-8 mt-6 w-full justify-center">
          <div className="flex flex-col items-center">
            <span className="text-purple-300 font-semibold mb-2 text-base">Scan to Submit Your Song</span>
            <div className="bg-white p-5 rounded-2xl shadow-2xl animate-pulse-slow border-4 border-purple-400/30 hidden-mobile" style={{ boxShadow: '0 0 32px 8px #a78bfa55' }}>
              <QRCode value="/submit" size={400} bgColor="#fff" fgColor="#7c3aed" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 mt-8 sm:mt-0">
            <Link href="/maindisplay" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-lg shadow-lg transition-all duration-200">
              <FaMusic className="text-purple-700" />
              Main Display
            </Link>
            <Link href="/submit" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold text-lg shadow-lg transition-all duration-200">
              <FaArrowRight className="text-yellow-300" />
              Submit a Song
            </Link>
            <Link href="/queue" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg shadow-lg transition-all duration-200">
              <FaArrowRight className="text-yellow-300" />
              View Live Queue
            </Link>
            <Link href="/admin" className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-purple-200 font-medium text-base shadow-md transition-all duration-200">
              <FaUserShield className="text-pink-400" />
              Admin Login
            </Link>
          </div>
        </div>
      </div>
      <footer className="z-10 mt-16 text-sm text-gray-400 opacity-80 w-full text-center">
        <div>Karaoke Jam &copy; {new Date().getFullYear()} &mdash; Powered by Navigating Kenya</div>
        <div className="mt-1">Event by <span className="text-pink-300 font-semibold">CHEMICHEMI AND NICOLE AIISI</span></div>
      </footer>
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { box-shadow: 0 0 32px 8px #a78bfa55; }
          50% { box-shadow: 0 0 48px 16px #c4b5fd88; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s infinite;
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-24px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        .animate-float-medium {
          animation: float-medium 4.5s ease-in-out infinite;
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-fast {
          animation: float-fast 3.2s ease-in-out infinite;
        }
        html { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; }
      `}</style>
    </main>
  );
}
