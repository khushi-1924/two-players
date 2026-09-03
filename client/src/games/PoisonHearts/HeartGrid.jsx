import React from "react";
import { TiHeart } from "react-icons/ti";

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
  selectedHearts,
  onPoisonChoice,
  onHeartSelect,
}) => {
  if (!board || board.length === 0) {
    return null;
  }

  const handleClick = (heartId) => {
    if (phase === "poisonSelection") {
      if (myPoisonHeart !== null) return;

      onPoisonChoice(heartId);
      return;
    }

    if (phase === "playing") {
      if (currentPlayer !== playerNumber) return;

      onHeartSelect(heartId);
    }
  };

  return (
    <div className="heart-grid">
      {board.flat().map((heart) => {
        const isSelected =
          heart.selected || selectedHearts.includes(heart.id);

        const isMyPoison =
          phase === "poisonSelection" &&
          myPoisonHeart === heart.id;

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
            } ${isMyPoison ? "heart-poison" : ""}`}
            onClick={() => handleClick(heart.id)}
            disabled={isDisabled}
          >
            <TiHeart
              className={`heart-icon ${
                colorClasses[heart.color] || "text-gray-400"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default HeartGrid;