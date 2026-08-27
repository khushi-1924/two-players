import { rooms } from "../sockets/roomStore.js";

import gameRegistry from "../games/gameRegistry.js";


const gameHandler = (io, socket) => {

    socket.on(
        "startGame",
        ({ roomId, game }) => {

            console.log(
                `${socket.id} wants to start ${game} in room ${roomId}`
            );


            // =============================================
            // FIND ROOM
            // =============================================

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


            // =============================================
            // CHECK PLAYER
            // =============================================

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


            // =============================================
            // CHECK IF GAME EXISTS IN REGISTRY
            // =============================================

            const selectedGame =
                gameRegistry[game];


            if (!selectedGame) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Game not supported"
                    }
                );

                return;
            }


            // =============================================
            // RESTORE CURRENT GAME
            // =============================================

            if (room.currentGame) {

                console.log(
                    `Restoring ${room.currentGame.name} in room ${roomId}`
                );


                socket.emit(
                    "gameStarted",
                    {
                        game:
                            room.currentGame.name,

                        gameState:
                            room.currentGame,

                        scores:
                            room.scores
                    }
                );

                return;
            }


            // =============================================
            // CREATE NEW GAME
            // =============================================

            room.currentGame =
                selectedGame.createGame();


            console.log(
                `${game} started in room ${roomId}`
            );


            // =============================================
            // SEND GAME TO BOTH PLAYERS
            // =============================================

            io.to(roomId).emit(
                "gameStarted",
                {
                    game,

                    gameState:
                        room.currentGame,

                    scores:
                        room.scores
                }
            );

        }
    );

};


export default gameHandler;