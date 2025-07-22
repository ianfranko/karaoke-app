// app/maindisplay/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import { removeQueueItem } from '@/lib/firebase';
import { useQueue } from './useQueue';
import NowPlayingCard from './NowPlayingCard';
import QueueList from './QueueList';

interface QueueItem {
  key: string;
  name: string;
  youtubeLink: string;
  status: string;
  timestamp?: number;
}

function getYouTubeId(url: string): string | null {
  const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default function MainDisplayPage() {
  const { queue, removeFirst, isAdmin } = useQueue();
  const nowPlaying = queue[0];
  const upNext = queue.slice(1);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-700 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700 opacity-20 rounded-full blur-3xl animate-pulse" />
      </div>
      <header className="w-full text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg flex items-center justify-center gap-4">
          <span role="img" aria-label="music" className="animate-bounce text-6xl"></span>
          <span className="bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-500 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-move drop-shadow-[0_0_20px_rgba(236,72,153,0.7)]">
            Jam With Aiisi
          </span>
        </h1>
        <p className="text-lg text-purple-200 mt-2 font-medium tracking-wide">Sing your heart out!</p>
      </header>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <section className="flex flex-col items-center w-full md:col-span-2">
          <NowPlayingCard nowPlaying={nowPlaying} isAdmin={isAdmin} onNext={removeFirst} />
        </section>
        <aside className="flex flex-col items-center w-full md:col-span-1">
          <QueueList queue={upNext} />
        </aside>
      </div>
      <footer className="mt-10 text-center text-gray-400 text-sm opacity-80">
        Powered by Navigating Kenya &bull; Enjoy the show!
      </footer>
    </main>
  );
}
