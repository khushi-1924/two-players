import React from 'react'
import Cell from './Cell';

const Grid = ({
  board,
  currentPlayer,
  playerNumber,
  winningCells = [],
  winner,
  isDraw,
  scores = { 1: 0, 2: 0 },
  onCellClick
}) => {

  const getWinningLineStyle = (cells) => {

    const styles = {

      // Top row
      "0,1,2": {
        width: "100%",
        height: "3px",
        top: "16%",
        left: 0
      },

      // Middle row
      "3,4,5": {
        width: "100%",
        height: "3px",
        top: "50%",
        left: 0
      },

      // Bottom row
      "6,7,8": {
        width: "100%",
        height: "3px",
        top: "83%",
        left: 0
      },

      // Left column
      "0,3,6": {
        width: "3px",
        height: "100%",
        left: "16%",
        top: 0
      },

      // Middle column
      "1,4,7": {
        width: "3px",
        height: "100%",
        left: "50%",
        top: 0
      },

      // Right column
      "2,5,8": {
        width: "3px",
        height: "100%",
        left: "83%",
        top: 0
      },

      // Diagonal \
      "0,4,8": {
        width: "140%",
        height: "3px",
        top: "50%",
        left: "-20%",
        transform: "rotate(45deg)"
      },

      // Diagonal /
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
    <div className='flex flex-col items-center gap-6'>

      {/* Game status */}
      <p className='text-xl text-white'>
        {winner
          ? `Winner: ${winner}`
          : isDraw
            ? "It's a Draw!"
            : currentPlayer
              ? `Turn: ${currentPlayer === 1 ? 'X' : 'O'}`
              : 'Waiting...'
        }
      </p>


      {/* Board */}
      <div className='relative'>

        <div className='grid grid-cols-3 gap-2'>

          {board.map((value, index) => (

            <Cell
              key={index}
              value={value}
              isWinning={winningCells.includes(index)}
              onClick={() => onCellClick(index)}
            />

          ))}

        </div>


        {/* Winning line */}
        {winningLineStyle && (
          <div
            className='absolute bg-white rounded-full z-20 pointer-events-none'
            style={winningLineStyle}
          />
        )}

      </div>


      {/* Player information */}
      <p className='text-lg text-gray-400'>

        You are Player {playerNumber}

        {' — '}

        {playerNumber === 1 ? 'X' : 'O'}

      </p>


      {/* Score */}
      <div className='text-lg text-white'>

        X: {scores[1]} | O: {scores[2]}

      </div>

    </div>
  )
}

export default Grid