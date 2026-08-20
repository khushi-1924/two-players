import React from 'react';

const PlayAgainButton = ({
  onClick,
  waitingForResponse
}) => {

  return (

    <button
      onClick={onClick}
      disabled={waitingForResponse}
      className={`
        mt-8
        px-6
        py-3
        rounded-xl
        text-white
        font-semibold
        transition
        shadow-lg
        ${
          waitingForResponse
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }
      `}
    >

      {waitingForResponse
        ? 'Waiting for response...'
        : 'Play Again'
      }

    </button>

  );

};

export default PlayAgainButton;