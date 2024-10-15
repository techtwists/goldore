import { useState } from 'react';

// Define the Upgrade type if not already defined
interface Upgrade {
  name: string;
  level: number;
  cost: number;
  productionRate: number;
  image: string; // Add other relevant properties if needed
}

export const useGoldOreGame = (initialGold: number, initialUpgrades: Upgrade[], initialPassiveIncome: number) => {
  const [upgrades, setUpgrades] = useState<Upgrade[]>(initialUpgrades);
  const [passiveIncome, setPassiveIncome] = useState(initialPassiveIncome);

  const mineGold = (setGold: (gold: number) => void) => {
    setGold((prevGold) => prevGold + 1);
  };

  const purchaseUpgrade = (index: number, gold: number, setGold: (gold: number) => void) => {
    const upgrade = upgrades[index];
    if (gold >= upgrade.cost) {
      const updatedUpgrades = [...upgrades];
      updatedUpgrades[index] = {
        ...upgrade,
        level: upgrade.level + 1,
        cost: Math.floor(upgrade.cost * 1.5), // Adjust the cost for the next level
        productionRate: Math.floor(upgrade.productionRate * 1.2), // Adjust production rate
      };
      setUpgrades(updatedUpgrades);
      setGold(gold - upgrade.cost);
      calculatePassiveIncome(updatedUpgrades);
    } else {
      alert("Not enough gold to purchase this upgrade."); // Optional feedback
    }
  };

  const calculatePassiveIncome = (updatedUpgrades: Upgrade[]) => {
    const totalPassiveIncome = updatedUpgrades.reduce(
      (total, upgrade) => total + (upgrade.productionRate * upgrade.level),
      0
    );
    setPassiveIncome(totalPassiveIncome);
  };

  return {
    upgrades,
    passiveIncome,
    mineGold,
    purchaseUpgrade,
  };
};