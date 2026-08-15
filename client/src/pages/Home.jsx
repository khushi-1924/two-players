import React, { useState } from 'react'
import { gamesList } from '../data/gamesList'
import GameCard from '../components/GameCard'

const Home = () => {
  const roomId = sessionStorage.getItem("roomId");

  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName") || ""
  );

  const [showEditName, setShowEditName] = useState(false);
  const [editedName, setEditedName] = useState(playerName);

  console.log("Current room:", roomId);

  return (
    <div className='relative flex flex-col justify-center items-center'>

      {/* Player name */}

      <div className="absolute top-4 right-6 group">

        <button
          onClick={() => {
            setEditedName(playerName);
            setShowEditName(true);
          }}
          className="w-44 h-12
               rounded-lg
               bg-[#0a0a2a]
               border border-blue-500
               text-white font-semibold
               flex items-center justify-center
               transition-all duration-200
               hover:bg-white
               hover:text-black"
        >
          {/* Normal state */}
          <span className="group-hover:hidden">
            {playerName}
          </span>

          {/* Hover state */}
          <span className="hidden group-hover:flex
                     items-center gap-2">
            <span className="text-lg">✎</span>
            <span>Edit</span>
          </span>
        </button>

      </div>


      {/* Existing Home content */}

      <h1 className='my-3 text-3xl font-bold text-sky-200'>
        Multiplayer Games
      </h1>

      <p className='text-gray-500'>
        Select any game you want to play
      </p>

      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-10'>
        {gamesList.map(game => (
          <GameCard
            key={game.id}
            game={game}
          />
        ))}
      </div>


      {/* Edit Name Modal */}

      {showEditName && (
        <div className="fixed inset-0 z-50
                        flex items-center justify-center
                        bg-black/60">

          <div className="relative w-[90%] max-w-md
                          bg-[#0a0a2a]
                          border border-blue-500
                          rounded-2xl
                          p-8">

            <button
              onClick={() => setShowEditName(false)}
              className="absolute top-3 right-4
                         text-gray-400
                         hover:text-white
                         text-2xl"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold
                           text-pink-300
                           text-center mb-6">
              Edit Name
            </h2>

            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              maxLength={20}
              className="w-full px-4 py-3
                         rounded-lg
                         bg-[#05051c]
                         border border-blue-500
                         outline-none
                         text-white"
            />

            <button
              onClick={() => {
                const newName = editedName.trim();

                if (!newName) {
                  return;
                }

                localStorage.setItem(
                  "playerName",
                  newName
                );

                setPlayerName(newName);
                setShowEditName(false);
              }}
              className="w-full mt-5
                         px-5 py-3
                         bg-pink-500
                         hover:bg-pink-600
                         rounded-lg
                         font-semibold
                         transition"
            >
              Save
            </button>

          </div>
        </div>
      )}

    </div>
  )
}

export default Home