import socket from "../socket/socket";


const GameNavbar = () => {

  const handleBackToGames = () => {

    const roomId =
      sessionStorage.getItem("roomId");


    if (!roomId) {

      return;

    }


    socket.emit(
      "leaveGame",
      {
        roomId
      }
    );

  };


  return (

    <nav
      className="
        w-full
        flex
        items-center
        justify-between
        px-6
        py-4
        bg-[#0a0a2a]
        border-b
        border-blue-500/30
      "
    >

      <h1
        className="
          text-xl
          font-bold
          text-pink-300
        "
      >

        🎮 Two Player Games

      </h1>


      <button

        onClick={handleBackToGames}

        className="
          px-5
          py-2
          rounded-lg
          bg-blue-500
          text-white
          font-semibold
          hover:bg-blue-600
          transition
        "
      >

        ← Back to Games

      </button>

    </nav>

  );

};


export default GameNavbar;