import React from 'react';

interface QueueItem {
  key: string;
  name: string;
  youtubeLink: string;
  status: string;
  timestamp?: number;
}

const QueueList: React.FC<{ queue: QueueItem[] }> = ({ queue }) => {
  return (
    <div className="w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-blue-200 mb-2 flex items-center gap-2">
        <span role="img" aria-label="up next">⏭️</span> Up Next
      </h2>
      {queue.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {queue.map((item) => (
            <li key={item.key}>
              <div className="flex items-center gap-4 bg-white/20 rounded-xl p-3 shadow border border-white/10 hover:bg-white/30 transition">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold shadow-inner text-white">
                  {item.name?.[0]?.toUpperCase() || '🎤'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-semibold truncate text-white">{item.name}</div>
                  <a
                    href={item.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-blue-100 hover:underline truncate max-w-xs"
                    title={item.youtubeLink}
                  >
                    {item.youtubeLink}
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center h-32">
          <span className="text-4xl mb-2">🎤</span>
          <p className="text-lg text-gray-200">No one is in the queue yet!</p>
        </div>
      )}
    </div>
  );
};

export default QueueList; 