/* eslint-disable react/prop-types */
import { Circle, X } from "lucide-react";

const GameBoard = ({
    board,
    handleSquareClick,
    currentPlayer,
    mySymbol,
    gameOver,
    winningLine,
  }) => {
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
          className={`pixel-box w-20 h-20 md:w-24 md:h-24 text-3xl font-bold 
            border-4 border-black bg-green-200 
            ${
              isClickable
                ? "hover:bg-yellow-200 cursor-pointer"
                : "cursor-default"
            }
            ${isWinningSquare ? "bg-green-200 animate-pulse" : ""}
            flex items-center justify-center`}
          onClick={() => handleSquareClick(index)}
          disabled={!isClickable}
        >
          {value === "X" && <X className="w-8 h-8 text-blue-800" />}
          {value === "O" && <Circle className="w-8 h-8 text-red-800" />}
        </button>
      );
    };
  
    return (
      <div className="grid grid-cols-3 gap-2 bg-black border-4 border-green-800 p-2 rounded-lg">
        {board.map((_, index) => renderSquare(index))}
      </div>
    );
  };
  
  export default GameBoard;
  