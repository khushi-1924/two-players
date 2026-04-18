import React from 'react'
import { useLocation } from 'react-router-dom'
import Grid from './Grid';

const TicTacToe = () => {
  const location = useLocation();
  const { game } = location.state || {};
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
