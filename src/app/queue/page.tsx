// app/queue/page.tsx
'use client';
import { useEffect, useState } from 'react';
import QueueItem from '../components/QueueItem';
import { listenToQueue } from '../../lib/firebase';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';
import { useRef, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { updateQueueOrder } from '../../lib/firebase';

interface QueueItemData {
  key: string;
  songTitle: string;
  artist: string;
  addedBy: string;
  youtubeLink?: string;
  status?: string;
  timestamp?: number;
  position?: number; // Added for drag-and-drop
}

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueItemData[]>([]);
  const prevQueueLength = useRef(0);
  const [play] = useSound('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4c82.mp3', { volume: 0.3 }); // Free sound

  // Sort by position if present, else by timestamp
  useEffect(() => {
    const unsubscribe = listenToQueue((items) => {
      const typedItems = items.map((item) => ({
        key: String(item.key),
        songTitle: String(item.songTitle ?? ''),
        artist: String(item.artist ?? ''),
        addedBy: String(item.addedBy ?? ''),
        youtubeLink: typeof item.youtubeLink === 'string' ? item.youtubeLink : '',
        status: typeof item.status === 'string' ? item.status : undefined,
        timestamp: typeof item.timestamp === 'number' ? item.timestamp : undefined,
        position: typeof item.position === 'number' ? item.position : undefined,
      })) as QueueItemData[];
      const sorted = typedItems.sort((a, b) => {
        if (typeof a.position === 'number' && typeof b.position === 'number') {
          return Number(a.position) - Number(b.position);
        }
        return Number(a.timestamp || 0) - Number(b.timestamp || 0);
      });
      setQueue(sorted);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Drag and drop handler
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const newQueue = Array.from(queue);
    const [removed] = newQueue.splice(result.source.index, 1);
    newQueue.splice(result.destination.index, 0, removed);
    setQueue(newQueue);
    await updateQueueOrder(newQueue.map((item, idx) => ({ key: item.key })));
  };

  useEffect(() => {
    if (prevQueueLength.current === 0 && queue.length > 0) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
      });
      play();
    }
    prevQueueLength.current = queue.length;
  }, [queue.length, play]);

  // Limit queue to 25 entries for display and drag-and-drop
  const MAX_QUEUE_LENGTH = 25;
  const limitedQueue = queue.slice(0, MAX_QUEUE_LENGTH);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f2027] via-[#2c5364] to-[#232526] text-white p-4 sm:p-8 relative overflow-hidden">
      {/* Animated floating music notes */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <span className="absolute left-10 top-10 text-4xl opacity-40 animate-float-slow text-pink-400">🎵</span>
        <span className="absolute right-20 top-1/3 text-3xl opacity-20 animate-float text-white">🎶</span>
        <span className="absolute left-1/2 bottom-20 text-5xl opacity-20 animate-float-fast text-pink-300">🎤</span>
        <span className="absolute right-10 bottom-10 text-4xl opacity-30 animate-float text-white">🎼</span>
        
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center tracking-tight drop-shadow-lg relative z-10 text-white">🎤 Live Karaoke Queue</h1>
      {queue.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 relative z-10">
          <span className="text-5xl mb-4 animate-bounce">😴</span>
          <p className="text-lg text-gray-200">No one in the queue yet! Be the first to sing!</p>
        </div>
      ) : (
        <>
          {queue.length >= MAX_QUEUE_LENGTH && (
            <div className="max-w-2xl mx-auto mb-4 p-2 bg-pink-900/80 text-pink-200 text-center rounded shadow-lg relative z-10">
              The queue is full! No more than 25 entries allowed.
            </div>
          )}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="queue-list">
              {(provided) => (
                <ul className="space-y-4 max-w-2xl mx-auto relative z-10" ref={provided.innerRef} {...provided.droppableProps}>
                  {limitedQueue.map((item, idx) => (
                    <Draggable key={item.key} draggableId={item.key} index={idx}>
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={
                            (idx === 0 ? 'relative z-10 ' : '') +
                            (snapshot.isDragging ? 'scale-105 shadow-2xl ring-2 ring-pink-400 ' : '') +
                            ' animate-slideIn'
                          }
                          style={{ ...provided.draggableProps.style }}
                        >
                          {idx === 0 && (
                            <div className="spotlight-effect" />
                          )}
                          <div className={
                            idx === 0
                              ? 'ring-4 ring-pink-400/60 rounded-lg animate-pulse shadow-lg bg-black/80'
                              : 'bg-black/70'
                          }>
                            <div className="group relative cursor-grab active:cursor-grabbing">
                              <QueueItem
                                name={item.addedBy || item.artist || 'Unknown'}
                                youtubeLink={item.youtubeLink || ''}
                                status={item.status || (idx === 0 ? 'singing' : 'waiting')}
                                songTitle={item.songTitle}
                                artist={item.artist}
                              />
                              <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none">Click to expand for details</span>
                            </div>
                            {idx === 0 && (
                              <>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-pink-600 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-bounce font-bold">Now Singing!</div>
                                {/* Animated progress bar */}
                                <div className="w-full h-2 bg-pink-900 rounded mt-2 overflow-hidden">
                                  <div className="h-full bg-pink-400 animate-progressBar" style={{ width: '100%' }}></div>
                                </div>
                              </>
                            )}
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </>
      )}
    </main>
  );
}
