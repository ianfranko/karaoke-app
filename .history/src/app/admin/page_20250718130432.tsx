// app/admin/page.tsx
'use client';
import { useEffect, useState } from 'react';
// Update the import path if '@/lib/firebase' does not exist
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, updateDoc, doc, orderBy } from 'firebase/firestore';
import YouTube from 'react-youtube';

function extractVideoId(url: string) {
  const regExp = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default function AdminPage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, 'karaokeQueue'), orderBy('createdAt'));
    return onSnapshot(q, snapshot => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQueue(items);
      const next = items.find(item => item.status === 'queued');
      if (next && (!current || current.id !== next.id)) {
        setCurrent(next);
        updateDoc(doc(db, 'karaokeQueue', next.id), { status: 'playing' });
      }
    });
  }, []);

  const handleNext = async () => {
    if (current) {
      await updateDoc(doc(db, 'karaokeQueue', current.id), { status: 'done' });
      setCurrent(null); // Will auto-switch via snapshot
    }
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-2xl mb-4">Admin Player</h1>
      {current ? (
        <>
          <h2 className="text-xl mb-2">Now Playing: {current.name}</h2>
          <YouTube videoId={extractVideoId(current.youtubeLink)} opts={{ height: '390', width: '640' }} />
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
