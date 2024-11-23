/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import RadarLobby from "./radar-lobby";
import GameOutcomeModal from "./game-out-model";
import { AlertTriangle, Circle, UserCircle2, X } from "lucide-react";

const Game2 = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [inGame, setInGame] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [players, setPlayers] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [mySymbol, setMySymbol] = useState(null);
  const [challengeRequest, setChallengeRequest] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [rematchRequested, setRematchRequested] = useState(false);

  // PlayerProfile Component
  const PlayerProfile = ({ player, isCurrentTurn }) => {
    const getInitials = (name) =>
      name
        ? name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "?";

    return (
      <div
        className={`flex items-center space-x-2 ${
          isCurrentTurn ? "border-4 border-green-500 rounded-lg p-2" : ""
        }`}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            player?.symbol === "X" ? "bg-blue-600" : "bg-red-600"
          } text-white font-bold`}
        >
          {getInitials(player?.username)}
        </div>
        <div>
          <p className="text-green-300">{player?.username}</p>
          {isCurrentTurn && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-green-500">Your Turn</span>
              <span className="animate-ping h-2 w-2 bg-green-500 rounded-full"></span>
            </div>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const newSocket = io("http://localhost:4000", { reconnectionAttempts: 3 });
    setSocket(newSocket);

    newSocket.on("connect_error", () =>
      alert("Failed to connect to the server.")
    );

    newSocket.on("activeUsers", (users) => setActiveUsers(users || []));

    newSocket.on("challengeReceived", ({ challengeId, challenger }) => {
      if (challengeId && challenger) {
        setChallengeRequest({ challengeId, challenger });
      }
    });

    newSocket.on("challengeDeclined", ({ target, challenger }) => {
      alert(`${target} declined the challenge from ${challenger}.`);
    });

    newSocket.on("startGame", ({ roomId, players, currentPlayer, symbol }) => {
      if (roomId && players && currentPlayer && symbol) {
        setPlayers(players);
        setCurrentPlayer(currentPlayer);
        setInGame(true);
        setRoomId(roomId);
        setMySymbol(symbol);
        setBoard(Array(9).fill(null));
        setGameOver(false);
        setWinner(null);
        setWinningLine(null);
        setChallengeRequest(null);
        setRematchRequested(false);
      }
    });

    newSocket.on("moveMade", ({ board, currentPlayer }) => {
      if (board && currentPlayer) {
        setBoard(board);
        setCurrentPlayer(currentPlayer);
      }
    });

    newSocket.on("gameOver", ({ winner, board, winningLine }) => {
      if (board) {
        setBoard(board);
        setGameOver(true);
        setWinner(winner);
        setWinningLine(winningLine || null);
      }
    });

    newSocket.on("playerLeft", ({ username }) => {
      if (username) {
        alert(`${username} left the game!`);
        resetGame();
      }
    });

    newSocket.on("disconnect", () => {
      setSocket(null);
      resetGame();
      alert("Disconnected from the server.");
    });

    return () => newSocket.disconnect();
  }, []);

  const handleJoinLobby = () => {
    const inputUsername = prompt("Enter your username:");
    if (inputUsername?.trim()) {
      setUsername(inputUsername.trim());
      socket.emit("joinLobby", { username: inputUsername.trim() });
    } else {
      alert("Invalid username. Please try again.");
    }
  };

  const handleChallengeUser = (targetUser) => {
    if (targetUser?.username === username) {
      alert("You cannot challenge yourself!");
      return;
    }
    socket.emit("challengeUser", {
      challenger: username,
      target: targetUser?.username,
    });
  };

  const handleChallengeResponse = (accept) => {
    if (accept && challengeRequest?.challengeId) {
      socket.emit("acceptChallenge", {
        challengeId: challengeRequest.challengeId,
      });
    } else {
      socket.emit("declineChallenge", {
        challengeId: challengeRequest?.challengeId,
        challenger: challengeRequest?.challenger?.username,
      });
      setChallengeRequest(null);
    }
  };

  const handleSquareClick = (index) => {
    if (!socket || board[index] || gameOver) return;

    const isMyTurn =
      (mySymbol === "X" && currentPlayer === "X") ||
      (mySymbol === "O" && currentPlayer === "O");

    if (!isMyTurn) return;

    socket.emit("makeMove", { roomId, index });
  };

  const handleRematch = () => {
    if (socket && !rematchRequested) {
      setRematchRequested(true);
      socket.emit("requestRematch", { roomId, username });
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setWinner(null);
    setInGame(false);
    setCurrentPlayer(null);
    setMySymbol(null);
    setWinningLine(null);
    setRematchRequested(false);
    socket?.emit("returnToLobby", { username });
  };

  const renderSquare = (index) => {
    const value = board[index];
    const isClickable =
      !gameOver &&
      !board[index] &&
      ((mySymbol === "X" && currentPlayer === "X") ||
        (mySymbol === "O" && currentPlayer === "O"));

    const isWinningSquare = winningLine && winningLine.includes(index);

    return (
      <button
        key={index}
        className={`pixel-box w-20 h-20 md:w-24 md:h-24 text-3xl font-bold border-4 border-black bg-green-200 ${
          isClickable ? "hover:bg-yellow-200 cursor-pointer" : "cursor-default"
        } ${
          isWinningSquare ? "bg-green-200 animate-pulse" : ""
        } flex items-center justify-center`}
        onClick={() => handleSquareClick(index)}
        disabled={!isClickable}
      >
        {value === "X" && <X className="w-8 h-8 text-blue-800" />}
        {value === "O" && <Circle className="w-8 h-8 text-red-800" />}
      </button>
    );
  };

  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <button
          onClick={handleJoinLobby}
          className="pixel-button px-6 py-3 bg-emerald-900 text-green-100 rounded-md font-semibold"
        >
          Join Lobby
        </button>
      </div>
    );
  }

  if (challengeRequest) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black pixel-border">
        <div className="bg-green-800 p-8 rounded-lg shadow-lg text-center pixel-border text-white font-semibold border-2">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl mb-4">
            Challenge from {challengeRequest.challenger.username}
          </h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleChallengeResponse(true)}
              className="pixel-button bg-green-500 text-white px-6 py-2"
            >
              Accept
            </button>
            <button
              onClick={() => handleChallengeResponse(false)}
              className="pixel-button bg-red-500 text-white px-6 py-2"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!inGame) {
    return (
      <RadarLobby
        activeUsers={activeUsers}
        onChallengeUser={handleChallengeUser}
        username={username}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div className="absolute top-4 right-4">
        <UserCircle2 className="w-10 h-10 text-green-300" />
        <p className="text-green-400 text-sm">{username}</p>
      </div>

      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl mb-6 text-green-300">Tic Tac Toe</h1>

        <div className="flex justify-between w-full max-w-md mb-6">
          <PlayerProfile
            player={{ ...players.X, symbol: "X" }}
            isCurrentTurn={currentPlayer === "X"}
          />
          <PlayerProfile
            player={{ ...players.O, symbol: "O" }}
            isCurrentTurn={currentPlayer === "O"}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 bg-black border-4 border-green-800 p-2 rounded-lg">
          {board.map((_, index) => renderSquare(index))}
        </div>

        {gameOver && (
          <GameOutcomeModal
            winner={winner}
            currentUsername={username}
            players={players}
            onClose={resetGame}
            onRematch={handleRematch}
            rematchRequested={rematchRequested}
          />
        )}
      </div>
    </div>
  );
};

export default Game2;
