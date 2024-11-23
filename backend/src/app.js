const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

class GameServer {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.server = http.createServer(this.app);
    this.io = this.setupSocketIO();
    this.rooms = {};
    this.activeUsers = new Map();
    this.challengeRequests = new Map();

    this.initializeSocketEvents();
  }

  setupMiddleware() {
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"]
    }));
    this.app.use(express.json());
  }

  setupSocketIO() {
    return new Server(this.server, {
      cors: { 
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST"]
      },
      pingTimeout: 60000,
      pingInterval: 25000
    });
  }

  initializeSocketEvents() {
    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("joinLobby", this.handleJoinLobby.bind(this, socket));
      socket.on("challengeUser", this.handleChallengeUser.bind(this, socket));
      socket.on("acceptChallenge", this.handleAcceptChallenge.bind(this, socket));
      socket.on("makeMove", this.handleMakeMove.bind(this, socket));
      socket.on("disconnect", this.handleDisconnect.bind(this, socket));
    });
  }

  handleJoinLobby(socket, { username }) {
    if (!username || typeof username !== "string") {
      return socket.emit("error", { message: "Invalid username" });
    }

    this.activeUsers.set(socket.id, { username, status: "available" });
    this.broadcastActiveUsers();
  }

  handleChallengeUser(socket, { challenger, target }) {
    if (!challenger || !target) {
      return socket.emit("error", { message: "Invalid challenge data" });
    }

    const targetSocket = this.findUserSocketByUsername(target);
    if (!targetSocket) {
      return socket.emit("error", { message: "Target user not found" });
    }

    if (this.activeUsers.get(targetSocket).status !== "available") {
      return socket.emit("error", { message: "Target user is not available" });
    }

    const challengeId = uuidv4();
    this.challengeRequests.set(challengeId, {
      challenger: { socketId: socket.id, username: challenger },
      target: { socketId: targetSocket, username: target },
    });

    this.io.to(targetSocket).emit("challengeReceived", {
      challengeId,
      challenger: { username: challenger },
    });
  }

  handleAcceptChallenge(socket, { challengeId }) {
    const challenge = this.challengeRequests.get(challengeId);
    if (!challenge) {
      return socket.emit("error", { message: "Challenge not found" });
    }

    const roomId = uuidv4();
    this.rooms[roomId] = {
      players: {
        X: challenge.challenger,
        O: challenge.target,
      },
      board: Array(9).fill(null),
      currentPlayer: "X",
    };

    this.activeUsers.delete(challenge.challenger.socketId);
    this.activeUsers.delete(challenge.target.socketId);

    const challengerSocket = this.io.sockets.sockets.get(challenge.challenger.socketId);
    const targetSocket = this.io.sockets.sockets.get(challenge.target.socketId);

    if (!challengerSocket || !targetSocket) {
      return socket.emit("error", { message: "One of the players is disconnected" });
    }

    challengerSocket.join(roomId);
    targetSocket.join(roomId);

    this.io.to(challenge.challenger.socketId).emit("startGame", {
      roomId,
      players: this.rooms[roomId].players,
      currentPlayer: "X",
      symbol: "X",
    });

    this.io.to(challenge.target.socketId).emit("startGame", {
      roomId,
      players: this.rooms[roomId].players,
      currentPlayer: "X",
      symbol: "O",
    });

    this.challengeRequests.delete(challengeId);
    this.broadcastActiveUsers();
  }

  handleMakeMove(socket, { roomId, index }) {
    const room = this.rooms[roomId];
    if (!room) {
      return socket.emit("error", { message: "Room not found" });
    }

    if (index < 0 || index > 8 || room.board[index] !== null) {
      return socket.emit("error", { message: "Invalid move" });
    }

    const playerSymbol = room.players.X.socketId === socket.id ? "X" : "O";
    if (playerSymbol !== room.currentPlayer) {
      return socket.emit("error", { message: "Not your turn" });
    }

    room.board[index] = playerSymbol;
    const winner = this.checkWinner(room.board);

    if (winner || room.board.every((cell) => cell !== null)) {
      const winnerUsername = winner ? room.players[winner].username : null;

      this.io.to(roomId).emit("gameOver", {
        winner: winnerUsername || "Draw",
        board: room.board,
      });

      delete this.rooms[roomId];
      this.broadcastActiveUsers();
    } else {
      room.currentPlayer = room.currentPlayer === "X" ? "O" : "X";
      this.io.to(roomId).emit("moveMade", {
        board: room.board,
        currentPlayer: room.currentPlayer,
      });
    }
  }

  handleDisconnect(socket) {
    const user = this.activeUsers.get(socket.id);
    if (user) {
      Object.entries(this.rooms).forEach(([roomId, room]) => {
        if (room.players.X.socketId === socket.id || room.players.O.socketId === socket.id) {
          const otherPlayerSocket = 
            room.players.X.socketId === socket.id 
              ? room.players.O.socketId 
              : room.players.X.socketId;

          this.io.to(roomId).emit("playerLeft", { username: user.username });
          delete this.rooms[roomId];
        }
      });

      this.activeUsers.delete(socket.id);
      this.broadcastActiveUsers();
    }
  }

  findUserSocketByUsername(username) {
    for (const [socketId, user] of this.activeUsers.entries()) {
      if (user.username === username) return socketId;
    }
    return null;
  }

  broadcastActiveUsers() {
    const usersList = Array.from(this.activeUsers.values()).map((user) => ({
      username: user.username,
      status: user.status,
    }));
    this.io.emit("activeUsers", usersList);
  }

  checkWinner(board) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  }

  start(port = 4000) {
    this.server.listen(port, () => {
      console.log(`Game server running on port ${port}`);
    });
  }
}

const gameServer = new GameServer();
gameServer.start();

module.exports = GameServer;