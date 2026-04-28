import React, { useState } from 'react'
import Cell from './Cell';

const Grid = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);

  const winningPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';

    const result = checkWinner(newBoard);

    setBoard(newBoard);

    if (result) {
      setWinner(result.winner);
      setWinningCells(result.cells);
    } else {
      setIsXTurn(!isXTurn);
    }
  };

  const checkWinner = (currentBoard) => {
    for (let pattern of winningPatterns) {
      const [a, b, c] = pattern;

      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return {
          winner: currentBoard[a],
          cells: pattern
        };
      }
    }

    return null;
  };

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

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
    setWinningCells([]);
  };

  return (
    <div className='flex flex-col items-center gap-6'>
      
      <p className='text-xl text-white'>
        {winner ? `Winner: ${winner}` : `Turn: ${isXTurn ? 'X' : 'O'}`}
      </p>

      <div className='relative'>
        <div className='grid grid-cols-3 gap-2'>
          {board.map((val, index) => (
            <Cell
              key={index}
              value={val}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>

        {winningCells.length > 0 && (
          <div
            className={`absolute bg-white rounded-full`}
            style={getWinningLineStyle(winningCells)}
          />
        )}
      </div>

      <button
        onClick={resetGame}
        className='mt-8 px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold
                  hover:bg-blue-600 transition shadow-lg'
      >
        Play Again
      </button>

    </div>
  )
}

export default Grid