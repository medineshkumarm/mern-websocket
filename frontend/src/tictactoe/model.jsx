import React from 'react';
import Confetti from 'react-confetti';
import { Trophy, Medal, PartyPopper } from 'lucide-react';

const WinnerModal = ({ winner, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Confetti 
        width={window.innerWidth} 
        height={window.innerHeight}
        recycle={false}
      />
      <div className="bg-white p-8 rounded-lg text-center relative pixel-border ">
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose} 
            className="text-xl font-bold text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
        
        <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-4xl font-bold mb-4 text-green-600">
          Congratulations!
        </h2>
        <p className="text-3xl mb-6">{winner} Wins!</p>
        
        <div className="flex justify-center space-x-4">
          <div className="bg-yellow-100 p-4 rounded-lg flex flex-col items-center">
            <Medal className="w-16 h-16 text-yellow-600" />
            <span className="mt-2 font-semibold">Champion</span>
          </div>
          <div className="bg-green-100 p-4 rounded-lg flex flex-col items-center">
            <PartyPopper className="w-16 h-16 text-green-600" />
            <span className="mt-2 font-semibold">Victorious</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;