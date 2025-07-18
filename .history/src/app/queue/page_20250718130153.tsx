// app/queue/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

export default function QueuePage() {
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'karaokeQueue'), orderBy('createdAt'));
    return onSnapshot(q, snapshot => {
      setQueue(snapshot.docs.map(doc => doc.data()));
    });
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">🎶 Live Karaoke Queue</h1>
      <ul className="space-y-4 max-w-2xl mx-auto">
        {queue.map((item, index) => (
          <li
            key={index}
            className={`p-4 border rounded ${item.status === 'playing' ? 'bg-green-600' : 'bg-gray-800'}`}
          >
            <p className="text-xl">{item.name}</p>
            <p className="text-sm text-blue-300">{item.youtubeLink}</p>
            <p className="text-xs italic">{item.status}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
