// app/admin/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';  
import { ref, onValue, update } from 'firebase/database';
import YouTube from 'react-youtube';

function extractVideoId(url: string) {
  const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

interface KaraokeQueueItem {
  id: string;
  name: string;
  youtubeLink: string;
  status: 'queued' | 'playing' | 'done';
  createdAt?: number;
}

export default function AdminPage() {
  const [current, setCurrent] = useState<KaraokeQueueItem | null>(null);

  useEffect(() => {
    const queueRef = ref(db, 'karaokeQueue');
    const unsubscribe = onValue(queueRef, (snapshot) => {
      const data = snapshot.val() || {};
      const items = Object.entries(data)
        .map(([id, item]) => ({ id, ...(item as Omit<KaraokeQueueItem, 'id'>) }))
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      const next = items.find((item: KaraokeQueueItem) => item.status === 'queued');
      if (next && (!current || current.id !== next.id)) {
        setCurrent(next);
        update(ref(db, `karaokeQueue/${next.id}`), { status: 'playing' });
      }
    });
    return () => unsubscribe();
  }, [current]);

  const handleNext = async () => {
    if (current) {
      await update(ref(db, `karaokeQueue/${current.id}`), { status: 'done' });
      setCurrent(null); // Will auto-switch via snapshot
    }
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-2xl mb-4">Admin Player</h1>
      {current ? (
        <>
          <h2 className="text-xl mb-2">Now Playing: {current.name}</h2>
          <YouTube videoId={extractVideoId(current.youtubeLink) ?? undefined} opts={{ height: '390', width: '640' }} />
          <button onClick={handleNext} className="mt-4 bg-green-600 px-6 py-2 rounded">
            Next Song
          </button>
        </>
      ) : (
        <p>No songs queued.</p>
      )}
    </div>
  );
}
