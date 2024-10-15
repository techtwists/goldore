import { useState, useEffect } from 'react';

export const useGoldOreGame = (initialGold: number, initialUpgrades: Upgrade[], initialPassiveIncome: number) => {
  const [gold, setGold] = useState(initialGold);
  const [upgrades, setUpgrades] = useState(initialUpgrades);
  const [passiveIncome, setPassiveIncome] = useState(initialPassiveIncome);

  const mineGold = () => setGold((prevGold) => prevGold + 1);

  const purchaseUpgrade = (index: number) => {
    const upgrade = upgrades[index];
    if (gold >= upgrade.cost) {
      const updatedUpgrades = [...upgrades];
      updatedUpgrades[index] = {
        ...upgrade,
        level: upgrade.level + 1,
        cost: Math.floor(upgrade.cost * 1.5),
        productionRate: Math.floor(upgrade.productionRate * 1.2),
      };
      setUpgrades(updatedUpgrades);
      setGold(gold - upgrade.cost);
      calculatePassiveIncome(updatedUpgrades);
    }
  };

  const calculatePassiveIncome = (updatedUpgrades: Upgrade[]) => {
    const totalPassiveIncome = updatedUpgrades.reduce(
      (total, upgrade) => total + upgrade.productionRate * upgrade.level,
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
