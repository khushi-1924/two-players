import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import { useLocation } from "react-router-dom";

import Grid from "./Grid";

import socket from "../../socket/socket";

import usePlayAgain from "../../hooks/usePlayAgain";

import PlayAgainModal from
  "../../components/PlayAgain/PlayAgainModal";

import PlayAgainNotification from
  "../../components/PlayAgain/PlayAgainNotification";


const TicTacToe = () => {

  // ==========================================
  // GAME RESULT STATES
  // ==========================================

  const [winner, setWinner] =
    useState(null);

  const [winningCells, setWinningCells] =
    useState([]);

  const [isDraw, setIsDraw] =
    useState(false);


  // ==========================================
  // OVERALL ROOM SCORES
  // ==========================================

  const [scores, setScores] =
    useState({
      1: 0,
      2: 0
    });


  // ==========================================
  // ROOM / PLAYER INFORMATION
  // ==========================================

  const location =
    useLocation();

  const { game } =
    location.state || {};

  const roomId =
    sessionStorage.getItem("roomId");

  const playerNumber =
    Number(
      sessionStorage.getItem(
        "playerNumber"
      )
    );


  // ==========================================
  // BOARD STATE
  // ==========================================

  const [board, setBoard] =
    useState(
      Array(9).fill(null)
    );

  const [currentPlayer, setCurrentPlayer] =
    useState(null);


  // ==========================================
  // RESTORE STATE IMMEDIATELY AFTER REJOIN
  // ==========================================

  useEffect(() => {

    const savedGameState =
      sessionStorage.getItem(
        "rejoinedGameState"
      );

    if (!savedGameState) {
      return;
    }

    try {

      const data =
        JSON.parse(savedGameState);

      const restoredGame =
        data.currentGame;

      if (
        restoredGame &&
        restoredGame.name ===
          "ticTacToe"
      ) {

        console.log(
          "Restoring Tic Tac Toe from rejoin:",
          restoredGame
        );

        // Restore board
        setBoard(
          restoredGame.board ||
          Array(9).fill(null)
        );

        // Restore turn
        setCurrentPlayer(
          restoredGame.currentPlayer
        );

        // Restore scores
        setScores(
          data.scores || {
            1: 0,
            2: 0
          }
        );

        // Restore finished game
        if (
          restoredGame.status ===
          "finished"
        ) {

          setWinner(
            restoredGame.winner || null
          );

          setWinningCells(
            restoredGame.winningCells || []
          );

          setIsDraw(
            restoredGame.draw || false
          );

        } else {

          setWinner(null);

          setWinningCells([]);

          setIsDraw(false);
        }

      }

    } catch (error) {

      console.error(
        "Error restoring game state:",
        error
      );

    }

    // Remove temporary state
    sessionStorage.removeItem(
      "rejoinedGameState"
    );

  }, []);


  // ==========================================
  // RESTART TIC TAC TOE
  // ==========================================

  const handleGameRestarted =
    useCallback((data) => {

      console.log(
        "Tic Tac Toe restarted:",
        data
      );

      setBoard(
        data.board
      );

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

    socket.emit(
      "makeMove",
      {
        roomId,
        index
      }
    );

  };


  // ==========================================
  // GAME SOCKET EVENTS
  // ==========================================

  useEffect(() => {

    // ========================================
    // GAME STARTED / RESTORED
    // ========================================

    const handleGameStarted = (data) => {

      console.log(
        "Game state received:",
        data
      );

      setBoard(
        data.board
      );

      setCurrentPlayer(
        data.currentPlayer
      );

      setScores(
        data.scores || {
          1: 0,
          2: 0
        }
      );

      if (
        data.status === "finished"
      ) {

        setWinner(
          data.winner || null
        );

        setWinningCells(
          data.winningCells || []
        );

        setIsDraw(
          data.draw || false
        );

      } else {

        setWinner(null);

        setWinningCells([]);

        setIsDraw(false);

      }

    };


    // ========================================
    // BOARD UPDATED
    // ========================================

    const handleBoardUpdated = (data) => {

      console.log(
        "Board updated:",
        data
      );

      setBoard(
        data.board
      );

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

      setBoard(
        data.board
      );

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


    // ========================================
    // REGISTER LISTENERS
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


    // ========================================
    // REQUEST CURRENT SERVER STATE
    // ========================================

    const startGame = () => {

      console.log(
        "Requesting Tic Tac Toe state..."
      );

      socket.emit(
        "startGame",
        {
          roomId,
          game: "ticTacToe"
        }
      );

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

        {game?.name || "Tic Tac Toe"}

      </h1>


      <p className="mb-4 text-xl">

        {game?.description ||
          "Classic 2-player strategy game."}

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
          waitingForResponse={
            waitingForResponse
          }
        />

      </div>


      <PlayAgainModal
        request={playAgainRequest}
        gameName={
          game?.name ||
          "Tic Tac Toe"
        }
        onRespond={
          respondToPlayAgain
        }
      />


      <PlayAgainNotification
        playerName={
          playAgainDeclined
        }
        onClose={
          closeDeclineNotification
        }
      />

    </div>

  );

};


export default TicTacToe;