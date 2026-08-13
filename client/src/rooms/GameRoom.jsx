import React from 'react';

const GameRoom = () => {
  return (
    <div className="min-h-screen text-white flex flex-col items-center">

      <h1 className="text-4xl font-bold text-pink-300 my-8">
        Game Room
      </h1>

      <p className="text-xl">
        Room ID: <span className="font-bold">ABC123</span>
      </p>

      <p className="mt-6 text-gray-300">
        Waiting for another player...
      </p>

    </div>
  );
};

export default GameRoom;