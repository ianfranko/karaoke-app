// app/submit/page.tsx
'use client';
import { useState } from 'react';
import { addQueueItem } from '../../lib/firebase';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import Image from 'next/image';

// Define a type for YouTube search results
interface YouTubeSearchResult {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: { default: { url: string } };
  };
}

const YOUTUBE_API_KEY = 'AIzaSyBHqRNH4gADf3XQnaCQ92_eSNf2wv1GYCk';

export default function SubmitPage() {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [queuedYou, setQueuedYou] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

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
      await addQueueItem({
        songTitle: '', // You can add a field for song title if you want to collect it
        artist: '', // You can add a field for artist if you want to collect it
        addedBy: name,
        youtubeLink: link,
        status: 'waiting',
      });
      toast.dismiss(); // Dismiss all previous toasts
      toast.success('🎤✨ Your song is in the queue! Get ready to shine on stage! 🌟🎶', {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#1e293b',
          color: '#f472b6',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          boxShadow: '0 0 20px #f472b6',
        },
      });
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#f472b6', '#facc15', '#a78bfa', '#fff'],
        shapes: ['circle', 'square'],
      });
      setQueuedYou(true);
      setLink('');
      setSearchQuery('');
      setSearchResults([]);
      setSuccess(true);
      setTimeout(() => setQueuedYou(false), 3000);
      setError(''); // Clear error message below form
      setSuccess(false); // Remove success message below form
    } catch (err) {
      console.error('Submission error:', err); // Log the actual error
      setError('Failed to submit.');
      toast.error('Failed to submit.');
    } finally {
      setLoading(false);
    }
  };

  const handleYouTubeSearch = async () => {
    setSearchError('');
    setSearchLoading(true);
    setSearchResults([]);
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(
          searchQuery + ' karaoke'
        )}&key=${YOUTUBE_API_KEY}`
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setSearchResults(data.items || []);
    } catch {
      setSearchError('Failed to fetch YouTube results.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-screen w-full p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white flex flex-col items-center overflow-y-auto">
      {/* Navigation Links */}
      <div className="w-full max-w-md flex justify-between mb-6">
        <Link href="/maindisplay" className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded transition shadow">
          Main Display
        </Link>
        <Link href="/queue" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition shadow">
          Queue
        </Link>
      </div>
      <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center animate-fade-in">
        <h1 className="text-3xl font-extrabold mb-6 text-pink-400 drop-shadow">Submit Your Name and Song</h1>
        {/* YouTube Search Section */}
        <div className="w-full flex flex-col gap-2 mb-6">
          <label className="text-left w-full font-semibold" htmlFor="yt-search">YouTube Search (and add "Kraraoke" at the end of the search)</label>
          <div className="flex gap-2">
            <input
              id="yt-search"
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              placeholder="Type a song or artist..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              disabled={searchLoading}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={handleYouTubeSearch}
              disabled={searchLoading || !searchQuery}
              className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded font-bold shadow transition disabled:opacity-50"
            >
              {searchLoading ? <FaSpinner className="animate-spin" /> : 'Search'}
            </button>
          </div>
          {searchError && <div className="text-red-400 text-sm font-medium animate-shake">{searchError}</div>}
          {/* Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 grid grid-cols-1 gap-3 overflow-y-auto max-h-52">
              {searchResults.map((item) => (
                <div
                  key={item.id.videoId}
                  className="flex items-center gap-3 bg-gray-800 rounded p-2 cursor-pointer hover:bg-pink-900 transition"
                  onClick={() => {
                    setLink(`https://www.youtube.com/watch?v=${item.id.videoId}`);
                    toast.success(`Song link for &quot;${item.snippet.title}&quot; auto-filled!`);
                  }}
                >
                  <Image
                    src={item.snippet.thumbnails.default.url}
                    alt={item.snippet.title}
                    width={64}
                    height={40}
                    className="rounded object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-pink-300">{item.snippet.title}</span>
                    <span className="text-xs text-gray-400">{item.snippet.channelTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* End YouTube Search Section */}
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
