import React from 'react';

const PlayAgainModal = ({
  request,
  gameName,
  onRespond
}) => {

  if (!request) return null;

  return (

    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60
        backdrop-blur-sm
      "
    >

      <div
        className="
          w-[90%] max-w-md
          rounded-2xl
          bg-[#0a0a2a]
          border border-blue-500
          p-8
          text-center
          shadow-[0_0_30px_rgba(59,130,246,0.25)]
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            text-pink-300
            mb-4
          "
        >
          🎮 Another Game?
        </h2>


        <p
          className="
            text-white
            text-lg
            mb-8
          "
        >

          <span className="font-semibold">
            {request.playerName}
          </span>

          {" "}wants to play another game of{" "}

          <span className="font-semibold">
            {gameName}
          </span>

          !

        </p>


        <div className="flex justify-center gap-4">

          <button
            onClick={() => onRespond(true)}
            className="
              px-6 py-3
              rounded-xl
              bg-green-500
              text-white
              font-semibold
              hover:bg-green-600
              transition
              shadow-lg
            "
          >
            Accept
          </button>


          <button
            onClick={() => onRespond(false)}
            className="
              px-6 py-3
              rounded-xl
              bg-red-500
              text-white
              font-semibold
              hover:bg-red-600
              transition
              shadow-lg
            "
          >
            Decline
          </button>

        </div>

      </div>

    </div>

  );

};

export default PlayAgainModal;