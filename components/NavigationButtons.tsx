import React from 'react';

export const NavigationButtons: React.FC = () => (
  <div className="navigation bg-gray-200 p-4 rounded shadow mt-4 flex justify-around">
    <button className="nav-button bg-gray-800 text-white font-bold py-2 px-4 rounded-full">Mine</button>
    <button className="nav-button bg-gray-800 text-white font-bold py-2 px-4 rounded-full">Technology</button>
    <button className="nav-button bg-gray-800 text-white font-bold py-2 px-4 rounded-full">Referral</button>
    <button className="nav-button bg-gray-800 text-white font-bold py-2 px-4 rounded-full">Payment</button>
  </div>
);