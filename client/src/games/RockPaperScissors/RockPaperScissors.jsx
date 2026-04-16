import React from 'react'
import { useLocation } from 'react-router-dom';

const RockPaperScissors = () => {
    const location = useLocation();
    const { game } = location.state || {};
    return (
        <div>
            <div className="game-container">
                <h1 className='text-4xl my-4 text-pink-300'>{game?.name || 'Rock Paper Scissors'}</h1>
                <p className='mb-4 text-xl'>{game?.description}</p>
            </div>
        </div>
    )
}

export default RockPaperScissors
