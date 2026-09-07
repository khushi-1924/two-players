import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

import socket from "../../socket/socket";

import usePlayAgain from "../../hooks/usePlayAgain";

import PlayAgainModal from
  "../../components/PlayAgain/PlayAgainModal";

import PlayAgainNotification from
  "../../components/PlayAgain/PlayAgainNotification";

import PlayAgainButton from
  "../../components/PlayAgain/PlayAgainButton";

import { gamesList } from "../../data/gamesList";

import '../GameCommon.css';
import "../../components/Instructions/Instructions.css";
import Instructions from "../../components/Instructions/Instructions";


const GuessTheNumber = () => {

  const location = useLocation();

  const game = location.state?.game;

  const gameInfo = gamesList.find(
    (item) => item.gameId === "guessTheNumber"
  );


  // =================================================
  // ROOM INFORMATION
  // =================================================

  const roomId =
    sessionStorage.getItem("roomId");

  const playerNumber =
    Number(
      sessionStorage.getItem("playerNumber")
    );


  // =================================================
  // GAME STATE
  // =================================================

  const [gameState, setGameState] =
    useState(null);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  // =================================================
  // INPUT STATES
  // =================================================

  const [selectedDigitLength, setSelectedDigitLength] =
    useState(null);

  const [secretNumber, setSecretNumber] =
    useState("");

  const [guess, setGuess] =
    useState("");


  // =================================================
  // LISTEN FOR GAME STATE
  // =================================================

  useEffect(() => {

    const handleGameStateUpdated = ({
      gameState
    }) => {

      console.log(
        "Guess the Number state updated:",
        gameState
      );

      if (!gameState) {
        return;
      }

      setGameState(gameState);
      setError("");

    };


    const handleGameStarted = (data) => {

      console.log(
        "Guess the Number game started:",
        data
      );

      const gameState =
        data.gameState;

      if (!gameState) {
        return;
      }

      setGameState(gameState);
      setError("");

    };


    const handleGameError = ({ message }) => {

      console.error(
        "Guess the Number error:",
        message
      );

      setError(message);

    };


    const handleSecretNumberSaved = ({
      message
    }) => {

      setMessage(message);
      setError("");

      // Clear the input after saving
      setSecretNumber("");

    };


    const handleGameOver = (data) => {
      console.log(
        "Guess the Number game over:",
        data
      );

      if (data.gameState) {
        setGameState({
          ...data.gameState,
          opponentSecretNumber:
            data.opponentSecretNumber
        });
      }

      setMessage(
        "Game over!"
      );
    };


    // ==========================================
    // REGISTER SOCKET EVENTS
    // ==========================================

    socket.on(
      "gameStateUpdated",
      handleGameStateUpdated
    );

    socket.on(
      "gameStarted",
      handleGameStarted
    );

    socket.on(
      "gameError",
      handleGameError
    );

    socket.on(
      "secretNumberSaved",
      handleSecretNumberSaved
    );

    socket.on(
      "gameOver",
      handleGameOver
    );


    // ==========================================
    // REQUEST GAME FROM SERVER
    // ==========================================

    const startGame = () => {

      if (!roomId) {

        console.error(
          "Room ID not found in sessionStorage"
        );

        setError(
          "Room information could not be found."
        );

        return;
      }


      console.log(
        "Requesting Guess the Number game..."
      );


      socket.emit(
        "startGame",
        {
          roomId,
          game: "guessTheNumber"
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


    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {

      socket.off(
        "gameStateUpdated",
        handleGameStateUpdated
      );

      socket.off(
        "gameStarted",
        handleGameStarted
      );

      socket.off(
        "gameError",
        handleGameError
      );

      socket.off(
        "secretNumberSaved",
        handleSecretNumberSaved
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
  // GAME RESTARTED
  // ==========================================

  const handleGameRestarted = useCallback((data) => {
    console.log(
      "Guess the Number game restarted:",
      data
    );

    const newGameState = data.gameState;

    if (!newGameState) {
      console.error(
        "Restarted Guess the Number game state is missing"
      );

      return;
    }

    setSelectedDigitLength(null);
    setSecretNumber("");
    setGuess("");
    setError("");
    setMessage("");

    setGameState(newGameState);
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


  // =================================================
  // CHOOSE DIGIT LENGTH
  // =================================================

  const chooseDigitLength = (
    digitLength
  ) => {

    setSelectedDigitLength(
      digitLength
    );

    setError("");

    socket.emit(
      "chooseDigitLength",
      {
        roomId,
        digitLength
      }
    );

  };


  // =================================================
  // SECRET NUMBER INPUT
  // =================================================

  const handleSecretNumberChange = (
    event
  ) => {

    const value =
      event.target.value;


    if (
      /^\d*$/.test(value) &&
      (
        !gameState?.digitLength ||
        value.length <=
        gameState.digitLength
      )
    ) {

      setSecretNumber(value);

      setError("");

    }

  };


  // =================================================
  // SUBMIT SECRET NUMBER
  // =================================================

  const submitSecretNumber = () => {

    if (!gameState?.digitLength) {
      return;
    }


    if (
      secretNumber.length !==
      gameState.digitLength
    ) {

      setError(
        `Enter exactly ${gameState.digitLength} digits.`
      );

      return;
    }


    socket.emit(
      "submitSecretNumber",
      {
        roomId,
        number: secretNumber
      }
    );

  };


  // =================================================
  // GUESS INPUT
  // =================================================

  const handleGuessChange = (
    event
  ) => {

    const value =
      event.target.value;


    if (
      /^\d*$/.test(value) &&
      (
        !gameState?.digitLength ||
        value.length <=
        gameState.digitLength
      )
    ) {

      setGuess(value);

      setError("");

    }

  };


  // =================================================
  // SUBMIT GUESS
  // =================================================

  const submitGuess = () => {

    if (!gameState?.digitLength) {
      return;
    }


    if (
      guess.length !==
      gameState.digitLength
    ) {

      setError(
        `Enter exactly ${gameState.digitLength} digits.`
      );

      return;
    }


    socket.emit(
      "submitGuess",
      {
        roomId,
        guess
      }
    );


    setGuess("");

  };


  // =================================================
  // LOADING
  // =================================================

  if (!gameState) {

    return (
      <div className="game-container">
        <p className="text-white text-center">
          Loading...
        </p>
      </div>
    );

  }


  // =================================================
  // DERIVED VALUES
  // =================================================

  const isMyTurn =
    gameState.currentPlayer ===
    playerNumber;


  const myGuesses =
    gameState.guesses?.[playerNumber] ||
    [];


  const isFinished =
    gameState.status ===
    "finished";


  const iWon =
    isFinished &&
    gameState.winner ===
    playerNumber;


  const opponentNumber =
    playerNumber === 1
      ? 2
      : 1;


  // =================================================
  // RENDER
  // =================================================

  return (

    <div className="
            w-full
            min-h-[calc(100vh-80px)]
            box-border
            px-5
            pt-[30px]
            pb-[60px]
            sm:px-3.5
            sm:pt-5
            sm:pb-[45px]
            max-[500px]:px-2.5
            max-[500px]:pt-[15px]
            max-[500px]:pb-[35px]
        ">


      {/* =====================================
                            HEADER
                    ===================================== */}

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

      </div>


      {/* =====================================
                            ERROR
                    ===================================== */}

      {error && (

        <div className="
                        w-full
                        box-border
                        px-4
                        py-3
                        rounded-[10px]
                        text-center
                        mb-5
                        text-sm
                        bg-red-400/10
                        border
                        border-red-400/25
                        text-red-300
                    ">
          {error}
        </div>

      )}


      {/* =====================================
                            SUCCESS MESSAGE
                    ===================================== */}

      {/* {message && !error && (

        <div className="
                        w-full
                        box-border
                        px-4
                        py-3
                        rounded-[10px]
                        text-center
                        mb-5
                        text-sm
                        bg-emerald-400/[0.08]
                        border
                        border-emerald-400/25
                        text-emerald-200
                    ">
          {message}
        </div>

      )} */}


      {/* =====================================
                            CHOOSE DIGITS
                    ===================================== */}

      {gameState.status ===
        "choosingDigits" && (

          <div className="
                        w-full
                        p-[30px]
                        mb-[22px]
                        max-[700px]:p-[22px_16px]
                        max-[700px]:rounded-[15px]
                    ">

            <h4 className="
                            m-0
                            mb-2
                            text-blue-200
                            text-center
                            text-[clamp(21px,3vw,27px)]
                            font-semibold
                        ">
              Choose Number Length
            </h4>


            <p className="
                            text-[#cfcfcf]
                            text-center
                            leading-[1.6]
                            mx-auto
                            mb-[25px]
                            max-w-[600px]
                        ">
              Choose whether you want to
              play with a 3, 4, or 5 digit
              number.
            </p>


            <div className="
                            grid
                            grid-cols-3
                            gap-[18px]
                            max-w-[600px]
                            mx-auto
                            mt-[25px]
                            max-[700px]:gap-2.5
                            max-[500px]:gap-2
                        ">

              {[3, 4, 5].map(
                (digits) => (

                  <button
                    key={digits}
                    onClick={() =>
                      chooseDigitLength(
                        digits
                      )
                    }
                    className={`
                                        border-2
                                        rounded-2xl
                                        px-[15px]
                                        py-[25px]
                                        cursor-pointer
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        transition-all
                                        duration-200
                                        hover:-translate-y-1
                                        max-[700px]:py-5
                                        max-[700px]:px-2.5
                                        max-[500px]:py-4
                                        max-[500px]:px-1
                                        max-[500px]:rounded-xl
                                        ${selectedDigitLength === digits
                        ? "bg-[#f58acb]/25 border-[#f58acb]"
                        : "bg-[#f58acb]/[0.08] border-[#f58acb]/30 hover:bg-[#f58acb]/[0.18] hover:border-[#f58acb]"
                      }
                                    `}
                  >

                    <span className="
                                        text-[42px]
                                        font-bold
                                        text-[#f58acb]
                                        max-[700px]:text-[35px]
                                        max-[500px]:text-[30px]
                                    ">
                      {digits}
                    </span>

                    <span className="
                                        mt-1
                                        text-sm
                                        text-[#d8d8d8]
                                        max-[500px]:text-xs
                                    ">
                      Digits
                    </span>

                  </button>

                ))}

            </div>

          </div>

        )}


      {/* =====================================
                        CHOOSING SECRET NUMBER
                    ===================================== */}

      {gameState.status ===
        "choosingNumbers" && (

          <div className="
                        w-full
                        p-[30px]
                        mb-[22px]
                        max-[700px]:p-[22px_16px]
                        max-[700px]:rounded-[15px]
                    ">

            {/* Selected digit information */}

            <div className="w-1/2 mx-auto
                            flex
                            flex-col
                            items-center
                            justify-center
                            gap-1
                            p-4
                            mb-5
                            rounded-xl
                            bg-blue-500/[0.08]
                            border
                            border-blue-300/20
                        ">



              <p className="
                                    block
                                    text-white
                                    text-sm
                                ">
                {gameState.digitLengthChosenBy ===
                  playerNumber
                  ? "You chose "
                  : `Player ${gameState.digitLengthChosenBy} chose `}
                {gameState.digitLength}-digit
                numbers
              </p>

              <strong className="
                                    m-0
                                    mt-1
                                    text-[#bdbdbd]
                                ">
                Now choose your secret number
              </strong>
              <div>

              </div>

            </div>


            <p className="text-[#cfcfcf]
                            text-center
                            leading-[1.6]
                            mx-auto
                            my-[25px]
                            max-w-[600px]
                        ">
              Choose your secret{" "}
              <strong>
                {gameState.digitLength}-digit
              </strong>{" "}
              number. Keep it secret — your
              opponent will try to guess it!
            </p>


            <div className="
                            flex
                            items-center
                            justify-center
                            gap-3
                            w-full
                            max-[500px]:flex-col
                        ">

              <input
                type="text"
                inputMode="numeric"
                maxLength={
                  gameState.digitLength
                }
                value={secretNumber}
                onChange={
                  handleSecretNumberChange
                }
                placeholder={
                  "•".repeat(
                    gameState.digitLength
                  )
                }
                disabled={
                  gameState.numbersSubmitted?.[
                  playerNumber
                  ]
                }
                className="
                                    w-[min(100%,280px)]
                                    box-border
                                    px-[18px]
                                    py-3.5
                                    rounded-xl
                                    border-2
                                    border-[#f58acb]/35
                                    bg-black/25
                                    text-white
                                    text-[26px]
                                    font-semibold
                                    tracking-[8px]
                                    text-center
                                    outline-none
                                    transition-all
                                    duration-200
                                    focus:border-[#f58acb]
                                    focus:shadow-[0_0_0_3px_rgba(245,138,203,0.12)]
                                    placeholder:text-[#777]
                                    placeholder:tracking-[8px]
                                    disabled:opacity-60
                                    disabled:cursor-not-allowed
                                    max-[500px]:w-full
                                    max-[500px]:text-[23px]
                                    max-[500px]:py-3
                                    max-[500px]:tracking-[6px]
                                "
              />


              <button
                onClick={
                  submitSecretNumber
                }
                disabled={
                  gameState.numbersSubmitted?.[
                  playerNumber
                  ]
                }
                className="
                                    border-none
                                    rounded-xl
                                    px-6
                                    py-3.5
                                    bg-[#f58acb]
                                    text-white
                                    text-base
                                    font-semibold
                                    cursor-pointer
                                    whitespace-nowrap
                                    transition-all
                                    duration-200
                                    hover:-translate-y-0.5
                                    hover:opacity-90
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                    max-[500px]:w-full
                                    max-[500px]:py-[13px]
                                "
              >
                {gameState.numbersSubmitted?.[
                  playerNumber
                ]
                  ? "Number Saved"
                  : "Confirm Number"}
              </button>

            </div>


            {/* Number rules */}

            <div className="
                            flex
                            flex-wrap
                            justify-center
                            gap-x-[25px]
                            gap-y-3
                            mt-[22px]
                            max-[500px]:flex-col
                            max-[500px]:items-center
                            max-[500px]:gap-[7px]
                        ">

              <p className="
                                m-0
                                text-[#cfcfcf]
                                text-sm
                            ">
                ✓ Exactly {gameState.digitLength} digits
              </p>

              <p className="
                                m-0
                                text-[#cfcfcf]
                                text-sm
                            ">
                ✓ No repeated digits
              </p>

              <p className="
                                m-0
                                text-[#cfcfcf]
                                text-sm
                            ">
                ✓ Cannot start with 0
              </p>

            </div>


            {/* Opponent status */}

            <div className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            mt-[25px]
                            text-[#bdbdbd]
                            text-sm
                            text-center
                            max-[500px]:text-[13px]
                        ">

              <span
                className={`
                                    w-[9px]
                                    h-[9px]
                                    rounded-full
                                    flex-shrink-0
                                    ${gameState.numbersSubmitted?.[
                    opponentNumber
                  ]
                    ? "bg-[#6ee7a8] shadow-[0_0_8px_rgba(110,231,168,0.7)]"
                    : "bg-[#777]"
                  }
                                `}
              />

              {gameState.numbersSubmitted?.[
                opponentNumber
              ]
                ? "Your opponent has chosen their number."
                : "Waiting for your opponent to choose..."}

            </div>

          </div>

        )}


      {/* =====================================
                            PLAYING
                    ===================================== */}

      {gameState.status ===
        "playing" && (

          <>

            {/* TURN CARD */}

            <div className={`w-full mx-auto
                            flex flex-col
                            justify-center
                            items-center
                            px-[25px]
                            py-[22px]
                            mb-[22px]
                            rounded-[10px]
                            max-[700px]:p-[18px]
                            max-[700px]:gap-[13px]
                            max-[500px]:items-start
                            max-[500px]:p-4
                        `}>

              <h4 className="
                                    m-0
                                    mb-1
                                    text-white text-center
                                    text-[21px]
                                    font-semibold
                                    max-[500px]:text-lg
                                ">
                {isMyTurn
                  ? "Your Turn"
                  : "Opponent's Turn"}
              </h4>

              <p className="
                                    m-0
                                    text-[#bdbdbd]
                                    text-sm
                                    max-[500px]:text-[13px]
                                    max-[500px]:leading-[1.4]
                                ">
                {isMyTurn
                  ? `Guess the number`
                  : "Wait for your opponent to make a guess."}
              </p>


              <div>
              </div>

            </div>


            {/* GUESS INPUT */}

            <div className="w-full flex gap-5 px-10">
              {isMyTurn && (

                <div className="w-full
                                box-border
                                bg-white/[0.06]
                                border
                                border-white/[0.12]
                                rounded-[18px]
                                p-[30px]
                                mb-[22px]
                                backdrop-blur-[8px]
                                max-[700px]:p-[22px_16px]
                                max-[700px]:rounded-[15px]
                            ">

                  <h4 className="
                                    m-0
                                    mb-2.5
                                    text-blue-200
                                    text-center
                                    text-[clamp(21px,3vw,27px)]
                                    font-semibold
                                ">
                    Make Your Guess
                  </h4>


                  <div
                    className="
                              flex
                              flex-row
                              items-center
                              justify-center
                              gap-3
                              w-full
                              max-[500px]:flex-col
                            "
                  >

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={
                        gameState.digitLength
                      }
                      value={guess}
                      onChange={
                        handleGuessChange
                      }
                      placeholder={
                        "•".repeat(
                          gameState.digitLength
                        )
                      }
                      autoFocus
                      className=" w-[min(100%,280px)]
                                            box-border
                                            px-5
                                            py-2
                                            rounded-xl
                                            border-2
                                            border-[#f58acb]/35
                                            bg-black/25
                                            text-white
                                            text-[26px]
                                            font-semibold
                                            tracking-[8px]
                                            text-center
                                            outline-none
                                            transition-all
                                            duration-200
                                            focus:border-[#f58acb]
                                            placeholder:text-[#777]
                                            placeholder:tracking-[8px]
                                            max-[500px]:w-full
                                            max-[500px]:text-[23px]
                                            max-[500px]:py-3
                                            max-[500px]:tracking-[6px]
                                        "
                    />


                    <button
                      onClick={
                        submitGuess
                      }
                      className="
                                            border-none
                                            rounded-xl
                                            px-6
                                            py-3.5
                                            bg-pink-400
                                            text-white
                                            text-lg
                                            font-semibold
                                            cursor-pointer
                                            whitespace-nowrap
                                            transition-all
                                            duration-200
                                            hover:opacity-80
                                            max-[500px]:w-full
                                            max-[500px]:py-[13px]
                                        "
                    >
                      Guess
                    </button>

                  </div>


                  <p className="
                                    text-center
                                    text-[#999]
                                    text-[13px]
                                    mt-[15px]
                                    mb-0
                                ">
                    Enter a {gameState.digitLength}
                    -digit number with no
                    repeated digits.
                  </p>

                </div>

              )}


              {/* MY GUESS HISTORY */}

              <div className="
                            w-full
                            box-border
                            bg-white/[0.06]
                            border
                            border-white/[0.12]
                            rounded-[18px]
                            p-[30px]
                            mb-[22px]
                            backdrop-blur-[8px]
                            max-[700px]:p-[22px_16px]
                            max-[700px]:rounded-[15px]
                        ">

                <div className="
                                flex
                                items-center
                                justify-center
                                gap-2.5
                                mb-5
                            ">

                  <h4 className="
                                    m-0
                                    text-blue-200
                                    text-[clamp(21px,3vw,27px)]
                                    font-semibold
                                ">
                    Your Guesses
                  </h4>

                  <span className="
                                    min-w-[25px]
                                    h-[25px]
                                    px-[7px]
                                    rounded-[20px]
                                    flex
                                    items-center
                                    justify-center
                                    bg-[#f58acb]/[0.18]
                                    text-[#f58acb]
                                    text-[13px]
                                    font-semibold
                                ">
                    {myGuesses.length}
                  </span>

                </div>


                {myGuesses.length === 0 ? (

                  <div className="
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    p-[30px]
                                    text-[#888]
                                ">

                    <span className="
                                        text-[30px]
                                        mb-2
                                    ">
                      🔍
                    </span>

                    <p className="
                                        m-0
                                        text-sm
                                    ">
                      Your guesses will
                      appear here.
                    </p>

                  </div>

                ) : (

                  <div className="
                                    w-full
                                    overflow-x-auto
                                ">

                    <div className="
                                        min-w-[500px]
                                        grid
                                        grid-cols-[1.2fr_1fr_1.3fr]
                                        items-center
                                        text-center
                                        px-2.5
                                        py-[13px]
                                        border-b
                                        border-white/[0.08]
                                        text-[#999]
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-[0.4px]
                                        max-[500px]:min-w-[450px]
                                        max-[500px]:py-[11px]
                                        max-[500px]:px-1.5
                                        max-[500px]:text-[13px]
                                    ">

                      <span>
                        Guess
                      </span>

                      <span>
                        Correct Digits
                      </span>

                      <span>
                        Correct Positions
                      </span>

                    </div>


                    {myGuesses.map(
                      (item, index) => (

                        <div
                          className="
                                                min-w-[500px]
                                                grid
                                                grid-cols-[1.2fr_1fr_1.3fr]
                                                items-center
                                                text-center
                                                px-2.5
                                                py-[13px]
                                                border-b
                                                border-white/[0.08]
                                                text-[#dddddd]
                                                text-sm
                                                max-[500px]:min-w-[450px]
                                                max-[500px]:py-[11px]
                                                max-[500px]:px-1.5
                                                max-[500px]:text-[13px]
                                            "
                          key={index}
                        >

                          <span className="
                                                text-[#f58acb]
                                                text-lg
                                                font-semibold
                                                tracking-[3px]
                                                max-[500px]:text-base
                                                max-[500px]:tracking-[2px]
                                            ">
                            {item.guess}
                          </span>

                          <span>
                            {item.correctDigits}
                          </span>

                          <span>
                            {item.correctPositions}
                          </span>

                        </div>

                      ))}

                  </div>

                )}

              </div>
            </div>

          </>

        )}


      {/* =====================================
                            GAME OVER
                    ===================================== */}

      {isFinished && (

        <div className={`
                        px-[25px]
                        py-[35px]
                        text-center
                        rounded-[20px]
                        mb-[22px]
                        max-[500px]:px-4
                        max-[500px]:py-7
                    `}>


          <h4 className="
                            m-0
                            mb-2
                            text-blue-200
                            text-[30px]
                            font-semibold
                            max-[500px]:text-[26px]
                        ">
            {iWon
              ? "You Won!"
              : "You Lost!"}
          </h4>


          <p className="
                            m-0
                            mx-auto
                            mb-5
                            text-lg
                            leading-[1.5]
                            max-w-[500px]
                        ">
            Opponent's number: <span className="text-[#ed8bea] font-semibold">{gameState?.opponentSecretNumber}</span>
          </p>

          <br />



          {/* Show own guesses */}

          {myGuesses.length > 0 && (

            <div className="
                                max-w-[650px]
                                mx-auto
                                pt-5
                                border-t
                                border-white/[0.08]
                            ">

              <h4 className="
                                    text-white
                                    text-lg
                                    m-0
                                    mb-[15px]
                                ">
                Your Guesses
              </h4>


              <div className="
                                    w-full
                                    overflow-x-auto
                                ">

                <div className="
                                        min-w-[500px]
                                    ">

                  {myGuesses.map(
                    (item, index) => (

                      <div
                        className="
                                                    grid
                                                    grid-cols-[1.2fr_1fr_1.3fr]
                                                    items-center
                                                    text-center
                                                    px-2.5
                                                    py-[13px]
                                                    border-b
                                                    border-white/[0.08]
                                                    text-[#dddddd]
                                                    text-sm
                                                    max-[500px]:min-w-[450px]
                                                    max-[500px]:py-[11px]
                                                    max-[500px]:px-1.5
                                                    max-[500px]:text-[13px]
                                                "
                        key={index}
                      >

                        <span className="
                                                    text-[#f58acb]
                                                    text-lg
                                                    font-semibold
                                                    tracking-[3px]
                                                    max-[500px]:text-base
                                                    max-[500px]:tracking-[2px]
                                                ">
                          {item.guess}
                        </span>

                        <span>
                          {item.correctDigits}
                        </span>

                        <span>
                          {item.correctPositions}
                        </span>

                      </div>

                    ))}

                </div>

              </div>

            </div>

          )}

          <PlayAgainButton
            onClick={requestPlayAgain}
            waitingForResponse={waitingForResponse}
          />

        </div>


      )}

      {/* =====================================
            PLAY AGAIN REQUEST
    ====================================== */}

      <PlayAgainModal
        request={playAgainRequest}
        gameName={
          game?.name ||
          "Guess the Number"
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


export default GuessTheNumber;