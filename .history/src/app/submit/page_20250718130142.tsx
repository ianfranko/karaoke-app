// app/submit/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function SubmitPage() {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [queuedYou, setQueuedYou] = useState(false);

  const handleSubmit = async () => {
    if (!name || !link.includes('youtube.com')) {
      toast.error('Please provide a valid name and YouTube link.');
      return;
    }

    try {
      await addDoc(collection(db, 'karaokeQueue'), {
        name,
        youtubeLink: link,
        status: 'queued',
        createdAt: serverTimestamp(),
      });
      toast.success('🎉 Song submitted!');
      setQueuedYou(true);
      setLink('');
    } catch (err) {
      toast.error('Failed to submit.');
    }
  };

  // Optional: Show "You're up!" toast
  useEffect(() => {
    if (!queuedYou || !name) return;

    const q = query(collection(db, 'karaokeQueue'));
    const unsub = onSnapshot(q, snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === 'playing' && data.name.toLowerCase() === name.toLowerCase()) {
          toast('🎤 You’re up now!', { icon: '🔥' });
        }
      });
    });

    return () => unsub();
  }, [name, queuedYou]);

  return (
    <div className="min-h-screen p-6 bg-black text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Submit Your Karaoke Song</h1>
      <input
        className="w-full max-w-md p-2 rounded text-black mb-4"
        placeholder="Your Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className="w-full max-w-md p-2 rounded text-black mb-4"
        placeholder="YouTube Karaoke Link"
        value={link}
        onChange={e => setLink(e.target.value)}
      />
      <button onClick={handleSubmit} className="bg-pink-600 px-6 py-2 rounded">
        Submit Song
      </button>
    </div>
  );
}
