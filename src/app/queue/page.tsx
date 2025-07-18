// app/queue/page.tsx
'use client';
import { useState } from 'react';

export default function QueuePage() {
  const [queue] = useState([
    {
      name: 'Alice',
      youtubeLink: 'https://youtu.be/dQw4w9WgXcQ',
      status: 'waiting',
      createdAt: new Date('2024-06-01T18:00:00Z'),
    },
    {
      name: 'Bob',
      youtubeLink: 'https://youtu.be/3JZ_D3ELwOQ',
      status: 'playing',
      createdAt: new Date('2024-06-01T18:05:00Z'),
    },
    {
      name: 'Charlie',
      youtubeLink: 'https://youtu.be/L_jWHffIx5E',
      status: 'waiting',
      createdAt: new Date('2024-06-01T18:10:00Z'),
    },
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center tracking-tight drop-shadow-lg">🎤 Live Karaoke Queue</h1>
      {queue.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <span className="text-5xl mb-4">😴</span>
          <p className="text-lg text-gray-300">No one in the queue yet! Be the first to sing!</p>
        </div>
      ) : (
        <ul className="space-y-4 max-w-2xl mx-auto">
          {queue.map((item, index) => {
            const isPlaying = item.status === 'playing';
            const position =
              index === 0 && !isPlaying
                ? 'Next up'
                : isPlaying
                ? 'Now Playing'
                : `#${index + 1}`;
            return (
              <li
                key={index}
                className={`flex items-center gap-4 p-4 border rounded-lg shadow transition-all duration-200 ${
                  isPlaying
                    ? 'bg-green-700 border-green-400 scale-105 animate-pulse'
                    : 'bg-gray-900 border-gray-700 hover:bg-gray-800'
                }`}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-2xl font-bold shadow-inner">
                  {item.name?.[0]?.toUpperCase() || '🎤'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-semibold truncate">{item.name}</p>
                    {isPlaying && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-green-300 text-green-900 rounded-full font-bold animate-bounce">Now Playing</span>
                    )}
                  </div>
                  <a
                    href={item.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-300 hover:underline truncate max-w-xs"
                    title={item.youtubeLink}
                  >
                    {item.youtubeLink}
                  </a>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs italic text-gray-400">{item.status}</span>
                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full ml-2">{position}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
