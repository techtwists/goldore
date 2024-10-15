'use client';

import { UserInfo } from '../components/UserInfo';
import { GoldMine } from '../components/GoldMine';
import { UpgradeList } from '../components/UpgradeList';
import { DailyReward } from '../components/DailyReward';
import { ReferralSystem } from '../components/../components/RefferalSystem';
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
  
  // Reset dailyRewardClaimed if lastClaimDate is not today
  const dailyRewardClaimed = userData?.dailyRewardClaimed || false;
  const shouldResetClaimed = lastClaimDate !== currentDate;
  
  // Handle the logic to reset claimed status if a new day has started
  if (shouldResetClaimed) {
    userData.dailyRewardClaimed = false; // Reset daily reward claim status
    userData.lastClaimDate = currentDate; // Update last claim date
  }

  const {
    gold,
    upgrades,
    passiveIncome,
    mineGold,
    purchaseUpgrade,
  } = useGoldOreGame(initialGold, initialUpgrades, initialPassiveIncome);

  const claimDailyReward = async() => {
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
    // Update the state with the new gold amount
    useUserData.setUserData(updatedData);

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
      <GoldMine mineGold={mineGold} />
      <UpgradeList upgrades={upgrades} gold={gold} purchaseUpgrade={purchaseUpgrade} />
      <DailyReward claimDailyReward={claimDailyReward} dailyRewardClaimed={dailyRewardClaimed} />
      <ReferralSystem referral={userData.referral} generateReferralCode={generateReferralCode} redeemReferralBonus={redeemReferralBonus} />
      <NavigationButtons />
    </div>
  );
};

export default Page;