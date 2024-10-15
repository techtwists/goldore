'use client';
import React from 'react';
import Image from 'next/image';

interface Upgrade {
  name: string;
  level: number;
  cost: number;
  image: string; // Ensure this path is relative or absolute
}

interface UpgradeListProps {
  upgrades: Upgrade[];
  gold: number;
  purchaseUpgrade: (index: number) => void;
}

export const UpgradeList: React.FC < UpgradeListProps > = ({ upgrades, gold, purchaseUpgrade }) => (
  <div className="technology-upgrades bg-white p-4 rounded shadow mb-4">
    <h2 className="text-xl font-bold mb-2">Upgrades</h2>
    <ul>
      {upgrades.map((upgrade, index) => (
        <li key={index} className="flex items-center justify-between mb-2 p-2 border rounded">
          <div className="flex items-center">
            <Image
              src={upgrade.image}
              alt={upgrade.name}
              width={32} // Adjust size as needed
              height={32} // Adjust size as needed
              className="mr-2" // You can use Tailwind CSS for styling
            />
            <span>
              {upgrade.name} (Level {upgrade.level})
            </span>
          </div>
          <button
            className="bg-green-500 text-white font-bold py-1 px-3 rounded-full shadow"
            onClick={() => purchaseUpgrade(index)}
            disabled={gold < upgrade.cost}
          >
            Upgrade for {upgrade.cost} Gold
          </button>
        </li>
      ))}
    </ul>
  </div>
);