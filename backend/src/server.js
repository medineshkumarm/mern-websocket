const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", (ws) => {
  console.log("Client connected ...");

  ws.on("message", (msg) => {
    console.log(`Recieved ${msg}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
