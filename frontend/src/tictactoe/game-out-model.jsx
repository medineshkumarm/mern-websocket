/* eslint-disable react/prop-types */
import { Trophy, Frown, RefreshCw, LogOut } from "lucide-react";

const GameOutcomeModal = ({
  winner,
  currentUsername,
  players,
  onClose,
  onRematch,
}) => {
  const isCurrentUserWinner = winner === currentUsername;
  const otherPlayer = Object.values(players).find(
    (p) => p.username !== currentUsername
  )?.username;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-black border-4 border-green-800 p-8 rounded-lg text-center max-w-md w-full">
        {isCurrentUserWinner ? (
          <Trophy className="w-24 h-24 text-green-500 mx-auto mb-4 animate-bounce" />
        ) : (
          <Frown className="w-24 h-24 text-red-500 mx-auto mb-4 animate-pulse" />
        )}

        <h2 className="text-3xl mb-4 text-green-300">
          {isCurrentUserWinner ? "Victory!" : "Game Over"}
        </h2>

        <p className="text-green-400 mb-6">
          {isCurrentUserWinner
            ? `Congratulations! You defeated ${otherPlayer}.`
            : `${winner || "Nobody"} won the game.`}
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onRematch}
            className="flex items-center bg-green-700 text-white px-6 py-2 rounded hover:bg-green-600 transition"
          >
            <RefreshCw className="mr-2" /> Rematch
          </button>
          <button
            onClick={onClose}
            className="flex items-center bg-red-700 text-white px-6 py-2 rounded hover:bg-red-600 transition"
          >
            <LogOut className="mr-2" /> Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOutcomeModal;
