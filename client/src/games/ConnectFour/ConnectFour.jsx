import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import {
  useLocation
} from "react-router-dom";

import ConnectFourBoard
  from "./ConnectFourBoard";

import socket
  from "../../socket/socket";

import usePlayAgain
  from "../../hooks/usePlayAgain";

import PlayAgainModal
  from "../../components/PlayAgain/PlayAgainModal";

import PlayAgainNotification
  from "../../components/PlayAgain/PlayAgainNotification";


const ConnectFour = () => {


  // ==========================================
  // LOCATION
  // ==========================================

  const location =
    useLocation();

  const {
    game,
    restoredGame,
    scores: restoredScores
  } =
    location.state || {};


  // ==========================================
  // ROOM / PLAYER
  // ==========================================

  const roomId =
    sessionStorage.getItem(
      "roomId"
    );

  const playerNumber =
    Number(
      sessionStorage.getItem(
        "playerNumber"
      )
    );


  // ==========================================
  // GAME STATE
  // ==========================================

  const [board, setBoard] =
    useState(
      restoredGame?.board ||
      Array(6)
        .fill(null)
        .map(() =>
          Array(7).fill(null)
        )
    );


  const [currentPlayer, setCurrentPlayer] =
    useState(
      restoredGame?.currentPlayer ||
      null
    );


  const [winner, setWinner] =
    useState(
      restoredGame?.winner ||
      null
    );


  const [winningCells, setWinningCells] =
    useState(
      restoredGame?.winningCells ||
      []
    );


  const [isDraw, setIsDraw] =
    useState(
      restoredGame?.draw ||
      false
    );


  const [scores, setScores] =
    useState(
      restoredScores || {
        1: 0,
        2: 0
      }
    );


  // ==========================================
  // RESTART GAME
  // ==========================================

  const handleGameRestarted =
    useCallback((data) => {

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
        gameState.winner ||
        null
      );

      setWinningCells(
        gameState.winningCells ||
        []
      );

      setIsDraw(
        gameState.draw ||
        false
      );

      setScores(
        data.scores || {
          1: 0,
          2: 0
        }
      );

    }, []);


  // ==========================================
  // PLAY AGAIN
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
  // COLUMN CLICK
  // ==========================================

  const handleColumnClick =
    (column) => {

      socket.emit(
        "connectFourMove",
        {
          roomId,
          column
        }
      );

    };


  // ==========================================
  // SOCKET EVENTS
  // ==========================================

  useEffect(() => {


    // ========================================
    // GAME STARTED
    // ========================================

    const handleGameStarted =
      (data) => {

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

        setWinner(
          gameState.winner ||
          null
        );

        setWinningCells(
          gameState.winningCells ||
          []
        );

        setIsDraw(
          gameState.draw ||
          false
        );

        setScores(
          data.scores || {
            1: 0,
            2: 0
          }
        );

      };


    // ========================================
    // BOARD UPDATED
    // ========================================

    const handleBoardUpdated =
      (data) => {

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

    const handleGameOver =
      (data) => {

        setBoard(
          data.board
        );

        setWinner(
          data.winner ||
          null
        );

        setWinningCells(
          data.winningCells ||
          []
        );

        setIsDraw(
          data.draw ||
          false
        );

        setScores(
          data.scores || {
            1: 0,
            2: 0
          }
        );

        setCurrentPlayer(
          null
        );

      };


    socket.on(
      "gameStarted",
      handleGameStarted
    );

    socket.on(
      "connectFourBoardUpdated",
      handleBoardUpdated
    );

    socket.on(
      "connectFourGameOver",
      handleGameOver
    );


    // ========================================
    // REQUEST GAME STATE
    // ========================================

    const startGame =
      () => {

        socket.emit(
          "startGame",
          {
            roomId,
            game:
              "connectFour"
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
        "connectFourBoardUpdated",
        handleBoardUpdated
      );

      socket.off(
        "connectFourGameOver",
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

        {
          game?.name ||
          "Connect Four"
        }

      </h1>


      <p className="mb-4 text-xl">

        {
          game?.description ||
          "Connect four of your pieces in a row."
        }

      </p>


      <div className="py-10">

        <ConnectFourBoard
          board={board}
          currentPlayer={
            currentPlayer
          }
          playerNumber={
            playerNumber
          }
          winner={winner}
          winningCells={
            winningCells
          }
          isDraw={isDraw}
          scores={scores}
          onColumnClick={
            handleColumnClick
          }
          onPlayAgain={
            requestPlayAgain
          }
          waitingForResponse={
            waitingForResponse
          }
        />

      </div>


      {/* =====================================
                PLAY AGAIN MODAL
            ====================================== */}

      <PlayAgainModal
        request={
          playAgainRequest
        }
        gameName={
          game?.name ||
          "Connect Four"
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


export default ConnectFour;