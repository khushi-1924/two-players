import React from 'react';

const PlayAgainNotification = ({
  playerName,
  onClose
}) => {

  if (!playerName) return null;

  return (

    <div
      className="
        fixed
        bottom-8
        left-1/2
        -translate-x-1/2
        z-50
        px-6
        py-4
        rounded-xl
        bg-[#0a0a2a]
        border
        border-red-400
        text-white
        shadow-[0_0_20px_rgba(239,68,68,0.25)]
        flex
        items-center
        gap-3
      "
    >

      <span className="text-xl">
        😔
      </span>


      <span>

        <span className="font-semibold text-red-300">
          {playerName}
        </span>

        {" "}doesn't want to play another game.

      </span>


      <button
        onClick={onClose}
        className="
          ml-2
          text-gray-400
          hover:text-white
          transition
        "
      >
        ✕
      </button>

    </div>

  );

};

export default PlayAgainNotification;