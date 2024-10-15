'use client';

import { useState, useEffect } from 'react';
import { UserInfo } from '../components/UserInfo';
import { GoldMine } from '../components/GoldMine';
import { UpgradeList } from '../components/UpgradeList';
import { DailyReward } from '../components/DailyReward';
import { NavigationButtons } from '../components/NavigationButtons';
import { useUserData } from '../hooks/useUserData';

// Define the Upgrade type
interface Upgrade {
  name: string;
  level: number;
  cost: number;
  productionRate: number;
  image: string;
}

// Change the component name to Home
export default function Home() {
  const { userData } = useUserData(); // Fetch user data from Telegram and MongoDB

  // State for gold, upgrades, passive income, and daily reward
  const [gold, setGold] = useState(0);
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [passiveIncome, setPassiveIncome] = useState(0);
  const [lastClaimed, setLastClaimed] = useState<number | null>(null);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);

  // Update state once userData is loaded
  useEffect(() => {
    if (userData) {
      setGold(userData.gold || 0);
      setUpgrades(userData.upgrades || []);
      setPassiveIncome(userData.passiveIncome || 0);
    }
  }, [userData]);

  // Load saved data from localStorage
  useEffect(() => {
    const savedGold = localStorage.getItem('goldOreGold');
    const savedUpgrades = localStorage.getItem('goldOreUpgrades');
    const savedClaimDate = localStorage.getItem('lastClaimed');

    if (savedGold) setGold(Number(savedGold));
    if (savedUpgrades) {
      const parsedUpgrades = JSON.parse(savedUpgrades);
      setUpgrades(parsedUpgrades);
      calculatePassiveIncome(parsedUpgrades);
    }
    if (savedClaimDate) {
      const currentTime = Date.now();
      setLastClaimed(Number(savedClaimDate));
      setDailyRewardClaimed(currentTime - Number(savedClaimDate) < 24 * 60 * 60 * 1000); 
    }
  }, []);

  // Save data to localStorage whenever relevant state changes
  useEffect(() => {
    localStorage.setItem('goldOreGold', String(gold));
    localStorage.setItem('goldOreUpgrades', JSON.stringify(upgrades));
    if (lastClaimed) localStorage.setItem('lastClaimed', String(lastClaimed));
  }, [gold, upgrades, lastClaimed]);

  // Calculate passive income based on upgrades
  const calculatePassiveIncome = (updatedUpgrades: Upgrade[]) => {
    const totalPassiveIncome = updatedUpgrades.reduce(
      (total, upgrade) => total + (upgrade.productionRate * upgrade.level),
      0
    );
    setPassiveIncome(totalPassiveIncome);
  };

  // Handle mining gold
  const mineGold = () => {
    setGold((prevGold) => prevGold + 1);
  };

  // Handle purchasing an upgrade
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
    } else {
      alert("Not enough gold to purchase this upgrade.");
    }
  };

  // Handle claiming daily reward
  const claimDailyReward = () => {
    const currentTime = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (lastClaimed && currentTime - lastClaimed < oneDay) {
      alert("You've already claimed your daily reward today.");
      return;
    }

    const rewardAmount = 100; 
    setGold((prevGold) => prevGold + rewardAmount);
    setLastClaimed(currentTime);
    setDailyRewardClaimed(true);
    alert(`You have claimed your daily reward of ${rewardAmount} gold!`);
  };

  // Display loading state if userData is not yet available
  if (!userData) return <p>Loading...</p>;

  return (
    <div className="game-container max-w-md mx-auto p-6 bg-gray-100">
      <UserInfo userData={userData} gold={gold} passiveIncome={passiveIncome} />
      <GoldMine mineGold={mineGold} />
      <UpgradeList upgrades={upgrades} gold={gold} purchaseUpgrade={purchaseUpgrade} />
      <DailyReward claimDailyReward={claimDailyReward} dailyRewardClaimed={dailyRewardClaimed} />
      <NavigationButtons />
    </div>
  );
}