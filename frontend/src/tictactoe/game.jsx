import React, { useState, useEffect } from "react";
import socket from "./socket";

const Game = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [players, setPlayers] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [winner, setWinner] = useState(null);

  // Function to handle room join
  const joinRoom = () => {
    if (!roomId || !username)
      return alert("Room ID and Username are required!");
    socket.emit("joinRoom", { roomId, username });
    setInRoom(true);
  };

  // Function to handle a player's move
  const handleMove = (index) => {
    if (board[index] === null && currentPlayer === socket.id) {
      socket.emit("makeMove", { roomId, index });
    }
  };

  useEffect(() => {
    socket.on("startGame", ({ players, currentPlayer }) => {
      setPlayers(players);
      setCurrentPlayer(currentPlayer);
      setWaiting(false);
    });

    socket.on("moveMade", ({ board, currentPlayer }) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
    });

    socket.on("waitingForOpponent", (message) => {
      setWaiting(true);
    });

    socket.on("gameOver", ({ winner }) => {
      setWinner(winner);
    });

    socket.on("playerLeft", ({ username }) => {
      alert(`${username} has left the game.`);
    });

    return () => socket.off();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!inRoom ? (
        <div className="p-4">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 border rounded mb-2"
          />
          <button
            onClick={joinRoom}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="text-center">
          {waiting ? (
            <p className="text-lg font-bold">Waiting for an opponent...</p>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">Tic-Tac-Toe</h1>

              {/* Player names and Turn indicator */}
              <div className="flex justify-between items-center w-full px-4 mb-4">
                {/* Player A's Name */}
                <div
                  className={`w-1/3 p-2 text-center font-semibold rounded ${
                    currentPlayer === players[Object.keys(players)[0]]?.symbol
                      ? "bg-green-700 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {players[Object.keys(players)[0]]?.username}
                </div>
                {/* Current Player Turn Indicator */}
                <div
                  className={`w-1/3 p-2 text-center font-semibold ${
                    currentPlayer === socket.id
                      ? "bg-green-700 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  Your Turn
                </div>
                {/* Player B's Name */}
                <div
                  className={`w-1/3 p-2 text-center font-semibold rounded ${
                    currentPlayer === players[Object.keys(players)[1]]?.symbol
                      ? "bg-green-700 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {players[Object.keys(players)[1]]?.username}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 w-48 mx-auto">
                {board.map((cell, index) => (
                  <div
                    key={index}
                    onClick={() => handleMove(index)}
                    className={`w-16 h-16 flex items-center justify-center border bg-gray-200 text-xl font-bold ${
                      board[index] ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    {cell}
                  </div>
                ))}
              </div>

              {winner && (
                <p className="mt-4 text-lg font-bold">Winner: {winner}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
