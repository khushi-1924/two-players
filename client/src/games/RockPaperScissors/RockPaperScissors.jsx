import React, { useState } from "react";

import { useLocation } from "react-router-dom";

import RPSBoard from "./RPSBoard";


const RockPaperScissors = () => {

  const location = useLocation();

  const { game } =
    location.state || {};


  const [playerChoice, setPlayerChoice] =
    useState(null);

  const [opponentChoice, setOpponentChoice] =
    useState(null);

  const [result, setResult] =
    useState(null);

  const [scores, setScores] =
    useState({
      you: 0,
      opponent: 0
    });


  const handleChoiceClick = (choice) => {

    console.log(
      "Player selected:",
      choice
    );

    setPlayerChoice(choice);

  };


  return (

    <div className="game-container">

      <h1 className="text-4xl my-4 text-pink-300">

        {game?.name ||
          "Rock Paper Scissors"}

      </h1>


      <p className="mb-4 text-xl">

        {game?.description ||
          "Quick reaction game."}

      </p>


      {/* SAME SPACING STRUCTURE AS TIC TAC TOE */}

      <div className="py-10">

        <RPSBoard
          playerChoice={playerChoice}
          opponentChoice={opponentChoice}
          result={result}
          scores={scores}
          onChoiceClick={handleChoiceClick}
        />

      </div>

    </div>

  );

};


export default RockPaperScissors;