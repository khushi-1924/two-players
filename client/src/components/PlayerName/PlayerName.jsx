import React, { useState } from 'react';

const PlayerName = ({ onSave }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    localStorage.setItem('playerName', trimmedName);

    onSave(trimmedName);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="w-[90%] max-w-md bg-[#0a0a2a]
                      border border-blue-500
                      rounded-2xl p-8">

        <h2 className="text-3xl font-bold text-pink-300 text-center mb-3">
          Welcome!
        </h2>

        <p className="text-gray-300 text-center mb-6">
          Enter your player name
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={20}
            className="w-full px-4 py-3
                       rounded-lg
                       bg-[#05051c]
                       border border-blue-500
                       outline-none
                       text-white"
          />

          <button
            type="submit"
            className="w-full mt-5 px-5 py-3
                       bg-pink-500
                       hover:bg-pink-600
                       rounded-lg
                       font-semibold"
          >
            Continue
          </button>

        </form>

      </div>

    </div>
  );
};

export default PlayerName;