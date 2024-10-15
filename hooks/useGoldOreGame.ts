import { useState, useEffect } from 'react';

// Define the Upgrade type if not already defined
interface Upgrade {
  name: string;
  level: number;
  cost: number;
  productionRate: number;
  image: string; // Add other relevant properties if needed
}

export const useGoldOreGame = (initialGold: number, initialUpgrades: Upgrade[], initialPassiveIncome: number) => {
  const [gold, setGold] = useState(initialGold);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(initialUpgrades);
  const [passiveIncome, setPassiveIncome] = useState(initialPassiveIncome);

  // Effect to load from local storage (if needed)
  useEffect(() => {
    const savedGold = localStorage.getItem('goldOreGold');
    const savedUpgrades = localStorage.getItem('goldOreUpgrades');

    if (savedGold) {
      setGold(Number(savedGold));
    }

    if (savedUpgrades) {
      setUpgrades(JSON.parse(savedUpgrades));
      calculatePassiveIncome(JSON.parse(savedUpgrades));
    }
  }, []);

  // Effect to save gold and upgrades to local storage
  useEffect(() => {
    localStorage.setItem('goldOreGold', String(gold));
    localStorage.setItem('goldOreUpgrades', JSON.stringify(upgrades));
  }, [gold, upgrades]);

  const mineGold = () => {
    setGold((prevGold) => prevGold + 1);
  };

  const purchaseUpgrade = (index: number) => {
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
    gold,
    upgrades,
    passiveIncome,
    mineGold,
    purchaseUpgrade,
  };
};