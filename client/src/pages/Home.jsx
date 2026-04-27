import React from 'react'
import { gamesList } from '../data/gamesList'
import GameCard from '../components/GameCard'

const Home = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <h1 className='my-3 text-3xl font-bold text-sky-200'>Multiplayer Games</h1>
      <p className='text-gray-500'>Select any game you want to play</p>

      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-10'>
        {gamesList.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}

export default Home
