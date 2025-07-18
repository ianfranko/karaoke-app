// app/submit/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

export default function SubmitPage() {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [queuedYou, setQueuedYou] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);
    if (!name || !link.includes('youtube.com')) {
      setError('Please provide a valid name and YouTube link.');
      toast.error('Please provide a valid name and YouTube link.');
      return;
    }
    setLoading(true);
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
      setSuccess(true);
    } catch (err) {
      setError('Failed to submit.');
      toast.error('Failed to submit.');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white flex flex-col items-center">
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center animate-fade-in">
        <h1 className="text-3xl font-extrabold mb-6 text-pink-400 drop-shadow">Submit Your Karaoke Song</h1>
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={e => {
            e.preventDefault();
            if (!loading) handleSubmit();
          }}
        >
          <label className="text-left w-full font-semibold" htmlFor="name">Your Name</label>
          <input
            id="name"
            className={`w-full p-3 rounded bg-gray-800 text-white border focus:outline-none focus:ring-2 focus:ring-pink-500 transition ${error && !name ? 'border-red-500' : 'border-gray-700'}`}
            placeholder="e.g. Taylor Swift"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
            autoComplete="off"
          />
          <span className="text-xs text-gray-400 mb-2">Enter your name as you want it called out!</span>

          <label className="text-left w-full font-semibold" htmlFor="link">YouTube Karaoke Link</label>
          <input
            id="link"
            className={`w-full p-3 rounded bg-gray-800 text-white border focus:outline-none focus:ring-2 focus:ring-pink-500 transition ${error && (!link || !link.includes('youtube.com')) ? 'border-red-500' : 'border-gray-700'}`}
            placeholder="Paste a YouTube karaoke link"
            value={link}
            onChange={e => setLink(e.target.value)}
            disabled={loading}
            autoComplete="off"
          />
          <span className="text-xs text-gray-400 mb-2">Must be a YouTube link (e.g. https://www.youtube.com/watch?v=...)</span>

          {error && (
            <div className="text-red-400 text-sm font-medium animate-shake">{error}</div>
          )}
          {success && (
            <div className="text-green-400 text-sm font-medium animate-fade-in">Song submitted! 🎉</div>
          )}

          <button
            type="submit"
            disabled={
              loading || !name || !link || !link.includes('youtube.com')
            }
            className={`mt-2 bg-pink-600 hover:bg-pink-700 focus:bg-pink-800 px-6 py-3 rounded font-bold shadow transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <span className="flex items-center gap-2"><FaSpinner className="animate-spin" /> Submitting...</span>
            ) : (
              'Submit Song'
            )}
          </button>
        </form>
        {queuedYou && (
          <div className="mt-6 text-center text-pink-300 animate-fade-in">
            <span className="font-semibold">Thanks, {name}! Your song is in the queue.</span>
          </div>
        )}
      </div>
    </div>
  );
}
