/* eslint-disable react/prop-types */
import { Users } from "lucide-react";

const RadarLobby = ({ activeUsers, onChallengeUser, username }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 font-mono p-4 relative">
      {/* Concentric Circles Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-64 h-64 lg:w-96 lg:h-96 border-4 border-green-800 rounded-full animate-ping-slow opacity-50"></div>
        <div className="absolute w-48 h-48 lg:w-72 lg:h-72 border-4 border-green-700 rounded-full animate-ping-slow-2 opacity-50"></div>
        <div className="absolute w-28 h-28 lg:w-56 lg:h-56 border-4 border-green-500 rounded-full animate-ping-slow-3 opacity-50"></div>
        <div className="absolute w-32 h-32 lg:w-44 lg:h-44 border-4 border-green-600 rounded-full animate-ping-slow-3 opacity-50"></div>
      </div>

      <div className="z-10 text-center">
        <h2 className="text-3xl mb-6 text-green-300">Lobby: {username}</h2>

        {activeUsers.length === 0 ? (
          <div className="bg-black border border-green-800 p-4 rounded-lg">
            <p className="text-yellow-500">
              No players available to challenge.
            </p>
            <p className="text-green-600 mt-2">
              Waiting for other players to join...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeUsers
              .filter((user) => user.username !== username)
              .map((user) => (
                <div
                  key={user.username}
                  className="bg-black border border-green-800 p-4 rounded-lg flex items-center justify-between hover:bg-green-900 transition"
                >
                  <div className="flex items-center">
                    <Users className="w-6 h-6 mr-2 text-green-400" />
                    <span>{user.username}</span>
                  </div>
                  <button
                    onClick={() => onChallengeUser(user)}
                    className="pixel-button bg-green-700 text-green-200 px-3 py-1 rounded"
                  >
                    Challenge
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RadarLobby;
