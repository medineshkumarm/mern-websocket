/* eslint-disable react/prop-types */
const Lobby = ({ onJoin }) => {
  const handleJoinClick = () => {
    const username = prompt("Enter your username:");
    if (username) {
      onJoin(username);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <button
        onClick={handleJoinClick}
        className="pixel-button px-6 py-3 bg-emerald-900 text-green-100 rounded-md font-semibold"
      >
        Join Lobby
      </button>
    </div>
  );
};

export default Lobby;
