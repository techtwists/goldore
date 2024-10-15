import React from 'react';

interface DailyRewardProps {
  claimDailyReward: () => void;
  dailyRewardClaimed: boolean;
}

export const DailyReward: React.FC<DailyRewardProps> = ({ claimDailyReward, dailyRewardClaimed }) => (
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
);