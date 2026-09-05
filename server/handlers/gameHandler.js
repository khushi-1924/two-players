import { rooms } from "../sockets/roomStore.js";

import gameRegistry from "../games/gameRegistry.js";

import getPublicGameState from "../games/getPublicGameState.js";


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

            if (room.players.length !== 2) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Waiting for another player"
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

                // =============================================
                // SAME GAME → RESTORE IT
                // =============================================

                if (
                    room.currentGame.name === game
                ) {

                    console.log(
                        `Restoring ${game} in room ${roomId}`
                    );

                    // socket.emit(
                    //     "gameStarted",
                    //     {
                    //         game:
                    //             room.currentGame.name,

                    //         gameState:
                    //             room.currentGame,

                    //         scores:
                    //             room.scores
                    //     }
                    // );

                    socket.emit(
                        "gameStarted",
                        {
                            game:
                                room.currentGame.name,

                            gameState:
                                getPublicGameState(
                                    room.currentGame,
                                    player.playerNumber
                                ),

                            scores:
                                room.scores
                        }
                    );

                    return;
                }


                // =============================================
                // DIFFERENT GAME ALREADY ACTIVE
                // =============================================

                socket.emit(
                    "gameError",
                    {
                        message:
                            `Another game (${room.currentGame.name}) is already active`
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

            // io.to(roomId).emit(
            //     "gameStarted",
            //     {
            //         game,

            //         gameState:
            //             room.currentGame,

            //         scores:
            //             room.scores
            //     }
            // );

            // =============================================
            // SEND GAME TO BOTH PLAYERS
            // =============================================

            room.players.forEach((roomPlayer) => {

                io.to(roomPlayer.socketId).emit(
                    "gameStarted",
                    {
                        game,

                        gameState:
                            getPublicGameState(
                                room.currentGame,
                                roomPlayer.playerNumber
                            ),

                        scores:
                            room.scores
                    }
                );

            });

        }
    );

};


export default gameHandler;