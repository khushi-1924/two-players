import React from 'react'
import { useLocation } from 'react-router-dom'

const GuessTheNumber = () => {
    const location = useLocation();
    const game = location.state?.game;
    
  return (
    <div>
      <div className="game-container">
      <h1 className='text-4xl my-4 text-pink-300'>{game?.name || 'Guess The Number'}</h1>
      <p className='mb-4 text-xl'>{game?.description}</p>
    </div>
    </div>
  )
}

export default GuessTheNumber
