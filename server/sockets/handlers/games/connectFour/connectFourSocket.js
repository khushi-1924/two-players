import { rooms } from "../../../roomStore.js";


// =====================================================
// BOARD CONSTANTS
// =====================================================

const ROWS = 6;
const COLS = 7;


// =====================================================
// CHECK WINNER
// =====================================================

const checkWinner = (board, row, col, player) => {

    const directions = [

        // Horizontal
        [0, 1],

        // Vertical
        [1, 0],

        // Diagonal \
        [1, 1],

        // Diagonal /
        [1, -1]

    ];


    for (const [rowDirection, colDirection]
        of directions) {

        let count = 1;

        const winningCells = [
            [row, col]
        ];


        // =============================================
        // ONE DIRECTION
        // =============================================

        let r =
            row + rowDirection;

        let c =
            col + colDirection;


        while (

            r >= 0 &&
            r < ROWS &&
            c >= 0 &&
            c < COLS &&
            board[r][c] === player

        ) {

            count++;

            winningCells.push([r, c]);

            r += rowDirection;

            c += colDirection;

        }


        // =============================================
        // OPPOSITE DIRECTION
        // =============================================

        r =
            row - rowDirection;

        c =
            col - colDirection;


        while (

            r >= 0 &&
            r < ROWS &&
            c >= 0 &&
            c < COLS &&
            board[r][c] === player

        ) {

            count++;

            winningCells.push([r, c]);

            r -= rowDirection;

            c -= colDirection;

        }


        // =============================================
        // FOUR IN A ROW
        // =============================================

        if (count >= 4) {

            return winningCells;

        }

    }


    return null;

};


// =====================================================
// CHECK DRAW
// =====================================================

const checkDraw = (board) => {

    return board[0].every(
        cell => cell !== null
    );

};


// =====================================================
// CONNECT FOUR SOCKET
// =====================================================

const connectFourSocket = (
    io,
    socket
) => {

    socket.on(
        "connectFourMove",
        ({
            roomId,
            column
        }) => {

            const room =
                rooms[roomId];


            // =========================================
            // ROOM CHECK
            // =========================================

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


            // =========================================
            // GAME CHECK
            // =========================================

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
                game.name !==
                "connectFour"
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Connect Four is not the current game"
                    }
                );

                return;

            }


            // =========================================
            // GAME FINISHED
            // =========================================

            if (
                game.status ===
                "finished"
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


            // =========================================
            // FIND PLAYER
            // =========================================

            const player =
                room.players.find(
                    p =>
                        p.socketId ===
                        socket.id
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


            // =========================================
            // CHECK TURN
            // =========================================

            if (
                player.playerNumber !==
                game.currentPlayer
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


            // =========================================
            // VALIDATE COLUMN
            // =========================================

            if (
                !Number.isInteger(column) ||
                column < 0 ||
                column >= COLS
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Invalid column"
                    }
                );

                return;

            }


            // =========================================
            // FIND EMPTY ROW
            // =========================================

            let row = -1;


            for (
                let r = ROWS - 1;
                r >= 0;
                r--
            ) {

                if (
                    game.board[r][column] ===
                    null
                ) {

                    row = r;

                    break;

                }

            }


            // =========================================
            // COLUMN FULL
            // =========================================

            if (row === -1) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "That column is full"
                    }
                );

                return;

            }


            // =========================================
            // PLACE PIECE
            // =========================================

            game.board[row][column] =
                player.playerNumber;


            // =========================================
            // CHECK WIN
            // =========================================

            const winningCells =
                checkWinner(
                    game.board,
                    row,
                    column,
                    player.playerNumber
                );


            if (winningCells) {

                game.status =
                    "finished";

                game.winner =
                    player.playerNumber;

                game.winningCells =
                    winningCells;

                game.draw =
                    false;


                room.scores[
                    player.playerNumber
                ]++;


                io.to(roomId).emit(
                    "connectFourGameOver",
                    {
                        board:
                            game.board,

                        winner:
                            game.winner,

                        winningCells:
                            game.winningCells,

                        draw:
                            false,

                        scores:
                            room.scores
                    }
                );

                return;

            }


            // =========================================
            // CHECK DRAW
            // =========================================

            if (
                checkDraw(game.board)
            ) {

                game.status =
                    "finished";

                game.winner =
                    null;

                game.winningCells =
                    [];

                game.draw =
                    true;


                io.to(roomId).emit(
                    "connectFourGameOver",
                    {
                        board:
                            game.board,

                        winner:
                            null,

                        winningCells:
                            [],

                        draw:
                            true,

                        scores:
                            room.scores
                    }
                );

                return;

            }


            // =========================================
            // SWITCH PLAYER
            // =========================================

            game.currentPlayer =
                game.currentPlayer === 1
                    ? 2
                    : 1;


            // =========================================
            // SEND UPDATED BOARD
            // =========================================

            io.to(roomId).emit(
                "connectFourBoardUpdated",
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


export default connectFourSocket;