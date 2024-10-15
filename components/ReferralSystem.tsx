import React from 'react';

interface ReferralSystemProps {
  referral: Referral | null;
  generateReferralCode: () => void;
  redeemReferralBonus: () => void;
}

export const ReferralSystem: React.FC<ReferralSystemProps> = ({ referral, generateReferralCode, redeemReferralBonus }) => (
  <div className="referral-system bg-white p-4 rounded shadow mb-4">
    <h2 className="text-xl font-bold mb-2">Referral System</h2>
    {referral ? (
      <>
        <p>Your Referral Code: <strong>{referral.code}</strong></p>
        <p>Referred Friends: <strong>{referral.referredFriends}</strong></p>
        <p>Referral Bonus: <strong>{referral.bonus}</strong> Gold</p>
        <button className="redeem-bonus-button bg-blue-500 text-white font-bold py-2 px-4 rounded-full shadow" onClick={redeemReferralBonus}>
          Redeem Bonus
        </button>
      </>
    ) : (
      <button className="generate-code-button bg-green-500 text-white font-bold py-2 px-4 rounded-full shadow" onClick={generateReferralCode}>
        Generate Referral Code
      </button>
    )}
  </div>
);