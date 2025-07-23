import React, { useState } from 'react';

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

interface NowPlayingCardProps {
  nowPlaying?: QueueItem;
  onNext: () => void;
}

const NowPlayingCard: React.FC<NowPlayingCardProps> = ({ nowPlaying, onNext }) => {
  const videoId = nowPlaying ? getYouTubeId(nowPlaying.youtubeLink) : null;
  const embedUrl = videoId && typeof window !== 'undefined'
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&origin=${encodeURIComponent(window.location.origin)}&enablejsapi=1`
    : null;

  return (
    <div className="w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-white/20">
      <div className="mb-4">
        <span className="px-6 py-2 text-lg font-bold rounded-full shadow border backdrop-blur-md">
          Now Playing
        </span>
      </div>
      {nowPlaying ? (
        <>
          <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow border mb-4 bg-black flex items-center justify-center">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
                title="YouTube video player"
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full">
                <span className="text-4xl mb-2">⏳</span>
                <p className="text-lg">Video unavailable</p>
              </div>
            )}
          </div>
          <a
            href={nowPlaying.youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition mb-4">Open on YouTube</button>
          </a>
          <div className="text-3xl font-extrabold mb-1 flex items-center gap-2">
            <span className="relative px-6 py-2 rounded-full shadow border backdrop-blur-md">
              <span className="relative">{nowPlaying.name}</span>
            </span>
          </div>
          <a
            href={nowPlaying.youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:underline truncate max-w-xs mb-2"
            title={nowPlaying.youtubeLink}
          >
            {nowPlaying.youtubeLink}
          </a>
          <button
            onClick={onNext}
            className="mt-4 px-6 py-2 font-bold rounded-full shadow hover:bg-gray-200 transition border flex items-center gap-2"
            aria-label="Next Song"
          >
            <span>Next</span> <span aria-hidden>▶️</span>
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <span className="text-6xl mb-4 animate-spin">⏳</span>
          <p className="text-xl">Waiting for the next song...</p>
        </div>
      )}
    </div>
  );
};

export default NowPlayingCard; 