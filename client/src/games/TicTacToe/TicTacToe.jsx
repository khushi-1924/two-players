import React, {
  useEffect,
  useState,
  useCallback
} from 'react';

import { useLocation } from 'react-router-dom';

import Grid from './Grid';

import socket from '../../socket/socket';

import usePlayAgain from '../../hooks/usePlayAgain';

import PlayAgainModal from '../../components/PlayAgain/PlayAgainModal';

import PlayAgainNotification from '../../components/PlayAgain/PlayAgainNotification';


const TicTacToe = () => {

  // ==========================================
  // GAME RESULT STATES
  // ==========================================

  const [winner, setWinner] = useState(null);

  const [winningCells, setWinningCells] = useState([]);

  const [isDraw, setIsDraw] = useState(false);


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
  // BOARD STATE
  // ==========================================

  const [board, setBoard] = useState(
    Array(9).fill(null)
  );

  const [currentPlayer, setCurrentPlayer] =
    useState(null);


  // ==========================================
  // RESTART TIC TAC TOE
  // Called by reusable Play Again system
  // ==========================================

  const handleGameRestarted = useCallback((data) => {

    console.log(
      "Tic Tac Toe restarted:",
      data
    );

    setBoard(data.board);

    setCurrentPlayer(
      data.currentPlayer
    );

    setWinner(null);

    setWinningCells([]);

    setIsDraw(false);

    setScores(
      data.scores
    );

  }, []);


  // ==========================================
  // REUSABLE PLAY AGAIN HOOK
  // ==========================================

  const {

    playAgainRequest,

    playAgainDeclined,

    waitingForResponse,

    requestPlayAgain,

    respondToPlayAgain,

    closeDeclineNotification

  } = usePlayAgain(
    roomId,
    handleGameRestarted
  );


  // ==========================================
  // CELL CLICK
  // ==========================================

  const handleCellClick = (index) => {

    socket.emit("makeMove", {
      roomId,
      index
    });

  };


  // ==========================================
  // GAME SOCKET EVENTS
  // ==========================================

  useEffect(() => {


    // GAME STARTED

    const handleGameStarted = (data) => {

      setBoard(data.board);

      setCurrentPlayer(
        data.currentPlayer
      );

      setWinner(null);

      setWinningCells([]);

      setIsDraw(false);

    };


    // BOARD UPDATED

    const handleBoardUpdated = (data) => {

      setBoard(data.board);

      setCurrentPlayer(
        data.currentPlayer
      );

    };


    // GAME OVER

    const handleGameOver = (data) => {

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

      setCurrentPlayer(null);

    };


    // REGISTER LISTENERS

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


    // START GAME

    const startGame = () => {

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


    // CLEANUP

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

      <h1 className="text-4xl my-4 text-pink-300">

        {game?.name || 'Tic Tac Toe'}

      </h1>


      <p className="mb-4 text-xl">

        {game?.description}

      </p>


      <div className="py-10">

        <Grid
          board={board}
          currentPlayer={currentPlayer}
          playerNumber={playerNumber}
          winner={winner}
          winningCells={winningCells}
          isDraw={isDraw}
          scores={scores}
          onCellClick={handleCellClick}
          onPlayAgain={requestPlayAgain}
          waitingForResponse={waitingForResponse}
        />

      </div>


      {/* REUSABLE PLAY AGAIN MODAL */}

      <PlayAgainModal
        request={playAgainRequest}
        gameName={game?.name || 'Tic Tac Toe'}
        onRespond={respondToPlayAgain}
      />


      {/* REUSABLE DECLINE NOTIFICATION */}

      <PlayAgainNotification
        playerName={playAgainDeclined}
        onClose={closeDeclineNotification}
      />

    </div>

  );

};

export default TicTacToe;