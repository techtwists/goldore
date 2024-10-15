'use client';

import { useState } from 'react';

export default function Home() {
  // State for gold
  const [gold, setGold] = useState(0);

  // Handle mining gold
  const mineGold = () => {
    setGold((prevGold) => prevGold + 1);
  };

  return (
    <div className="game-container max-w-md mx-auto p-6 bg-gray-100">
      <h1 className="text-2xl font-bold">Gold Coin Tapping Game</h1>
      <p className="text-lg">Gold: {gold}</p>
      <button
        onClick={mineGold}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Tap to Mine Gold
      </button>
    </div>
  );
}