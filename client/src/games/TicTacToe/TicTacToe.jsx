import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Grid from './Grid';
import socket from '../../socket/socket';

const TicTacToe = () => {
  const location = useLocation();
  const { game } = location.state || {};

  // <-- Get the roomId from sessionStorage -->
  const roomId = sessionStorage.getItem("roomId");
  const playerNumber = Number(
    sessionStorage.getItem("playerNumber")
  );
  console.log("Tic Tac Toe room:", roomId);
  console.log("My player number:", playerNumber);

  useEffect(() => {

    const handleGameStarted = (data) => {
      console.log("Game started:", data);
    };

    socket.on("gameStarted", handleGameStarted);

    const startGame = () => {
      console.log("Starting Tic Tac Toe...");

      socket.emit("startGame", {
        roomId,
        game: "ticTacToe"
      });
    };

    if (socket.connected) {
      startGame();
    } else {
      socket.once("connect", startGame);
    }

    return () => {
      socket.off("gameStarted", handleGameStarted);
      socket.off("connect", startGame);
    };

  }, [roomId]);


  return (
    <div className="game-container">
      <h1 className='text-4xl my-4 text-pink-300'>{game?.name || 'Tic Tac Toe'}</h1>
      <p className='mb-4 text-xl'>{game?.description}</p>

      <div className='py-10'>
        <Grid />
      </div>
    </div>
  )
}

export default TicTacToe
