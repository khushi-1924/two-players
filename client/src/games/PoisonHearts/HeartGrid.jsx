import React from "react";
import { TiHeart } from "react-icons/ti";
import PlayAgainButton from "../../components/PlayAgain/PlayAgainButton";

const colorClasses = {
  gray: "text-gray-400",
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  green: "text-green-400",
  pink: "text-pink-400",
  blue: "text-blue-400",
  orange: "text-orange-400",
  yellow: "text-yellow-400",
};

const HeartGrid = ({
  board,
  phase,
  currentPlayer,
  playerNumber,
  myPoisonHeart,
  explodingHeart,
  selectedHearts,
  onPoisonChoice,
  onHeartSelect,
  onPlayAgain,
  waitingForResponse,
  winner,
  isDraw,
}) => {
  if (!board || board.length === 0) {
    return null;
  }

  const handleClick = (heartId) => {
    // Poison selection phase
    if (phase === "poisonSelection") {
      // Player has already chosen their poison heart
      if (myPoisonHeart !== null) return;

      onPoisonChoice(heartId);
      return;
    }

    // Normal playing phase
    if (phase === "playing") {
      // Not this player's turn
      if (currentPlayer !== playerNumber) return;

      onHeartSelect(heartId);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* HEART GRID */}
      <div className="heart-grid">
        {board.flat().map((heart) => {
          const isSelected =
            heart.selected || selectedHearts.includes(heart.id);

          const isMyPoison = myPoisonHeart === heart.id;

          const isExploding = explodingHeart === heart.id;

          const isDisabled =
            phase === "finished" ||
            isSelected ||
            (phase === "poisonSelection" && myPoisonHeart !== null) ||
            (phase === "playing" && currentPlayer !== playerNumber);

          return (
            <button
              key={heart.id}
              className={`heart ${
                isSelected ? "heart-selected" : ""
              } ${isMyPoison ? "heart-poison" : ""} ${
                isExploding ? "heart-exploding" : ""
              }`}
              onClick={() => handleClick(heart.id)}
              disabled={isDisabled}
            >
              {isExploding ? (
                <span className="explosion-mark">💥</span>
              ) : (
                <TiHeart
                  className={`heart-icon ${
                    colorClasses[heart.color] || "text-gray-400"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* PLAY AGAIN */}
      {(winner !== null || isDraw) && (
        <PlayAgainButton
          onClick={onPlayAgain}
          waitingForResponse={waitingForResponse}
        />
      )}
    </div>
  );
};

export default HeartGrid;