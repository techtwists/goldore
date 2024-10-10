// pages/index.tsx
'use client'

import WebApp from '@twa-dev/sdk';
import { useEffect, useState } from 'react';

// Define the interface for user data
interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Get user data from Telegram Web App SDK
    if (WebApp.initDataUnsafe.user) {
      const user = WebApp.initDataUnsafe.user as UserData;
      setUserData(user);
      saveUserData(user); // Save user data to MongoDB
    }
  }, []);

  const saveUserData = async (user: UserData) => {
    try {
      const res = await fetch('/api/saveUser', {
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

  return (
    <main className="p-4">
      {userData ? (
        <>
          <h1 className="text-2xl font-bold mb-4">User Data</h1>
          <ul>
            <li>ID: {userData.id}</li>
            <li>First Name: {userData.first_name}</li>
            <li>Last Name: {userData.last_name || 'N/A'}</li>
            <li>Username: {userData.username || 'N/A'}</li>
            <li>Language Code: {userData.language_code}</li>
            <li>Is Premium: {userData.is_premium ? 'Yes' : 'No'}</li>
          </ul>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
}