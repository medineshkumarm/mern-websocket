const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });
const crypto = require("crypto");
const clients = new Set();

server.on("connection", (ws) => {
  clients.add(ws);
  console.log("Client connected ...");

  ws.on("message", (msg) => {
    console.log(`Recieved ${msg}`);
  
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log(`Sending message to client: ${msg}`);
        client.send(msg);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
