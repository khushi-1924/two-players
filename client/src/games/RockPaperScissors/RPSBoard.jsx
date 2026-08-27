import React from "react";

const RPSBoard = ({
  playerChoice,
  opponentChoice,
  result,
  scores,
  onChoiceClick
}) => {

  const choices = [
    {
      name: "rock",
      emoji: "🪨",
      label: "Rock"
    },
    {
      name: "paper",
      emoji: "📄",
      label: "Paper"
    },
    {
      name: "scissors",
      emoji: "✂️",
      label: "Scissors"
    }
  ];


  return (

    <div className="flex flex-col items-center gap-6">

      {/* GAME STATUS */}

      <p className="text-xl text-white">

        {result
          ? result
          : playerChoice
            ? "Waiting for opponent..."
            : "Choose your move!"
        }

      </p>


      {/* CHOICES */}

      <div className="flex gap-4">

        {choices.map((choice) => (

          <button
            key={choice.name}

            onClick={() =>
              onChoiceClick(choice.name)
            }

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

        <div className="flex gap-10 text-lg text-gray-400">

          <p>

            You chose:

            {" "}

            <span className="text-white">

              {playerChoice || "?"}

            </span>

          </p>


          <p>

            Opponent chose:

            {" "}

            <span className="text-white">

              {opponentChoice || "?"}

            </span>

          </p>

        </div>

      )}


      {/* SCORE */}

      <p className="text-lg text-white">

        You: {scores.you}

        {" | "}

        Opponent: {scores.opponent}

      </p>

    </div>

  );

};

export default RPSBoard;