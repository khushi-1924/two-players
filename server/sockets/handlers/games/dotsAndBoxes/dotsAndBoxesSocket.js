import { rooms } from "../../../roomStore.js";

import makeDotsAndBoxesMove from "../../../../games/dotsAndBoxes/makeMove.js";


const dotsAndBoxesSocket = (io, socket) => {

    // =====================================================
    // MAKE MOVE
    // =====================================================

    socket.on(
        "makeMove",
        ({
            roomId,
            type,
            row,
            col
        }) => {

            const room = rooms[roomId];


            // =================================================
            // FIND ROOM
            // =================================================

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


            // =================================================
            // FIND GAME
            // =================================================

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


            // =================================================
            // CHECK GAME TYPE
            // =================================================

            if (
                game.name !==
                "dotsAndBoxes"
            ) {

                return;

            }


            // =================================================
            // CHECK GAME STATUS
            // =================================================

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


            // =================================================
            // FIND PLAYER
            // =================================================

            const player =
                room.players.find(
                    (p) =>
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
            // VALIDATE MOVE TYPE
            // =================================================

            if (
                type !== "horizontal" &&
                type !== "vertical"
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Invalid line type"
                    }
                );

                return;
            }


            // =================================================
            // VALIDATE ROW / COLUMN
            // =================================================

            if (
                !Number.isInteger(row) ||
                !Number.isInteger(col)
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Invalid line position"
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
            // MAKE MOVE
            // =================================================

            const result =
                makeDotsAndBoxesMove(
                    game,
                    {
                        type,
                        row,
                        col,
                        player:
                            player.playerNumber
                    }
                );


            // =================================================
            // INVALID MOVE
            // =================================================

            if (!result.success) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            result.message
                    }
                );

                return;
            }


            console.log(
                `${player.name} played ${type} line at ${row}-${col}`
            );


            // =================================================
            // UPDATE ROOM SCORES
            // =================================================

            result.completedBoxes.forEach(
                () => {

                    room.scores[
                        player.playerNumber
                    ]++;

                }
            );


            // =================================================
            // GAME OVER
            // =================================================

            if (
                game.status ===
                "finished"
            ) {

                io.to(roomId).emit(
                    "gameOver",
                    {
                        horizontalLines:
                            game.horizontalLines,

                        verticalLines:
                            game.verticalLines,

                        boxes:
                            game.boxes,

                        currentPlayer:
                            game.currentPlayer,

                        scores:
                            room.scores,

                        winner:
                            game.winner
                    }
                );

                return;
            }


            // =================================================
            // BOARD UPDATED
            // =================================================

            io.to(roomId).emit(
                "boardUpdated",
                {
                    horizontalLines:
                        game.horizontalLines,

                    verticalLines:
                        game.verticalLines,

                    boxes:
                        game.boxes,

                    currentPlayer:
                        game.currentPlayer,

                    scores:
                        room.scores
                }
            );

        }
    );

};


export default dotsAndBoxesSocket;