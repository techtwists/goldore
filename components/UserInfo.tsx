// components/UserInfo.tsx
import React from 'react';
import { useUserData } from '../hooks/useUserData'; // Import UserData from useUserData
const {UserData} = useUserData();
interface UserInfoProps {
  userData: UserData | null; // Allow null if user data is not yet loaded
  gold: number;
  passiveIncome: number;
}

export const UserInfo: React.FC<UserInfoProps> = ({ userData, gold, passiveIncome }) => {
  if (!userData) return <p>Loading user info...</p>; // Display loading message if user data is null

  return (
    <div className="user-info bg-white p-4 rounded shadow mb-4">
      <h1 className="text-2xl font-bold">Welcome, {userData.first_name}!</h1>
      <p className="text-gray-600">Total Gold: {gold}</p>
      <p className="text-gray-600">Passive Income: {passiveIncome} gold/second</p>
      {/* Optionally display other user information */}
      {userData.last_name && <p className="text-gray-600">Last Name: {userData.last_name}</p>}
      {userData.username && <p className="text-gray-600">Username: {userData.username}</p>}
    </div>
  );
};