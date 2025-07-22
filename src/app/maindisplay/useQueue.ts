import { useEffect, useState } from 'react';
import { db, removeQueueItem } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

interface QueueItem {
  key: string;
  name: string;
  youtubeLink: string;
  status: string;
  timestamp?: number;
}

export function useQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const isAdmin = typeof window !== 'undefined' && window.location.search.includes('admin=1');

  useEffect(() => {
    const queueRef = ref(db, 'queue');
    const unsubscribe = onValue(queueRef, (snapshot) => {
      const data = snapshot.val() || {};
      const queueArr = Object.entries(data)
        .map(([key, item]: [string, unknown]) => ({ key, ...(item as Omit<QueueItem, 'key'>) }))
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      setQueue(queueArr);
    });
    return () => unsubscribe();
  }, []);

  const removeFirst = async () => {
    if (queue[0] && queue[0].key) {
      await removeQueueItem(queue[0].key);
    }
  };

  return { queue, removeFirst, isAdmin };
} 