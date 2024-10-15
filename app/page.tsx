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

  const {
    gold,
    upgrades,
    passiveIncome,
    mineGold,
    purchaseUpgrade,
  } = useGoldOreGame(initialGold, initialUpgrades, initialPassiveIncome);

  const claimDailyReward = () => {
    const newGold = gold + 100; // Reward is 100 gold
    const updatedData = { ...userData, gold: newGold, dailyRewardClaimed: true };
    localStorage.setItem('goldOreUserData', JSON.stringify(updatedData));
    // Update gold in MongoDB
    saveGold(newGold);
  };

  const generateReferralCode = () => {
    // Generate and save referral code logic here
  };

  const redeemReferralBonus = () => {
    // Redeem referral bonus logic here
  };

  const saveGold = async (newGold: number) => {
    try {
      await fetch('/api/updateGold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userData?.id, gold: newGold }),
      });
    } catch (error) {
      console.error('Error updating gold:', error);
    }
  };

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