import React, { useState } from 'react';

interface QueueItemProps {
  name: string;
  youtubeLink: string;
  status: string;
  songTitle?: string;
  artist?: string;
}

const statusColors: Record<string, string> = {
  waiting: 'bg-yellow-500',
  singing: 'bg-green-500',
  done: 'bg-gray-500',
};

const QueueItem: React.FC<QueueItemProps> = ({ name, youtubeLink, status, songTitle, artist }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(youtubeLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  // Try to use emoji if present in name, else fallback to initial
  const avatar = /\p{Emoji}/u.test(name) ? name.match(/\p{Emoji}/u)?.[0] : name?.[0]?.toUpperCase() || '🎤';

  return (
    <div
      className="flex items-center gap-4 p-3 border rounded-lg bg-gray-900 border-gray-700 shadow-md transition-transform duration-300 hover:scale-[1.025] cursor-pointer animate-fadeIn"
      onClick={() => setExpanded((e) => !e)}
      style={{ position: 'relative' }}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-2xl font-bold">
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold truncate text-lg">{name}</p>
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold text-white ${statusColors[status] || 'bg-gray-600'} ${status === 'singing' ? 'animate-pulseStatus' : ''}`}>{status}</span>
        </div>
        {expanded && (
          <div className="mt-2 space-y-1">
            {songTitle && <div className="text-sm text-gray-200 font-medium">🎵 {songTitle}</div>}
            {artist && <div className="text-xs text-gray-400">by {artist}</div>}
            <div className="flex items-center gap-2">
              <a
                href={youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-300 hover:underline break-all"
                title={youtubeLink}
                onClick={e => e.stopPropagation()}
              >
                {youtubeLink}
              </a>
              <button
                className="ml-1 px-2 py-0.5 bg-blue-600 text-xs rounded text-white hover:bg-blue-700 focus:outline-none"
                onClick={e => { e.stopPropagation(); handleCopy(); }}
                title="Copy YouTube link"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueItem;
// Add fadeIn animation to globals.css if not present:
// @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none;} }
// .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.4,0,0.2,1); } 