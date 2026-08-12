import React from 'react'
import { useLocation } from 'react-router-dom'
import Grid from './Grid';
import { useEffect } from 'react';
import socket from '../../socket/socket';

const TicTacToe = () => {
  const location = useLocation();
  const { game } = location.state || {};

  useEffect(() => {
    const handleRoomCreated = (data) => {
      console.log("Room created:", data.roomId);
    };

    socket.on("roomCreated", handleRoomCreated);

    return () => {
      socket.off("roomCreated", handleRoomCreated);
    };
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to server:", socket.id);
      console.log("Emitting createRoom");

      socket.emit("createRoom");
    };

    socket.on("connect", handleConnect);

    if (socket.connected) {
      console.log("Socket already connected");
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);

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
