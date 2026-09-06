import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import socket from "../../socket/socket";

import "./GuessTheNumber.css";


const GuessTheNumber = () => {

  const location = useLocation();

  const game = location.state?.game;


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

    };


    const handleGameOver = (data) => {

      console.log(
        "Guess the Number game over:",
        data
      );

      if (data.gameState) {
        setGameState(
          data.gameState
        );
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

      <div className="guess-game-page">

        <div className="guess-game-container">

          <div className="guess-game-header">

            <h1 className="guess-game-title">
              {game?.name ||
                "Guess The Number"}
            </h1>

            <p className="guess-game-description">
              {game?.description ||
                "Guess your opponent's secret number."}
            </p>

          </div>


          <div className="guess-card">

            <p className="guess-status-text">
              Waiting for the game to start...
            </p>

          </div>

        </div>

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


  // =================================================
  // RENDER
  // =================================================

  return (

    <div className="guess-game-page">

      <div className="guess-game-container">


        {/* =====================================
                    HEADER
                ===================================== */}

        <div className="guess-game-header">

          <h1 className="guess-game-title">
            {game?.name ||
              "Guess The Number"}
          </h1>

          <p className="guess-game-description">
            Guess your opponent's secret number
            before they guess yours!
          </p>

        </div>


        {/* =====================================
                    ERROR
                ===================================== */}

        {error && (

          <div className="guess-error">
            {error}
          </div>

        )}


        {/* =====================================
                    SUCCESS MESSAGE
                ===================================== */}

        {message && !error && (

          <div className="guess-message">
            {message}
          </div>

        )}


        {/* =====================================
                    CHOOSE DIGITS
                ===================================== */}

        {gameState.status ===
          "choosingDigits" && (

            <div className="guess-card">

              <h2>
                Choose Number Length
              </h2>

              <p className="guess-card-description">

                Choose whether you want to
                play with a 3, 4, or 5 digit
                number.

              </p>


              <div className="digit-options">

                {[3, 4, 5].map(
                  (digits) => (

                    <button
                      key={digits}
                      className={
                        `digit-option ${selectedDigitLength ===
                          digits
                          ? "selected"
                          : ""
                        }`
                      }
                      onClick={() =>
                        chooseDigitLength(
                          digits
                        )
                      }
                    >

                      <span className="digit-number">
                        {digits}
                      </span>

                      <span className="digit-label">
                        Digits
                      </span>

                    </button>

                  )
                )}

              </div>

            </div>

          )}


        {/* =====================================
                    CHOOSING SECRET NUMBER
                ===================================== */}

        {gameState.status ===
          "choosingNumbers" && (

            <div className="guess-card">

              <h2>
                Choose Your Secret Number
              </h2>


              <p className="guess-card-description">

                Choose a{" "}
                <strong>
                  {gameState.digitLength}
                  -digit
                </strong>{" "}
                number with no repeated
                digits.

              </p>


              <div className="secret-number-input-area">

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
                  className="number-input"
                  disabled={
                    gameState.numbersSubmitted?.[
                    playerNumber
                    ]
                  }
                />


                <button
                  className="guess-primary-button"
                  onClick={
                    submitSecretNumber
                  }
                  disabled={
                    gameState.numbersSubmitted?.[
                    playerNumber
                    ]
                  }
                >
                  {gameState.numbersSubmitted?.[
                    playerNumber
                  ]
                    ? "Number Saved"
                    : "Confirm Number"}
                </button>

              </div>


              <div className="number-rules">

                <p>✓ Exactly {gameState.digitLength} digits</p>

                <p>✓ No repeated digits</p>

                <p>✓ Cannot start with 0</p>

              </div>


              <div className="opponent-status">

                <span className={
                  gameState.numbersSubmitted?.[
                    playerNumber === 1
                      ? 2
                      : 1
                  ]
                    ? "status-dot ready"
                    : "status-dot"
                } />

                {gameState.numbersSubmitted?.[
                  playerNumber === 1
                    ? 2
                    : 1
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

              <div className={
                `turn-card ${isMyTurn
                  ? "my-turn"
                  : "opponent-turn"
                }`
              }>

                <div className="turn-icon">

                  {isMyTurn
                    ? "🎯"
                    : "⏳"}

                </div>


                <div>

                  <h2>

                    {isMyTurn
                      ? "Your Turn"
                      : "Opponent's Turn"}

                  </h2>


                  <p>

                    {isMyTurn
                      ? `Guess the ${gameState.digitLength}-digit number`
                      : "Wait for your opponent to make a guess."}

                  </p>

                </div>

              </div>


              {/* GUESS INPUT */}

              {isMyTurn && (

                <div className="guess-card">

                  <h2>
                    Make Your Guess
                  </h2>


                  <div className="guess-input-area">

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
                      className="number-input"
                      autoFocus
                    />


                    <button
                      className="guess-primary-button"
                      onClick={
                        submitGuess
                      }
                    >
                      Guess
                    </button>

                  </div>


                  <p className="input-hint">

                    Enter a {gameState.digitLength}
                    -digit number with no
                    repeated digits.

                  </p>

                </div>

              )}


              {/* MY GUESS HISTORY */}

              <div className="guess-card">

                <div className="history-header">

                  <h2>
                    Your Guesses
                  </h2>

                  <span className="guess-count">
                    {myGuesses.length}
                  </span>

                </div>


                {myGuesses.length === 0 ? (

                  <div className="empty-history">

                    <span>🔍</span>

                    <p>
                      Your guesses will
                      appear here.
                    </p>

                  </div>

                ) : (

                  <div className="guess-history">

                    <div className="history-row history-heading">

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
                          className="history-row"
                          key={index}
                        >

                          <span className="guess-value">
                            {item.guess}
                          </span>

                          <span>
                            {item.correctDigits}
                          </span>

                          <span>
                            {item.correctPositions}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            </>

          )}


        {/* =====================================
                    GAME OVER
                ===================================== */}

        {isFinished && (

          <div className={
            `winner-card ${iWon
              ? "winner"
              : "loser"
            }`
          }>

            <div className="winner-icon">

              {iWon
                ? "🏆"
                : "😔"}

            </div>


            <h2>

              {iWon
                ? "You Won!"
                : "You Lost!"}

            </h2>


            <p>

              {iWon
                ? "You guessed your opponent's number!"
                : "Your opponent guessed your number first."}

            </p>


            <div className="final-result">

              <span>
                Winner
              </span>

              <strong>
                Player {gameState.winner}
              </strong>

            </div>


            {/* Show own guesses */}

            {myGuesses.length > 0 && (

              <div className="final-history">

                <h3>
                  Your Guesses
                </h3>

                <div className="guess-history">

                  {myGuesses.map(
                    (item, index) => (

                      <div
                        className="history-row"
                        key={index}
                      >

                        <span className="guess-value">
                          {item.guess}
                        </span>

                        <span>
                          {item.correctDigits}
                        </span>

                        <span>
                          {item.correctPositions}
                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );

};


export default GuessTheNumber;