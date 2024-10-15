import { useState, useEffect } from 'react';
import { useLocalCache } from './useLocalCache';

export const useUserData = (userId: number) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { loadFromCache, saveToCache } = useLocalCache();

  useEffect(() => {
    const fetchUserData = async () => {
      // Check if user data exists in local cache
      const cachedUserData = await loadFromCache(userId);
      if (cachedUserData) {
        setUserData(cachedUserData);
      } else {
        // Fetch from API
        const response = await fetch(`/api/getUserData?userId=${userId}`);
        const data = await response.json();
        setUserData(data);

        // Save to cache
        saveToCache(userId, data);
      }
    };

    fetchUserData();
  }, [userId]);

  return { userData };
};