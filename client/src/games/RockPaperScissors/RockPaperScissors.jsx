import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import { useLocation } from "react-router-dom";

import RPSBoard from "./RPSBoard";

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


const RockPaperScissors = () => {

  const location = useLocation();

  const {
    game
  } = location.state || {};

  const gameInfo = gamesList.find(
    (item) => item.gameId === "rockPaperScissors"
  );


  // ==========================================
  // ROOM / PLAYER INFORMATION
  // ==========================================

  const roomId =
    sessionStorage.getItem("roomId");

  const playerNumber =
    Number(
      sessionStorage.getItem("playerNumber")
    );


  // ==========================================
  // RPS STATE
  // ==========================================

  const [playerChoice, setPlayerChoice] =
    useState(null);

  const [opponentChoice, setOpponentChoice] =
    useState(null);

  const [result, setResult] =
    useState(null);


  // ==========================================
  // SCORE
  // ==========================================

  const [scores, setScores] =
    useState({
      you: 0,
      opponent: 0
    });


  // ==========================================
  // GAME STARTED / RESTORED
  // ==========================================

  const handleGameStarted =
    useCallback((data) => {

      console.log(
        "RPS game state received:",
        data
      );

      const gameState =
        data.gameState;


      if (!gameState) {
        return;
      }


      // Restore choices

      setPlayerChoice(
        gameState.choices?.[playerNumber] ||
        null
      );

      setOpponentChoice(
        gameState.choices?.[
        playerNumber === 1 ? 2 : 1
        ] || null
      );


      // Restore result

      if (
        gameState.status === "finished"
      ) {

        if (
          gameState.winner === "draw"
        ) {

          setResult("Draw!");

        }
        else if (
          gameState.winner === playerNumber
        ) {

          setResult("You won! 🎉");

        }
        else {

          setResult("You lost!");

        }

      }
      else {

        setResult(null);

      }


      // Restore scores

      const serverScores =
        data.scores || {
          1: 0,
          2: 0
        };


      setScores({

        you:
          serverScores[playerNumber] || 0,

        opponent:
          serverScores[
          playerNumber === 1 ? 2 : 1
          ] || 0

      });

    }, [playerNumber]);


  // ==========================================
  // ROUND RESULT
  // ==========================================

  const handleRoundResult =
    useCallback((data) => {

      console.log(
        "RPS round result:",
        data
      );


      setPlayerChoice(
        playerNumber === 1
          ? data.player1Choice
          : data.player2Choice
      );


      setOpponentChoice(
        playerNumber === 1
          ? data.player2Choice
          : data.player1Choice
      );


      if (
        data.winner === "draw"
      ) {

        setResult("Draw!");

      }
      else if (
        data.winner === playerNumber
      ) {

        setResult("You won! 🎉");

      }
      else {

        setResult("You lost!");

      }


      const serverScores =
        data.scores || {
          1: 0,
          2: 0
        };


      setScores({

        you:
          serverScores[playerNumber] || 0,

        opponent:
          serverScores[
          playerNumber === 1 ? 2 : 1
          ] || 0

      });

    }, [playerNumber]);


  // ==========================================
  // GAME RESTARTED
  // ==========================================

  const handleGameRestarted =
    useCallback((data) => {

      console.log(
        "RPS game restarted:",
        data
      );


      const gameState =
        data.gameState;


      if (!gameState) {

        console.error(
          "Restarted RPS game state is missing"
        );

        return;

      }


      // New round → clear choices

      setPlayerChoice(null);

      setOpponentChoice(null);

      setResult(null);


      // Keep scores

      const serverScores =
        data.scores || {
          1: 0,
          2: 0
        };


      setScores({

        you:
          serverScores[playerNumber] || 0,

        opponent:
          serverScores[
          playerNumber === 1 ? 2 : 1
          ] || 0

      });

    }, [playerNumber]);


  // ==========================================
  // PLAY AGAIN HOOK
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
  // SOCKET EVENTS
  // ==========================================

  useEffect(() => {

    socket.on(
      "gameStarted",
      handleGameStarted
    );

    socket.on(
      "rpsRoundResult",
      handleRoundResult
    );


    // ========================================
    // START / RESTORE GAME
    // ========================================

    const startGame = () => {

      console.log(
        "Requesting RPS game state..."
      );

      socket.emit(
        "startGame",
        {
          roomId,
          game: "rps"
        }
      );

    };


    if (socket.connected) {

      startGame();

    }
    else {

      socket.once(
        "connect",
        startGame
      );

    }


    return () => {

      socket.off(
        "gameStarted",
        handleGameStarted
      );

      socket.off(
        "rpsRoundResult",
        handleRoundResult
      );

      socket.off(
        "connect",
        startGame
      );

    };

  }, [
    roomId,
    handleGameStarted,
    handleRoundResult
  ]);


  // ==========================================
  // MAKE CHOICE
  // ==========================================

  const handleChoiceClick =
    (choice) => {

      if (playerChoice) {
        return;
      }


      console.log(
        "Player selected:",
        choice
      );


      setPlayerChoice(choice);


      socket.emit(
        "rpsChoice",
        {
          roomId,
          choice
        }
      );

    };


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

        <RPSBoard
          playerChoice={
            playerChoice
          }

          opponentChoice={
            opponentChoice
          }

          result={
            result
          }

          scores={
            scores
          }

          onChoiceClick={
            handleChoiceClick
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
          PLAY AGAIN REQUEST
      ====================================== */}

      <PlayAgainModal
        request={
          playAgainRequest
        }

        gameName={
          game?.name ||
          "Rock Paper Scissors"
        }

        onRespond={
          respondToPlayAgain
        }
      />


      {/* =====================================
          PLAY AGAIN DECLINED
      ====================================== */}

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


export default RockPaperScissors;