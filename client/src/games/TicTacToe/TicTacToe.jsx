import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Grid from './Grid';
import socket from '../../socket/socket';

const TicTacToe = () => {

  // ==========================================
  // GAME RESULT STATES
  // ==========================================

  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [isDraw, setIsDraw] = useState(false);

  // Play Again request received from opponent
  const [playAgainRequest, setPlayAgainRequest] = useState(null);
  const [playAgainDeclined, setPlayAgainDeclined] = useState(null);


  // ==========================================
  // OVERALL ROOM SCORES
  // ==========================================

  const [scores, setScores] = useState({
    1: 0,
    2: 0
  });


  // ==========================================
  // ROOM / PLAYER INFORMATION
  // ==========================================

  const location = useLocation();
  const { game } = location.state || {};

  const roomId = sessionStorage.getItem("roomId");

  const playerNumber = Number(
    sessionStorage.getItem("playerNumber")
  );


  // ==========================================
  // MULTIPLAYER BOARD STATE
  // ==========================================

  const [board, setBoard] = useState(
    Array(9).fill(null)
  );

  const [currentPlayer, setCurrentPlayer] = useState(null);


  console.log("Tic Tac Toe room:", roomId);
  console.log("My player number:", playerNumber);


  // ==========================================
  // CELL CLICK
  // ==========================================

  const handleCellClick = (index) => {

    console.log(
      "Clicked cell:",
      index
    );

    socket.emit("makeMove", {
      roomId,
      index
    });

  };


  // ==========================================
  // PLAY AGAIN
  // ==========================================

  const handlePlayAgain = () => {

    console.log(
      "I clicked Play Again"
    );

    socket.emit("playAgainRequest", {
      roomId
    });

  };


  // ==========================================
  // ACCEPT / DECLINE PLAY AGAIN
  // ==========================================

  const handlePlayAgainResponse = (accepted) => {

    console.log(
      "Play Again response:",
      accepted ? "Accepted" : "Declined"
    );

    socket.emit(
      "playAgainResponse",
      {
        roomId,
        accepted
      }
    );

    // Close modal immediately
    setPlayAgainRequest(null);

  };


  // ==========================================
  // SOCKET LISTENERS
  // ==========================================

  useEffect(() => {


    // ========================================
    // GAME STARTED
    // ========================================

    const handleGameStarted = (data) => {

      console.log(
        "Game started:",
        data
      );

      setBoard(data.board);

      setCurrentPlayer(
        data.currentPlayer
      );

      // Reset result states
      setWinner(null);

      setWinningCells([]);

      setIsDraw(false);

    };


    // ========================================
    // BOARD UPDATED
    // ========================================

    const handleBoardUpdated = (data) => {

      console.log(
        "Board updated:",
        data
      );

      setBoard(data.board);

      setCurrentPlayer(
        data.currentPlayer
      );

    };


    // ========================================
    // GAME OVER
    // ========================================

    const handleGameOver = (data) => {

      console.log(
        "Game over:",
        data
      );


      // Board AFTER the final winning move
      setBoard(data.board);


      setWinner(
        data.winner
      );


      setWinningCells(
        data.winningCells || []
      );


      setIsDraw(
        data.draw || false
      );


      setScores(
        data.scores
      );


      // No next turn
      setCurrentPlayer(null);

    };


    // ========================================
    // PLAY AGAIN REQUESTED
    // ========================================

    const handlePlayAgainRequested = (data) => {

      console.log(
        "Play Again request received:",
        data
      );

      setPlayAgainRequest(data);

    };


    // ========================================
    // PLAY AGAIN DECLINED
    // ========================================

    const handlePlayAgainDeclined = (data) => {

      console.log(
        `${data.playerName} declined Play Again`
      );

      setPlayAgainDeclined(data.playerName);

      setTimeout(() => {
        setPlayAgainDeclined(null);
      }, 3000);

    };


    // ========================================
    // GAME RESTARTED
    // ========================================

    const handleGameRestarted = (data) => {

      console.log(
        "New game started:",
        data
      );


      // Reset board
      setBoard(data.board);


      // Set new starting player
      setCurrentPlayer(
        data.currentPlayer
      );


      // Reset result states
      setWinner(null);

      setWinningCells([]);

      setIsDraw(false);


      // Keep the overall score
      setScores(
        data.scores
      );


      // Make sure any old request disappears
      setPlayAgainRequest(null);

    };


    // ========================================
    // REGISTER SOCKET LISTENERS
    // ========================================

    socket.on(
      "gameStarted",
      handleGameStarted
    );

    socket.on(
      "boardUpdated",
      handleBoardUpdated
    );

    socket.on(
      "gameOver",
      handleGameOver
    );

    socket.on(
      "playAgainRequested",
      handlePlayAgainRequested
    );

    socket.on(
      "playAgainDeclined",
      handlePlayAgainDeclined
    );

    socket.on(
      "gameRestarted",
      handleGameRestarted
    );


    // ========================================
    // START GAME
    // ========================================

    const startGame = () => {

      console.log(
        "Starting Tic Tac Toe..."
      );

      socket.emit("startGame", {
        roomId,
        game: "ticTacToe"
      });

    };


    if (socket.connected) {

      startGame();

    } else {

      socket.once(
        "connect",
        startGame
      );

    }


    // ========================================
    // CLEANUP
    // ========================================

    return () => {

      socket.off(
        "gameStarted",
        handleGameStarted
      );

      socket.off(
        "boardUpdated",
        handleBoardUpdated
      );

      socket.off(
        "gameOver",
        handleGameOver
      );

      socket.off(
        "playAgainRequested",
        handlePlayAgainRequested
      );

      socket.off(
        "playAgainDeclined",
        handlePlayAgainDeclined
      );

      socket.off(
        "gameRestarted",
        handleGameRestarted
      );

      socket.off(
        "connect",
        startGame
      );

    };

  }, [roomId]);


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="game-container">

      <h1 className='text-4xl my-4 text-pink-300'>

        {game?.name || 'Tic Tac Toe'}

      </h1>


      <p className='mb-4 text-xl'>

        {game?.description}

      </p>


      <div className='py-10'>

        <Grid
          board={board}
          currentPlayer={currentPlayer}
          playerNumber={playerNumber}
          winner={winner}
          winningCells={winningCells}
          isDraw={isDraw}
          scores={scores}
          onCellClick={handleCellClick}
          onPlayAgain={handlePlayAgain}
        />

      </div>


      {/* ======================================
          PLAY AGAIN MODAL
      ====================================== */}

      {playAgainRequest && (

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

                {playAgainRequest.playerName}

              </span>

              {" "}wants to play another game of{" "}

              <span className="font-semibold">

                Tic Tac Toe

              </span>

              !

            </p>


            <div
              className="
                flex
                justify-center
                gap-4
              "
            >

              {/* ACCEPT */}

              <button
                onClick={() =>
                  handlePlayAgainResponse(true)
                }
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


              {/* DECLINE */}

              <button
                onClick={() =>
                  handlePlayAgainResponse(false)
                }
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

      )}

      {playAgainDeclined && (

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
              {playAgainDeclined}
            </span>
            {" "}doesn't want to play another game.
          </span>

          <button
            onClick={() => setPlayAgainDeclined(null)}
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

      )}

    </div>
  )
}

export default TicTacToe