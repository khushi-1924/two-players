import { rooms } from "../../../roomStore.js";

import {
    checkWinner,
    checkDraw
} from "./ticTacToeUtils.js";


const ticTacToeSocket = (io, socket) => {

    // =====================================================
    // START TIC TAC TOE
    // =====================================================

    socket.on(
        "startGame",
        ({ roomId, game }) => {

            console.log(
                `${socket.id} wants to start ${game} in room ${roomId}`
            );


            const room = rooms[roomId];


            if (!room) {

                socket.emit(
                    "gameError",
                    {
                        message: "Room not found"
                    }
                );

                return;
            }


            if (game !== "ticTacToe") {
                return;
            }


            // =================================================
            // CHECK PLAYER
            // =================================================

            const player =
                room.players.find(
                    p =>
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


            // =================================================
            // GAME ALREADY EXISTS
            // Used during refresh/reconnection
            // =================================================

            if (room.currentGame) {

                console.log(
                    `Restoring existing Tic Tac Toe game in room ${roomId}`
                );


                socket.emit(
                    "gameStarted",
                    {
                        game:
                            room.currentGame.name,

                        board:
                            room.currentGame.board,

                        currentPlayer:
                            room.currentGame.currentPlayer,

                        status:
                            room.currentGame.status,

                        winner:
                            room.currentGame.winner,

                        winningCells:
                            room.currentGame.winningCells,

                        draw:
                            room.currentGame.draw,

                        scores:
                            room.scores
                    }
                );

                return;
            }


            // =================================================
            // CREATE NEW GAME
            // =================================================

            room.currentGame = {

                name: "ticTacToe",

                board:
                    Array(9).fill(null),

                currentPlayer: 1,

                startingPlayer: 1,

                status: "playing",

                winner: null,

                winningCells: [],

                draw: false

            };


            console.log(
                `Tic Tac Toe started in room ${roomId}`
            );


            io.to(roomId).emit(
                "gameStarted",
                {
                    game: "ticTacToe",

                    board:
                        room.currentGame.board,

                    currentPlayer:
                        room.currentGame.currentPlayer,

                    status:
                        room.currentGame.status,

                    winner: null,

                    winningCells: [],

                    draw: false,

                    scores:
                        room.scores
                }
            );

        }
    );


    // =====================================================
    // MAKE MOVE
    // =====================================================

    socket.on(
        "makeMove",
        ({ roomId, index }) => {

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


            if (!game) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Game has not started"
                    }
                );

                return;
            }


            if (
                game.name !== "ticTacToe"
            ) {
                return;
            }


            if (
                game.status === "finished"
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Game is already over"
                    }
                );

                return;
            }


            // =================================================
            // VALIDATE INDEX
            // =================================================

            if (
                !Number.isInteger(index) ||
                index < 0 ||
                index > 8
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Invalid cell"
                    }
                );

                return;
            }


            // =================================================
            // FIND PLAYER
            // =================================================

            const player =
                room.players.find(
                    p =>
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


            // =================================================
            // CHECK CONNECTION
            // =================================================

            if (!player.connected) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "You are disconnected"
                    }
                );

                return;
            }


            // =================================================
            // CHECK TURN
            // =================================================

            if (
                player.playerNumber !==
                game.currentPlayer
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Not your turn"
                    }
                );

                return;
            }


            // =================================================
            // CHECK CELL
            // =================================================

            if (
                game.board[index] !== null
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Cell already occupied"
                    }
                );

                return;
            }


            // =================================================
            // MAKE MOVE
            // =================================================

            const symbol =
                player.playerNumber === 1
                    ? "X"
                    : "O";


            game.board[index] = symbol;


            console.log(
                `${player.name} played ${symbol} at index ${index}`
            );


            // =================================================
            // CHECK WINNER
            // =================================================

            const result =
                checkWinner(
                    game.board
                );


            if (result) {

                game.status = "finished";

                game.winner =
                    result.winner;

                game.winningCells =
                    result.cells;

                game.draw = false;


                room.scores[
                    player.playerNumber
                ]++;


                io.to(roomId).emit(
                    "gameOver",
                    {
                        board:
                            game.board,

                        winner:
                            game.winner,

                        winningCells:
                            game.winningCells,

                        draw: false,

                        scores:
                            room.scores
                    }
                );

                return;
            }


            // =================================================
            // CHECK DRAW
            // =================================================

            if (
                checkDraw(
                    game.board
                )
            ) {

                game.status = "finished";

                game.winner = null;

                game.winningCells = [];

                game.draw = true;


                io.to(roomId).emit(
                    "gameOver",
                    {
                        board:
                            game.board,

                        winner: null,

                        winningCells: [],

                        draw: true,

                        scores:
                            room.scores
                    }
                );

                return;
            }


            // =================================================
            // SWITCH PLAYER
            // =================================================

            game.currentPlayer =
                game.currentPlayer === 1
                    ? 2
                    : 1;


            io.to(roomId).emit(
                "boardUpdated",
                {
                    board:
                        game.board,

                    currentPlayer:
                        game.currentPlayer
                }
            );

        }
    );

};

export default ticTacToeSocket;