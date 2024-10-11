import WebApp from '@twa-dev/sdk';
import { useEffect, useState } from 'react';

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

interface Upgrade {
  name: string;
  level: number;
  cost: number;
  productionRate: number;
  image: string;
}

interface Referral {
  code: string;
  referredFriends: number;
  bonus: number;
}

export default function GoldOreGame() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [gold, setGold] = useState<number>(0);
  const [passiveIncome, setPassiveIncome] = useState<number>(0);
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      name: 'Pickaxe',
      level: 1,
      cost: 10,
      productionRate: 1,
      image: '/images/pickaxe.png',
    },
    {
      name: 'Excavator',
      level: 0,
      cost: 100,
      productionRate: 10,
      image: '/images/excavator.png',
    },
    {
      name: 'Solar Panel',
      level: 0,
      cost: 500,
      productionRate: 50,
      image: '/images/solar-panel.png',
    },
    {
      name: 'AI Robots',
      level: 0,
      cost: 1000,
      productionRate: 100,
      image: '/images/ai-robots.png',
    },
    {
      name: 'Space Mining',
      level: 0,
      cost: 5000,
      productionRate: 500,
      image: '/images/space-mining.png',
    },
  ]);
  const [referral, setReferral] = useState<Referral | null>(null);
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState<boolean>(false);

  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      const user = WebApp.initDataUnsafe.user as UserData;
      setUserData(user);
      loadUserData(user.id); // Load user data from MongoDB on initial load
    }

    // Expand to full screen
    WebApp.expand();

    // Calculate passive income every second
    const passiveIncomeInterval = setInterval(() => {
      setGold((prevGold) => prevGold + passiveIncome);
    }, 1000);

    return () => clearInterval(passiveIncomeInterval);
  }, [passiveIncome]);

  const loadUserData = async (userId: number) => {
    try {
      const res = await fetch(`../api/getUserData?id=${userId}`);
      const data = await res.json();
      if (data.user) {
        setGold(data.user.gameProgress.gold || 0);
        setUpgrades(data.user.gameProgress.upgrades || upgrades);
        setPassiveIncome(data.user.gameProgress.passiveIncome || 0);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveUserData = async (user: UserData) => {
    const gameProgress = {
      gold,
      passiveIncome,
      upgrades,
    };
    
    try {
      const res = await fetch('../api/saveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, gameProgress }),
      });
      const data = await res.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const mineGold = () => {
    setGold((prevGold) => {
      const newGold = prevGold + 1;
      saveUserData(userData!); // Save progress after mining
      return newGold;
    });
  };

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
      saveUserData(userData!); // Save progress after upgrade
    }
  };

  const calculatePassiveIncome = (updatedUpgrades: Upgrade[]) => {
    const totalPassiveIncome = updatedUpgrades.reduce(
      (total, upgrade) => total + upgrade.productionRate * upgrade.level,
      0
    );
    setPassiveIncome(totalPassiveIncome);
  };

  const claimDailyReward = () => {
    if (!dailyRewardClaimed) {
      setGold((prevGold) => {
        const newGold = prevGold + 100; // Reward 100 gold
        saveUserData(userData!); // Save progress after claiming reward
        return newGold;
      });
      setDailyRewardClaimed(true);
      setTimeout(() => setDailyRewardClaimed(false), 86400000); // Reset after 24 hours
    }
  };

  const generateReferralCode = () => {
    setReferral({ code: 'REF123', referredFriends: 0, bonus: 0 });
  };

  const redeemReferralBonus = () => {
    if (referral) {
      setGold((prevGold) => {
        const newGold = prevGold + referral.bonus; // Redeem the bonus from referrals
        saveUserData(userData!); // Save progress after redeeming bonus
        return newGold;
      });
    }
  };

  return (
    <main className="p-4 bg-gray-100 min-h-screen">
      {/* Top area: User Info */}
      {userData ? (
        <div className="user-info bg-white p-4 rounded shadow mb-4">
          <h1 className="text-2xl font-bold">Welcome, {userData.first_name}!</h1>
          <p className="text-gray-600">Total Gold: {gold}</p>
          <p className="text-gray-600">Passive Income: {passiveIncome} gold/second</p>
        </div>
      ) : (
        <div>Loading user data...</div>
      )}

      {/* Middle area: Gold Mining */}
      <div className="gold-mine bg-yellow-100 p-6 rounded shadow mb-4">
        <h2 className="text-xl font-bold mb-2">Gold Mine</h2>
        <button
          className="mine-button bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full shadow-md"
          onClick={mineGold}
        >
          Mine Gold
        </button>
      </div>

      {/* Technology upgrades */}
      <div className="technology-upgrades bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-bold mb-2">Upgrades</h2>
        <ul>
          {upgrades.map((upgrade, index) => (
            <li
              key={index}
              className="flex items-center justify-between mb-2 p-2 border rounded"
            >
              <div className="flex items-center">
                <img src={upgrade.image} alt={upgrade.name} className="w-8 h-8 mr-2" />
                <span>
                  {upgrade.name} (Level {upgrade.level})
                </span>
              </div>
              <button
                className="bg-green-500 text-white font-bold py-1 px-3 rounded-full shadow"
                onClick={() => purchaseUpgrade(index)}
                disabled={gold < upgrade.cost}
              >
                Upgrade for {upgrade.cost} Gold
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Daily reward system */}
      <div className="daily-reward bg-yellow-100 p-4 rounded shadow mb-4">
        <h2 className="text-xl font-bold mb-2">Daily Reward</h2>
        <button
          className="reward-button bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow"
          onClick={claimDailyReward}
          disabled={dailyRewardClaimed}
        >
          {dailyRewardClaimed ? 'Already Claimed' : 'Claim 100 Gold'}
        </button>
      </div>

      {/* Referral system */}
      <div className="referral-system bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-bold mb-2">Referral System</h2>
        {referral ? (
          <>
            <p>Your Referral Code: <strong>{referral.code}</strong></p>
            <p>Referred Friends: <strong>{referral.referredFriends}</strong></p>
            <p>Referral Bonus: <strong>{referral.bonus}</strong> Gold</p>
            <button
              className="redeem-bonus-button bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow"
              onClick={redeemReferralBonus}
            >
              Redeem Bonus
            </button>
          </>
        ) : (
          <button
            className="generate-code-button bg-green-500 text-white font-bold py-2 px-4 rounded-full shadow"
            onClick={generateReferralCode}
          >
            Generate Referral Code
          </button>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="navigation bg-gray-200 p-4 rounded shadow mt-4 flex justify-around">
        <button className="nav-button bg-gray-800 text-white font-bold py-2 px-4 rounded-full">
          Mine
        </button>
        <button className="nav-button bg-gray-800 text-white font-bold py-2 px-4 rounded-full">
          Technology
        </button>
        <button className="nav-button bg-gray-800 text-white font-bold py-2 px-4 rounded-full">
          Referral
        </button>
        <button className="nav-button bg-gray-800 text-white font-bold py-2 px-4 rounded-full">
          Payment
        </button>
      </div>
    </main>
  );
}