import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Grid from './Grid';
import socket from '../../socket/socket';

const TicTacToe = () => {

  // Game result states
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [isDraw, setIsDraw] = useState(false);

  // Overall room scores
  const [scores, setScores] = useState({
    1: 0,
    2: 0
  });


  const location = useLocation();
  const { game } = location.state || {};

  const roomId = sessionStorage.getItem("roomId");

  const playerNumber = Number(
    sessionStorage.getItem("playerNumber")
  );


  // Multiplayer board state
  const [board, setBoard] = useState(
    Array(9).fill(null)
  );

  const [currentPlayer, setCurrentPlayer] = useState(null);


  console.log("Tic Tac Toe room:", roomId);
  console.log("My player number:", playerNumber);


  useEffect(() => {

    // ==========================================
    // GAME STARTED
    // ==========================================

    const handleGameStarted = (data) => {

      console.log("Game started:", data);

      setBoard(data.board);
      setCurrentPlayer(data.currentPlayer);

      // Reset result states
      setWinner(null);
      setWinningCells([]);
      setIsDraw(false);
    };


    // ==========================================
    // BOARD UPDATED
    // ==========================================

    const handleBoardUpdated = (data) => {

      console.log("Board updated:", data);

      setBoard(data.board);
      setCurrentPlayer(data.currentPlayer);

    };


    // ==========================================
    // GAME OVER
    // ==========================================

    const handleGameOver = (data) => {

      console.log("Game over:", data);

      // IMPORTANT:
      // This contains the board AFTER
      // the winning move.
      setBoard(data.board);

      setWinner(data.winner);

      setWinningCells(
        data.winningCells || []
      );

      setIsDraw(
        data.draw || false
      );

      setScores(
        data.scores
      );

      // Game is over, so there is no next turn
      setCurrentPlayer(null);
    };


    // Register socket listeners

    socket.on(
      "gameStarted",
      handleGameStarted
    );

    socket.on(
      "boardUpdated",
      handleBoardUpdated
    );

    socket.on(
      "gameOver",
      handleGameOver
    );


    // ==========================================
    // START GAME
    // ==========================================

    const startGame = () => {

      console.log(
        "Starting Tic Tac Toe..."
      );

      socket.emit("startGame", {
        roomId,
        game: "ticTacToe"
      });

    };


    if (socket.connected) {

      startGame();

    } else {

      socket.once(
        "connect",
        startGame
      );

    }


    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {

      socket.off(
        "gameStarted",
        handleGameStarted
      );

      socket.off(
        "boardUpdated",
        handleBoardUpdated
      );

      socket.off(
        "gameOver",
        handleGameOver
      );

      socket.off(
        "connect",
        startGame
      );

    };

  }, [roomId]);


  // ==========================================
  // CELL CLICK
  // ==========================================

  const handleCellClick = (index) => {

    console.log(
      "Clicked cell:",
      index
    );

    socket.emit("makeMove", {
      roomId,
      index
    });

  };


  return (
    <div className="game-container">

      <h1 className='text-4xl my-4 text-pink-300'>
        {game?.name || 'Tic Tac Toe'}
      </h1>


      <p className='mb-4 text-xl'>
        {game?.description}
      </p>


      <div className='py-10'>

        <Grid
          board={board}
          currentPlayer={currentPlayer}
          playerNumber={playerNumber}
          winner={winner}
          winningCells={winningCells}
          isDraw={isDraw}
          scores={scores}
          onCellClick={handleCellClick}
        />

      </div>

    </div>
  )
}

export default TicTacToe