import { useState, useEffect } from 'react';
import { useLocalCache } from '../hooks/useLocalCache';
import WebApp from '@twa-dev/sdk';

// Define the interface for user data (coming from Telegram)
interface UserData {
  id: number;
  first_name: string;
  last_name ? : string;
  username ? : string;
  language_code: string;
  is_premium ? : boolean;
  gold ? : number;
  upgrades ? : any[];
  passiveIncome ? : number;
  dailyRewardClaimed ? : boolean;
  referral ? : any;
}

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { loadFromCache, saveToCache } = useLocalCache();

  useEffect(() => {
    const fetchUserData = async () => {
      // Ensure Telegram user data is available
      if (WebApp.initDataUnsafe.user) {
        const user = WebApp.initDataUnsafe.user as UserData;
        const userId = user.id;

        // Check if user data exists in local cache
        const cachedUserData = await loadFromCache(userId);
        if (cachedUserData) {
          setUserData(cachedUserData);
        } else {
          // Fetch from MongoDB (via API)
          const response = await fetch(`../api/getUserData?userId=${userId}`);
          const data = await response.json();
          setUserData(data);

          // Save to cache
          saveToCache(userId, data);
        }

        // Optionally save the user data to MongoDB upon first load
        await saveUserData(user);
      }
    };

    fetchUserData();
  }, []);

  // Save user data to MongoDB
  const saveUserData = async (user: UserData) => {
    try {
      const res = await fetch('../api/saveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return { userData };
};
