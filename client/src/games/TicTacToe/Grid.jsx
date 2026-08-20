import React from 'react';

import Cell from './Cell';

import PlayAgainButton from '../../components/PlayAgain/PlayAgainButton';


const Grid = ({

  board,

  currentPlayer,

  playerNumber,

  winningCells = [],

  winner,

  isDraw,

  scores = { 1: 0, 2: 0 },

  onCellClick,

  onPlayAgain,

  waitingForResponse

}) => {


  const getWinningLineStyle = (cells) => {

    const styles = {

      "0,1,2": {
        width: "100%",
        height: "3px",
        top: "16%",
        left: 0
      },

      "3,4,5": {
        width: "100%",
        height: "3px",
        top: "50%",
        left: 0
      },

      "6,7,8": {
        width: "100%",
        height: "3px",
        top: "83%",
        left: 0
      },

      "0,3,6": {
        width: "3px",
        height: "100%",
        left: "16%",
        top: 0
      },

      "1,4,7": {
        width: "3px",
        height: "100%",
        left: "50%",
        top: 0
      },

      "2,5,8": {
        width: "3px",
        height: "100%",
        left: "83%",
        top: 0
      },

      "0,4,8": {
        width: "140%",
        height: "3px",
        top: "50%",
        left: "-20%",
        transform: "rotate(45deg)"
      },

      "2,4,6": {
        width: "140%",
        height: "3px",
        top: "50%",
        left: "-20%",
        transform: "rotate(-45deg)"
      }

    };

    return styles[cells.join(",")];

  };


  const winningLineStyle =

    winningCells.length > 0

      ? getWinningLineStyle(winningCells)

      : null;


  return (

    <div className="flex flex-col items-center gap-6">


      {/* GAME STATUS */}

      <p className="text-xl text-white">

        {winner

          ? `Winner: ${winner}`

          : isDraw

            ? "It's a Draw!"

            : currentPlayer

              ? `Turn: ${currentPlayer === 1 ? 'X' : 'O'}`

              : 'Waiting...'

        }

      </p>


      {/* BOARD */}

      <div className="relative">

        <div className="grid grid-cols-3 gap-2">

          {board.map((value, index) => (

            <Cell
              key={index}
              value={value}
              isWinning={winningCells.includes(index)}
              onClick={() => onCellClick(index)}
            />

          ))}

        </div>


        {/* WINNING LINE */}

        {winningLineStyle && (

          <div
            className="
              absolute
              bg-white
              rounded-full
              z-20
              pointer-events-none
            "
            style={winningLineStyle}
          />

        )}

      </div>


      {/* PLAYER INFORMATION */}

      <p className="text-lg text-gray-400">

        You are Player {playerNumber}

        {' — '}

        {playerNumber === 1 ? 'X' : 'O'}

      </p>


      {/* SCORE */}

      <div className="text-lg text-white">

        X: {scores[1]} | O: {scores[2]}

      </div>


      {/* PLAY AGAIN */}

      {(winner || isDraw) && (

        <PlayAgainButton
          onClick={onPlayAgain}
          waitingForResponse={waitingForResponse}
        />

      )}

    </div>

  );

};


export default Grid;