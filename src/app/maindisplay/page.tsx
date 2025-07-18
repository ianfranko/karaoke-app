// app/maindisplay/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import YouTube from 'react-youtube';

interface QueueItem {
  name: string;
  youtubeLink: string;
  status: string;
}

function getYouTubeId(url: string): string | null {
  // Extracts the video ID from a YouTube URL
  const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default function MainDisplayPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'karaokeQueue'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => doc.data() as QueueItem);
      if (data.length === 0) {
        // Provide mock data if queue is empty
        setQueue([
          {
            name: 'Alice',
            youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            status: 'playing',
          },
          {
            name: 'Bob',
            youtubeLink: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
            status: 'queued',
          },
        ]);
      } else {
        setQueue(data);
      }
    });
    return unsubscribe;
  }, []);

  const nowPlaying = queue[0];
  const upNext = queue[1];
  const videoId = nowPlaying ? getYouTubeId(nowPlaying.youtubeLink) : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold mb-6 text-center drop-shadow-lg w-full">🎶 Now Playing</h1>
      <div className="flex flex-col md:flex-row w-full max-w-6xl h-[70vh] gap-8 items-stretch">
        {/* Video Section */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 rounded-lg shadow-lg p-4">
          {nowPlaying && videoId ? (
            <>
              <div className="w-full h-full flex flex-col items-center justify-center">
                <YouTube
                  videoId={videoId}
                  opts={{
                    width: '100%',
                    height: '400',
                    playerVars: {
                      autoplay: 1,
                    },
                  }}
                  className="rounded-lg shadow-lg mb-4 w-full h-full"
                />
                <div className="text-2xl font-bold mt-2 mb-1">{nowPlaying.name}</div>
                <div className="text-sm text-gray-300 mb-2">{nowPlaying.youtubeLink}</div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-5xl mb-4">⏳</span>
              <p className="text-lg text-gray-300">Waiting for the next song...</p>
            </div>
          )}
        </div>
        {/* Up Next Section */}
        <div className="w-full md:w-96 flex-shrink-0 flex flex-col justify-center">
          {upNext && (
            <div className="p-6 bg-gray-900 border-l-4 border-blue-500 rounded-lg shadow max-w-xl w-full h-full flex flex-col justify-center">
              <h2 className="text-xl font-semibold mb-2 text-blue-300">Up Next</h2>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-xl font-bold shadow-inner">
                  {upNext.name?.[0]?.toUpperCase() || '🎤'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-semibold truncate">{upNext.name}</div>
                  <a
                    href={upNext.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-blue-300 hover:underline truncate max-w-xs"
                    title={upNext.youtubeLink}
                  >
                    {upNext.youtubeLink}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
