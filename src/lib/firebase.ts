import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, push, remove, onValue, Unsubscribe, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCVoBnYzkGn6ZeS6wUUn_BEDS7YYP6l0qo', // Replace with your actual API key
  authDomain: 'karaoke-app-aef46.firebaseapp.com',
  databaseURL: 'https://karaoke-app-aef46-default-rtdb.firebaseio.com',
  projectId: 'karaoke-app-aef46',
  storageBucket: 'karaoke-app-aef46.firebasestorage.app',
  messagingSenderId: '136779308997',
  appId: '1:136779308997:web:a3c142ad7c14795493b5ac',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Helper to add a song to the queue
export function addQueueItem(song: { songTitle: string; artist: string; addedBy: string; youtubeLink: string; status: string }) {
  const queueRef = ref(db, 'queue');
  return push(queueRef, {
    ...song,
    timestamp: Date.now(),
  });
}

// Helper to remove a song from the queue by its key
export function removeQueueItem(key: string) {
  const itemRef = ref(db, `queue/${key}`);
  return remove(itemRef);
}

// Helper to listen to the queue in real-time
export function listenToQueue(callback: (queue: Array<{ key: string } & Record<string, unknown>>) => void): Unsubscribe {
  const queueRef = ref(db, 'queue');
  const unsubscribe = onValue(queueRef, (snapshot) => {
    const data = snapshot.val() || {};
    const queue = Object.entries(data).map(([key, value]: [string, unknown]) => ({ key, ...(value as Record<string, unknown>) }));
    callback(queue);
  });
  return unsubscribe;
}

// Helper to update the order of the queue
export async function updateQueueOrder(newOrder: Array<{ key: string }>) {
  const updates: Record<string, unknown> = {};
  newOrder.forEach((item, idx) => {
    updates[`queue/${item.key}/position`] = idx;
  });
  return update(ref(db), updates);
} 