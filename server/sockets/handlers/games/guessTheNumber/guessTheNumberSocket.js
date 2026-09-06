import { rooms } from "../../../roomStore.js";

import getPublicGameState
    from "../../../../games/getPublicGameState.js";

import {
    validateSecretNumber,
    validateGuess,
    calculateGuessResult
} from "./guessTheNumberUtils.js";


// =====================================================
// HELPER — SEND PRIVATE GAME STATE TO BOTH PLAYERS
// =====================================================

const broadcastGameState = (
    io,
    room
) => {

    room.players.forEach((roomPlayer) => {

        const playerSocket =
            io.sockets.sockets.get(
                roomPlayer.socketId
            );

        if (!playerSocket) {
            return;
        }

        playerSocket.emit(
            "gameStateUpdated",
            {
                gameState:
                    getPublicGameState(
                        room.currentGame,
                        roomPlayer.playerNumber
                    )
            }
        );

    });

};


// =====================================================
// GAME SOCKET
// =====================================================

const guessTheNumberSocket = (
    io,
    socket
) => {


    // =================================================
    // CHOOSE NUMBER OF DIGITS
    // =================================================

    socket.on(
        "chooseDigitLength",
        ({ roomId, digitLength }) => {

            const room = rooms[roomId];

            if (!room) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Room not found"
                    }
                );

                return;
            }


            const game =
                room.currentGame;


            if (
                !game ||
                game.name !== "guessTheNumber"
            ) {

                return;

            }


            // -----------------------------------------
            // FIND PLAYER
            // -----------------------------------------

            const player =
                room.players.find(
                    (p) =>
                        p.socketId === socket.id
                );


            if (!player) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "You are not in this room"
                    }
                );

                return;
            }


            // -----------------------------------------
            // CHECK GAME PHASE
            // -----------------------------------------

            if (
                game.status !==
                "choosingDigits"
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Number of digits has already been chosen"
                    }
                );

                return;
            }


            // -----------------------------------------
            // VALIDATE DIGIT LENGTH
            // -----------------------------------------

            if (
                ![3, 4, 5].includes(
                    digitLength
                )
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Digit length must be 3, 4, or 5"
                    }
                );

                return;
            }


            // -----------------------------------------
            // SAVE CHOICE
            // -----------------------------------------

            game.digitLength =
                digitLength;

            game.digitLengthChosenBy =
                player.playerNumber;


            game.status =
                "choosingNumbers";


            console.log(
                `Player ${player.playerNumber} chose ${digitLength} digits`
            );


            // -----------------------------------------
            // SEND UPDATED STATE
            // -----------------------------------------

            broadcastGameState(
                io,
                room
            );

        }
    );


    // =================================================
    // SUBMIT SECRET NUMBER
    // =================================================

    socket.on(
        "submitSecretNumber",
        ({ roomId, number }) => {

            const room = rooms[roomId];

            if (!room) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Room not found"
                    }
                );

                return;
            }


            const game =
                room.currentGame;


            if (
                !game ||
                game.name !== "guessTheNumber"
            ) {

                return;
            }


            // -----------------------------------------
            // FIND PLAYER
            // -----------------------------------------

            const player =
                room.players.find(
                    (p) =>
                        p.socketId === socket.id
                );


            if (!player) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "You are not in this room"
                    }
                );

                return;
            }


            const playerNumber =
                player.playerNumber;


            // -----------------------------------------
            // CHECK PHASE
            // -----------------------------------------

            if (
                game.status !==
                "choosingNumbers"
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "You cannot choose a number right now"
                    }
                );

                return;
            }


            // -----------------------------------------
            // CHECK IF ALREADY SUBMITTED
            // -----------------------------------------

            if (
                game.numbersSubmitted[
                    playerNumber
                ]
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "You have already submitted your number"
                    }
                );

                return;
            }


            // -----------------------------------------
            // NORMALIZE INPUT
            // -----------------------------------------

            const secretNumber =
                String(number);


            // -----------------------------------------
            // VALIDATE NUMBER
            // -----------------------------------------

            const validation =
                validateSecretNumber(
                    secretNumber,
                    game.digitLength
                );


            if (!validation.valid) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            validation.message
                    }
                );

                return;
            }


            // -----------------------------------------
            // SAVE SECRET NUMBER
            // -----------------------------------------

            game.secretNumbers[
                playerNumber
            ] = secretNumber;


            game.numbersSubmitted[
                playerNumber
            ] = true;


            // -----------------------------------------
            // TELL THIS PLAYER THEIR NUMBER
            // WAS SAVED
            // -----------------------------------------

            socket.emit(
                "secretNumberSaved",
                {
                    message:
                        "Your secret number has been saved"
                }
            );


            // -----------------------------------------
            // CHECK IF BOTH PLAYERS SUBMITTED
            // -----------------------------------------

            const bothSubmitted =
                game.numbersSubmitted[1] &&
                game.numbersSubmitted[2];


            if (!bothSubmitted) {

                broadcastGameState(
                    io,
                    room
                );

                return;
            }


            // -----------------------------------------
            // START GAME
            // -----------------------------------------

            game.status =
                "playing";


            game.currentPlayer =
                game.startingPlayer;


            console.log(
                "Both players submitted numbers."
            );


            console.log(
                `Player ${game.currentPlayer} starts guessing.`
            );


            broadcastGameState(
                io,
                room
            );

        }
    );


    // =================================================
    // SUBMIT GUESS
    // =================================================

    socket.on(
        "submitGuess",
        ({ roomId, guess }) => {

            const room = rooms[roomId];

            if (!room) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Room not found"
                    }
                );

                return;
            }


            const game =
                room.currentGame;


            if (
                !game ||
                game.name !== "guessTheNumber"
            ) {

                return;
            }


            // -----------------------------------------
            // FIND PLAYER
            // -----------------------------------------

            const player =
                room.players.find(
                    (p) =>
                        p.socketId === socket.id
                );


            if (!player) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "You are not in this room"
                    }
                );

                return;
            }


            const playerNumber =
                player.playerNumber;


            // -----------------------------------------
            // CHECK GAME STATUS
            // -----------------------------------------

            if (
                game.status !== "playing"
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Game is not currently being played"
                    }
                );

                return;
            }


            // -----------------------------------------
            // CHECK TURN
            // -----------------------------------------

            if (
                game.currentPlayer !==
                playerNumber
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "It is not your turn"
                    }
                );

                return;
            }


            // -----------------------------------------
            // NORMALIZE GUESS
            // -----------------------------------------

            const currentGuess =
                String(guess);


            // -----------------------------------------
            // VALIDATE GUESS
            // -----------------------------------------

            const validation =
                validateGuess(
                    currentGuess,
                    game.digitLength
                );


            if (!validation.valid) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            validation.message
                    }
                );

                return;
            }


            // -----------------------------------------
            // FIND OPPONENT
            // -----------------------------------------

            const opponentNumber =
                playerNumber === 1
                    ? 2
                    : 1;


            const opponentSecret =
                game.secretNumbers[
                    opponentNumber
                ];


            // -----------------------------------------
            // CALCULATE RESULT
            // -----------------------------------------

            const result =
                calculateGuessResult(
                    opponentSecret,
                    currentGuess
                );


            // -----------------------------------------
            // SAVE GUESS
            // -----------------------------------------

            game.guesses[
                playerNumber
            ].push({

                guess: currentGuess,

                correctDigits:
                    result.correctDigits,

                correctPositions:
                    result.correctPositions

            });


            // -----------------------------------------
            // CHECK WIN
            // -----------------------------------------

            const hasWon =
                result.correctPositions ===
                game.digitLength;


            if (hasWon) {

                game.status =
                    "finished";

                game.winner =
                    playerNumber;

                game.currentPlayer =
                    null;


                // Increase score
                room.scores[
                    playerNumber
                ] =
                    (
                        room.scores[
                            playerNumber
                        ] || 0
                    ) + 1;


                console.log(
                    `Player ${playerNumber} guessed correctly and won!`
                );


                // Send private game state
                // to each player
                room.players.forEach(
                    (roomPlayer) => {

                        const playerSocket =
                            io.sockets.sockets.get(
                                roomPlayer.socketId
                            );


                        if (!playerSocket) {
                            return;
                        }


                        playerSocket.emit(
                            "gameOver",
                            {

                                gameState:
                                    getPublicGameState(
                                        game,
                                        roomPlayer.playerNumber
                                    ),

                                scores:
                                    room.scores

                            }
                        );

                    }
                );


                return;
            }


            // -----------------------------------------
            // SWITCH TURN
            // -----------------------------------------

            game.currentPlayer =
                opponentNumber;


            // -----------------------------------------
            // SEND UPDATED STATE
            // -----------------------------------------

            broadcastGameState(
                io,
                room
            );

        }
    );

};


export default guessTheNumberSocket;