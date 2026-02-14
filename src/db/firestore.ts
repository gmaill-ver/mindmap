import {
  collection, doc, setDoc, getDocs, deleteDoc, query, orderBy,
  onSnapshot, type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { MindMap } from '../types';

const MAPS_COLLECTION = 'maps';

function mapsRef(userId: string) {
  return collection(db, 'users', userId, MAPS_COLLECTION);
}

export async function saveMapToCloud(userId: string, data: MindMap): Promise<void> {
  const ref = doc(db, 'users', userId, MAPS_COLLECTION, data.id);
  await setDoc(ref, { ...data, updatedAt: Date.now() });
}

export async function loadMapsFromCloud(userId: string): Promise<MindMap[]> {
  const q = query(mapsRef(userId), orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as MindMap);
}

export async function deleteMapFromCloud(userId: string, mapId: string): Promise<void> {
  const ref = doc(db, 'users', userId, MAPS_COLLECTION, mapId);
  await deleteDoc(ref);
}

export function subscribeMaps(
  userId: string,
  callback: (maps: MindMap[]) => void
): Unsubscribe {
  const q = query(mapsRef(userId), orderBy('updatedAt', 'desc'));
  return onSnapshot(q, snapshot => {
    const maps = snapshot.docs.map(d => d.data() as MindMap);
    callback(maps);
  });
}
