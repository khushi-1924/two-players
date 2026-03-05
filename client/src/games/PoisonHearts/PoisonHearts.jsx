import React from 'react'
import { useLocation } from 'react-router-dom'
import HeartGrid from './HeartGrid'
import './poisonhearts.css';

const PoisonHearts = () => {
    const location = useLocation();
    const { game } = location.state || {};
    return (
        <div className="game-container">

            <h1 className='text-4xl my-4 text-pink-300'>{game?.name || 'Poison Hearts'}</h1>
            <p className='mb-4 text-xl'>{game?.description}</p>

            <div className="game-board">
                <HeartGrid />
            </div>

        </div>
    )
}

export default PoisonHearts
