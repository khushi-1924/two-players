import React from 'react'
import { Link } from 'react-router-dom';

const GameCard = ({ game }) => {
    return (
        <Link to={game.path} state={{ game }}>
            <div className='game-card'>
                <img src={game.image} alt={game.name} className='game-image' />
                <h3 className='game-overlay'>{game.name}</h3>
            </div>
        </Link>
    )
}

export default GameCard
