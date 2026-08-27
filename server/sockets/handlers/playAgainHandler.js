import { rooms } from "../roomStore.js";

import gameRegistry from "../../games/gameRegistry.js";


const playAgainHandler = (io, socket) => {


    // =====================================================
    // REQUEST PLAY AGAIN
    // =====================================================

    socket.on(
        "playAgainRequest",
        ({ roomId }) => {

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


            if (!room.currentGame) {

                socket.emit(
                    "gameError",
                    {
                        message: "No game found"
                    }
                );

                return;
            }


            if (
                room.currentGame.status !==
                "finished"
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Game is still in progress"
                    }
                );

                return;
            }


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


            if (room.playAgainRequest) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "A Play Again request is already pending"
                    }
                );

                return;
            }


            const opponent =
                room.players.find(
                    p =>
                        p.playerNumber !==
                        player.playerNumber
                );


            if (
                !opponent ||
                !opponent.connected
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Opponent is not connected"
                    }
                );

                return;
            }


            room.playAgainRequest = {

                from:
                    player.playerNumber

            };


            io.to(
                opponent.socketId
            ).emit(
                "playAgainRequested",
                {
                    playerName:
                        player.name,

                    game:
                        room.currentGame.name
                }
            );

        }
    );


    // =====================================================
    // RESPOND TO PLAY AGAIN
    // =====================================================

    socket.on(
        "playAgainResponse",
        ({ roomId, accepted }) => {

            const room = rooms[roomId];


            if (!room) {
                return;
            }


            if (
                !room.playAgainRequest
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "No Play Again request"
                    }
                );

                return;
            }


            const player =
                room.players.find(
                    p =>
                        p.socketId === socket.id
                );


            if (!player) {
                return;
            }


            const requester =
                room.players.find(
                    p =>
                        p.playerNumber ===
                        room.playAgainRequest.from
                );


            // =============================================
            // DECLINED
            // =============================================

            if (!accepted) {

                if (requester) {

                    io.to(
                        requester.socketId
                    ).emit(
                        "playAgainDeclined",
                        {
                            playerName:
                                player.name
                        }
                    );

                }


                room.playAgainRequest = null;

                return;
            }


            // =============================================
            // ACCEPTED
            // =============================================

            const gameName =
                room.currentGame.name;


            const game =
                gameRegistry[gameName];


            if (!game) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Game restart not supported"
                    }
                );

                return;
            }


            const restartedGame =
                game.restartGame(
                    room.currentGame
                );


            room.currentGame =
                restartedGame;


            room.playAgainRequest = null;


            io.to(roomId).emit(
                "gameRestarted",
                {
                    game:
                        restartedGame.name,

                    gameState:
                        restartedGame,

                    scores:
                        room.scores
                }
            );

        }
    );

};


export default playAgainHandler;