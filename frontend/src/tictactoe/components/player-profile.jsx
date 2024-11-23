/* eslint-disable react/prop-types */
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
          isCurrentTurn ? "animate-pulse" : ""
        }`}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center 
              ${player.symbol === "X" ? "bg-blue-600" : "bg-red-600"} 
              text-white font-bold`}
        >
          {getInitials(player.username)}
        </div>
        <div>
          <p className="text-green-300">{player.username}</p>
          {isCurrentTurn && (
            <span className="text-xs text-green-500">Your Turn</span>
          )}
        </div>
      </div>
    );
  };
  
  export default PlayerProfile;
  