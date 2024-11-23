import useWebSocket from "react-use-websocket";

const WebSocketComponent = () => {
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:8080"
  );

  const wss = new WebSocket("ws://localhost:8080");

  wss.on("connection", (ws) => {
    console.log(ws);
  });
  return (
    <div className="flex flex-col  justify-center m-2">
      <div>
        <button
          className="bg-emerald-400 p-2 rounded-lg "
          onClick={() => sendMessage("hello server !")}
        >
          {" "}
          Send Message
        </button>
      </div>
      <div>
        Last message : {lastMessage ? lastMessage.data : "No messages yet"}
      </div>

      <div>Connection state: {readyState === 1 ? "Open" : "Closed"}</div>
    </div>
  );
};

export default WebSocketComponent;
