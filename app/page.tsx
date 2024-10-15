'use client';

import { useEffect, useState } from 'react';
import { UserInfo } from '../components/UserInfo';
import { GoldMine } from '../components/GoldMine';
import { UpgradeList } from '../components/UpgradeList';
import { DailyReward } from '../components/DailyReward';
import { ReferralSystem } from '../components/ReferralSystem';
import { NavigationButtons } from '../components/NavigationButtons';
import { useGoldOreGame } from '../hooks/useGoldOreGame';
import { useUserData } from '../hooks/useUserData';
import WebApp from '@twa-dev/sdk'; // Assuming you're using Telegram WebApp SDK

const Page = () => {
  const userId = 12345; // Telegram user ID from context or authentication
  const { userData } = useUserData(userId);

  // Game state (initial data can be fetched from userData or server)
  const initialGold = userData?.gold || 0;
  const initialUpgrades = userData?.upgrades || [];
  const initialPassiveIncome = userData?.passiveIncome || 0;

  const {
    gold,
    upgrades,
    passiveIncome,
    mineGold,
    purchaseUpgrade,
  } = useGoldOreGame(initialGold, initialUpgrades, initialPassiveIncome);

  const claimDailyReward = () => {
    // Handle claiming the daily reward (e.g., update state and server)
  };

  const generateReferralCode = () => {
    // Generate referral code and save to user data
  };

  const redeemReferralBonus = () => {
    // Handle redeeming the referral bonus
  };

  useEffect(() => {
    WebApp.init(); // Initialize Telegram WebApp SDK if necessary
  }, []);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="game-container max-w-md mx-auto p-6 bg-gray-100">
      <UserInfo userData={userData} gold={gold} passiveIncome={passiveIncome} />
      <GoldMine mineGold={mineGold} />
      <UpgradeList upgrades={upgrades} gold={gold} purchaseUpgrade={purchaseUpgrade} />
      <DailyReward claimDailyReward={claimDailyReward} dailyRewardClaimed={userData.dailyRewardClaimed} />
      <ReferralSystem referral={userData.referral} generateReferralCode={generateReferralCode} redeemReferralBonus={redeemReferralBonus} />
      <NavigationButtons />
    </div>
  );
};

export default Page;