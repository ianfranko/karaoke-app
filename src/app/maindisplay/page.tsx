// app/maindisplay/page.tsx
'use client';
import { useQueue } from './useQueue';
import NowPlayingCard from './NowPlayingCard';
import QueueList from './QueueList';

export default function MainDisplayPage() {
  const { queue, removeFirst } = useQueue();
  const nowPlaying = queue[0];
  const upNext = queue.slice(1);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 flex flex-col items-center justify-between p-0 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="hidden sm:block absolute top-0 left-0 w-96 h-96 bg-purple-700 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="hidden sm:block absolute bottom-0 right-0 w-96 h-96 bg-blue-700 opacity-20 rounded-full blur-3xl animate-pulse" />
      </div>
      <header className="w-full text-center py-2 sm:py-4 flex-shrink-0">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-lg flex items-center justify-center gap-2 sm:gap-4">
          <span role="img" aria-label="music" className="animate-bounce text-3xl sm:text-5xl"></span>
          <span className="bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-500 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-move drop-shadow-[0_0_20px_rgba(236,72,153,0.7)]">
            Jam With Aiisi
          </span>
        </h1>
        <p className="text-sm sm:text-base text-purple-200 mt-1 font-medium tracking-wide">Sing your heart out!</p>
      </header>
      <div className="flex-1 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-6 items-stretch min-h-0 px-1 sm:px-2 md:px-0">
        <section className="flex flex-col items-center w-full md:col-span-2 min-h-0">
          <div className="flex-1 w-full min-h-0 overflow-auto flex flex-col items-center justify-center p-1 sm:p-0">
            <NowPlayingCard nowPlaying={nowPlaying} onNext={removeFirst} />
          </div>
        </section>
        <aside className="flex flex-col items-center w-full md:col-span-1 min-h-0 mt-2 md:mt-0">
          <div className="flex-1 w-full min-h-0 overflow-auto flex flex-col items-center">
            <QueueList queue={upNext} />
          </div>
        </aside>
      </div>
      <footer className="py-1 sm:py-2 text-center text-gray-400 text-xs sm:text-sm opacity-80 flex-shrink-0">
        Powered by Navigating Kenya &bull; Enjoy the show!
      </footer>
    </main>
  );
}
