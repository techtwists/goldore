'use client';
import { openDB } from 'idb';

export const useLocalCache = () => {
  const initDB = async () => {
    return openDB('gameDataDB', 1, {
      upgrade(db) {
        db.createObjectStore('gameData', { keyPath: 'id' });
      },
    });
  };

  const saveToCache = async (userId: number, gameData: any) => {
    const db = await initDB();
    await db.put('gameData', { id: userId, ...gameData });
  };

  const loadFromCache = async (userId: number) => {
    const db = await initDB();
    return await db.get('gameData', userId);
  };

  return { saveToCache, loadFromCache };
};
