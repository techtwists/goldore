'use client';

import { useState, useEffect } from 'react';
import { UserInfo } from '../components/UserInfo';
import { GoldMine } from '../components/GoldMine';
import { UpgradeList } from '../components/UpgradeList';
import { DailyReward } from '../components/DailyReward';
import { ReferralSystem } from '../components/ReferralSystem';
import { NavigationButtons } from '../components/NavigationButtons';
import { useUserData } from '../hooks/useUserData';

// Define the Upgrade type
interface Upgrade {
  name: string;
  level: number;
  cost: number;
  productionRate: number;
  image: string; // Add other relevant properties if needed
}

const Page = () => {
  const { userData } = useUserData(); // Fetch user data from Telegram and MongoDB
  const initialGold = userData?.gold || 0;
  const initialUpgrades = userData?.upgrades || [];
  const initialPassiveIncome = userData?.passiveIncome || 0;

  // State for gold
  const [gold, setGold] = useState(initialGold);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(initialUpgrades); // Use Upgrade type here
  const [passiveIncome, setPassiveIncome] = useState(initialPassiveIncome);
  const [lastClaimed, setLastClaimed] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState<string>('');
  
  // State for daily reward claimed
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);

 useEffect(() => {
  const savedGold = localStorage.getItem('goldOreGold');
  const savedUpgrades = localStorage.getItem('goldOreUpgrades');

  if (savedGold) {
    setGold(Number(savedGold));
  }

  if (savedUpgrades) {
    const parsedUpgrades = JSON.parse(savedUpgrades);
    setUpgrades(parsedUpgrades);
    calculatePassiveIncome(parsedUpgrades);
  }

  const savedClaimDate = localStorage.getItem('lastClaimed');
  if (savedClaimDate) {
    const currentTime = Date.now(); // Add this line to define currentTime
    setLastClaimed(Number(savedClaimDate));
    setDailyRewardClaimed(currentTime - Number(savedClaimDate) < 24 * 60 * 60 * 1000); // Check if already claimed today
  }
}, []);

  // Save gold, upgrades, and last claimed date to local storage on change
  useEffect(() => {
    localStorage.setItem('goldOreGold', String(gold));
    localStorage.setItem('goldOreUpgrades', JSON.stringify(upgrades));
    localStorage.setItem('lastClaimed', String(lastClaimed));
  }, [gold, upgrades, lastClaimed]);

  const calculatePassiveIncome = (updatedUpgrades: Upgrade[]) => {
    const totalPassiveIncome = updatedUpgrades.reduce(
      (total, upgrade) => total + (upgrade.productionRate * upgrade.level),
      0
    );
    setPassiveIncome(totalPassiveIncome);
  };

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

  const claimDailyReward = () => {
    const currentTime = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (lastClaimed && currentTime - lastClaimed < oneDay) {
      alert("You've already claimed your daily reward today.");
      return;
    }

    const rewardAmount = 100; // Amount of gold to give as a daily reward
    setGold((prevGold) => prevGold + rewardAmount);
    setLastClaimed(currentTime);
    setDailyRewardClaimed(true); // Set the state to indicate reward has been claimed
    alert(`You have claimed your daily reward of ${rewardAmount} gold!`);
  };

  const generateReferralCode = () => {
    const code = Math.random().toString(36).substring(2, 8); // Generates a random code
    setReferralCode(code);
    // Optionally save the referral code to the user's data in MongoDB
    alert(`Your referral code is: ${code}`);
  };

  const redeemReferralBonus = () => {
    // Logic to redeem a referral bonus
    // Here you would check if the referral code is valid and if so, grant a bonus
    if (!referralCode) {
      alert("Please generate a referral code first.");
      return;
    }

    // Assume a fixed bonus for simplicity
    const referralBonus = 50; // Gold bonus for using referral code
    setGold((prevGold) => prevGold + referralBonus);
    alert(`You've redeemed your referral bonus of ${referralBonus} gold!`);
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="game-container max-w-md mx-auto p-6 bg-gray-100">
      <UserInfo userData={userData} gold={gold} passiveIncome={passiveIncome} />
      <GoldMine mineGold={mineGold} />
      <UpgradeList upgrades={upgrades} gold={gold} purchaseUpgrade={purchaseUpgrade} />
      <DailyReward claimDailyReward={claimDailyReward} dailyRewardClaimed={dailyRewardClaimed} /> {/* Pass the prop here */}
      <ReferralSystem referral={referralCode} generateReferralCode={generateReferralCode} redeemReferralBonus={redeemReferralBonus} />
      <NavigationButtons />
    </div>
  );
};

export default Page;