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

import { gamesList } from "../../data/gamesList";

import '../GameCommon.css';
import "../../components/Instructions/Instructions.css";
import Instructions from "../../components/Instructions/Instructions";


const TicTacToe = () => {

  const location =
    useLocation();

  const {
    game,
    restoredGame,
    scores: restoredScores
  } =
    location.state || {};

  const gameInfo = gamesList.find(
    (item) => item.gameId === "ticTacToe"
  );

  // ==========================================
  // GAME RESULT STATES
  // ==========================================

  const [winner, setWinner] =
    useState(
      restoredGame?.winner || null
    );

  const [winningCells, setWinningCells] =
    useState(
      restoredGame?.winningCells || []
    );

  const [isDraw, setIsDraw] =
    useState(
      restoredGame?.draw || false
    );


  // ==========================================
  // OVERALL ROOM SCORES
  // ==========================================

  const [scores, setScores] =
    useState(
      restoredScores || {
        1: 0,
        2: 0
      }
    );


  // ==========================================
  // ROOM / PLAYER INFORMATION
  // ==========================================

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
      restoredGame?.board ||
      Array(9).fill(null)
    );


  const [currentPlayer, setCurrentPlayer] =
    useState(
      restoredGame?.currentPlayer ||
      null
    );


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


      const gameState =
        data.gameState;


      if (!gameState) {

        console.error(
          "Restarted game state is missing"
        );

        return;
      }


      setBoard(
        gameState.board
      );


      setCurrentPlayer(
        gameState.currentPlayer
      );


      setWinner(
        gameState.winner || null
      );


      setWinningCells(
        gameState.winningCells || []
      );


      setIsDraw(
        gameState.draw || false
      );


      setScores(
        data.scores || {
          1: 0,
          2: 0
        }
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


      const gameState =
        data.gameState;


      if (!gameState) {
        return;
      }


      setBoard(
        gameState.board
      );


      setCurrentPlayer(
        gameState.currentPlayer
      );


      setScores(
        data.scores || {
          1: 0,
          2: 0
        }
      );


      if (
        gameState.status === "finished"
      ) {

        setWinner(
          gameState.winner || null
        );

        setWinningCells(
          gameState.winningCells || []
        );

        setIsDraw(
          gameState.draw || false
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

      <div className="game-header">
        <div className="game-title-row">

          <h1 className="game-title">
            {gameInfo.name}
          </h1>

          <Instructions
            gameName={gameInfo.name}
            instructions={gameInfo.instructions}
          />

        </div>

        <p className="game-description">
          {gameInfo.description}
        </p>
      </div>


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