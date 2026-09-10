import React from "react";
import PlayAgainButton from "../../components/PlayAgain/PlayAgainButton";

const RPSBoard = ({
  playerChoice,
  opponentChoice,
  result,
  playerNames = {
    1: "Player 1",
    2: "Player 2",
  },
  scores,
  onChoiceClick,
  onPlayAgain,
  waitingForResponse,
}) => {
  const choices = [
    {
      name: "rock",
      emoji: "🪨",
      label: "Rock",
    },
    {
      name: "paper",
      emoji: "📄",
      label: "Paper",
    },
    {
      name: "scissors",
      emoji: "✂️",
      label: "Scissors",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-6 w-full px-4">

      {/* GAME STATUS */}
      <p className="text-xl text-white text-center">
        {result
          ? result
          : playerChoice
            ? "Waiting for opponent..."
            : "Choose your move!"}
      </p>

      {/* CHOICES */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {choices.map((choice) => (
          <button
            key={choice.name}
            onClick={() => onChoiceClick(choice.name)}
            disabled={!!playerChoice}
            className="
              w-32
              h-32
              border
              border-pink-400
              rounded-lg
              flex
              flex-col
              items-center
              justify-center
              gap-2
              text-white
              hover:bg-white/5
              hover:scale-[1.02]
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <span className="text-5xl">
              {choice.emoji}
            </span>

            <span className="text-lg font-semibold">
              {choice.label}
            </span>
          </button>
        ))}
      </div>

      {/* PLAYER / OPPONENT CHOICES */}
      {(playerChoice || opponentChoice) && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-10 text-lg text-gray-400 text-center">
          <p>
            You chose:{" "}
            <span className="text-white">
              {playerChoice || "?"}
            </span>
          </p>

          <p>
            Opponent chose:{" "}
            <span className="text-white">
              {opponentChoice || "?"}
            </span>
          </p>
        </div>
      )}

      {/* SCORE */}
            <div className="text-base sm:text-lg text-white text-center">
                <span>
                    {playerNames[1] || "Player 1"}: {scores[1] || 0}
                </span>

                {" | "}

                <span>
                    {playerNames[2] || "Player 2"}: {scores[2] || 0}
                </span>
            </div>

      {/* PLAY AGAIN */}
      {result && (
        <PlayAgainButton
          onClick={onPlayAgain}
          waitingForResponse={waitingForResponse}
        />
      )}
    </div>
  );
};

export default RPSBoard;