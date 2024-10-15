'use client';

import { useState, useEffect } from 'react';
import { UserInfo } from '../components/UserInfo';
import { GoldMine } from '../components/GoldMine';
import { UpgradeList } from '../components/UpgradeList';
import { DailyReward } from '../components/DailyReward';
import { ReferralSystem } from '../components/RefferalSystem';
import { NavigationButtons } from '../components/NavigationButtons';
import { useGoldOreGame } from '../hooks/useGoldOreGame';
import { useUserData } from '../hooks/useUserData';

const Page = () => {
  const { userData } = useUserData(); // Fetch user data from Telegram and MongoDB
  const initialGold = userData?.gold || 0;
  const initialUpgrades = userData?.upgrades || [];
  const initialPassiveIncome = userData?.passiveIncome || 0;
  const lastClaimDate = userData?.lastClaimDate || '';
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  // State for gold
  const [gold, setGold] = useState(initialGold);

  // Load from local storage and set state
  useEffect(() => {
    const savedGold = localStorage.getItem('goldOreGold');
    const savedUpgrades = localStorage.getItem('goldOreUpgrades');

    if (savedGold) {
      setGold(Number(savedGold));
    }

    if (savedUpgrades) {
      // Initialize upgrades based on local storage
      setUpgrades(JSON.parse(savedUpgrades));
      calculatePassiveIncome(JSON.parse(savedUpgrades));
    }
  }, []);

  // Save gold and upgrades to local storage on change
  useEffect(() => {
    localStorage.setItem('goldOreGold', String(gold));
    localStorage.setItem('goldOreUpgrades', JSON.stringify(upgrades));
  }, [gold, upgrades]);

  const {
    upgrades,
    passiveIncome,
    mineGold,
    purchaseUpgrade,
  } = useGoldOreGame(gold, initialUpgrades, initialPassiveIncome);

  const claimDailyReward = () => {
    // Your existing daily reward logic
  };

  const generateReferralCode = () => {
    // Generate and save referral code logic here
  };

  const redeemReferralBonus = () => {
    // Redeem referral bonus logic here
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="game-container max-w-md mx-auto p-6 bg-gray-100">
      <UserInfo userData={userData} gold={gold} passiveIncome={passiveIncome} />
      <GoldMine mineGold={() => mineGold(setGold)} />
      <UpgradeList upgrades={upgrades} gold={gold} purchaseUpgrade={(index) => purchaseUpgrade(index, gold, setGold)} />
      <DailyReward claimDailyReward={claimDailyReward} dailyRewardClaimed={dailyRewardClaimed} />
      <ReferralSystem referral={userData.referral} generateReferralCode={generateReferralCode} redeemReferralBonus={redeemReferralBonus} />
      <NavigationButtons />
    </div>
  );
};

export default Page;