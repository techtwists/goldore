import React from 'react';

interface UserInfoProps {
  userData: UserData;
  gold: number;
  passiveIncome: number;
}

export const UserInfo: React.FC<UserInfoProps> = ({ userData, gold, passiveIncome }) => (
  <div className="user-info bg-white p-4 rounded shadow mb-4">
    <h1 className="text-2xl font-bold">Welcome, {userData.first_name}!</h1>
    <p className="text-gray-600">Total Gold: {gold}</p>
    <p className="text-gray-600">Passive Income: {passiveIncome} gold/second</p>
  </div>
);