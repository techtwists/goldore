'use client';

import { UserInfo } from '../components/UserInfo';
import { GoldMine } from '../components/GoldMine';
import { UpgradeList } from '../components/UpgradeList';
import { DailyReward } from '../components/DailyReward';
import { ReferralSystem } from '../components/ReferralSystem'; // Fixed path to ReferralSystem
import { NavigationButtons } from '../components/NavigationButtons';
import { useGoldOreGame } from '../hooks/useGoldOreGame';
import { useUserData } from '../hooks/useUserData';
import { useEffect } from 'react';

const Page = () => {
  const { userData, setUserData } = useUserData(); // Fetch user data from Telegram and MongoDB
  
  // Ensure userData is available before proceeding
  if (!userData) return <p>Loading...</p>;

  const initialGold = userData?.gold || 0;
  const initialUpgrades = userData?.upgrades || [];
  const initialPassiveIncome = userData?.passiveIncome || 0;

  // Check if the daily reward can be claimed
  const lastClaimDate = userData?.lastClaimDate || '';
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  // Determine if the daily reward has already been claimed today
  const dailyRewardClaimed = userData?.dailyRewardClaimed || false;
  const shouldResetClaimed = lastClaimDate !== currentDate;

  // Handle the logic to reset claimed status if a new day has started
  useEffect(() => {
    if (shouldResetClaimed) {
      userData.dailyRewardClaimed = false; // Reset daily reward claim status
      userData.lastClaimDate = currentDate; // Update last claim date
      setUserData({ ...userData }); // Update state to trigger re-render
    }
  }, [shouldResetClaimed, currentDate, userData, setUserData]);

  const {
    gold,
    upgrades,
    passiveIncome,
    mineGold,
    purchaseUpgrade,
  } = useGoldOreGame(initialGold, initialUpgrades, initialPassiveIncome);

  const claimDailyReward = () => {
    if (dailyRewardClaimed) {
      alert('You have already claimed your daily reward for today.');
      return; // Prevent claiming if already claimed
    }

    const newGold = gold + 100; // Daily reward of 100 gold
    const updatedData = {
      ...userData,
      gold: newGold,
      dailyRewardClaimed: true,
      lastClaimDate: currentDate // Update the last claim date
    };

    setUserData(updatedData); // Update state with new user data
  };

  const generateReferralCode = () => {
    // Generate and save referral code logic here
  };

  const redeemReferralBonus = () => {
    // Redeem referral bonus logic here
  };

  return (
    <div className="game-container max-w-md mx-auto p-6 bg-gray-100">
      <UserInfo userData={userData} gold={gold} passiveIncome={passiveIncome} />
      <GoldMine mineGold={mineGold} />
      <UpgradeList upgrades={upgrades} gold={gold} purchaseUpgrade={purchaseUpgrade} />
      <DailyReward claimDailyReward={claimDailyReward} dailyRewardClaimed={dailyRewardClaimed} />
      <ReferralSystem referral={userData.referral} generateReferralCode={generateReferralCode} redeemReferralBonus={redeemReferralBonus} />
      <NavigationButtons />
    </div>
  );
};

export default Page;