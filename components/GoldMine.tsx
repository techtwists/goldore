import React from 'react';

interface GoldMineProps {
  mineGold: () => void;
}

export const GoldMine: React.FC<GoldMineProps> = ({ mineGold }) => (
  <div className="gold-mine bg-yellow-100 p-6 rounded shadow mb-4">
    <h2 className="text-xl font-bold mb-2">Gold Mine</h2>
    <button
      className="mine-button bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full shadow-md"
      onClick={mineGold}
    >
      Mine Gold
    </button>
  </div>
);