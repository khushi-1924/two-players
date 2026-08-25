import { rooms } from "../roomStore.js";


const restartTicTacToe = (room) => {

    const previousStarter =
        room.currentGame.startingPlayer || 1;


    const nextStarter =
        previousStarter === 1
            ? 2
            : 1;


    room.currentGame = {

        name: "ticTacToe",

        board:
            Array(9).fill(null),

        currentPlayer:
            nextStarter,

        startingPlayer:
            nextStarter,

        status: "playing",

        winner: null,

        winningCells: [],

        draw: false

    };


    return room.currentGame;

};


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
                        message:
                            "Room not found"
                    }
                );

                return;
            }


            if (!room.currentGame) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "No game found"
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


            console.log(
                `${player.name} requested Play Again`
            );


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


            // =================================================
            // DECLINED
            // =================================================

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


            // =================================================
            // ACCEPTED
            // =================================================

            const gameName =
                room.currentGame.name;


            let restartedGame;


            if (
                gameName === "ticTacToe"
            ) {

                restartedGame =
                    restartTicTacToe(room);

            } else {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Restart not supported"
                    }
                );

                return;
            }


            room.playAgainRequest = null;


            io.to(roomId).emit(
                "gameRestarted",
                {
                    game:
                        restartedGame.name,

                    board:
                        restartedGame.board,

                    currentPlayer:
                        restartedGame.currentPlayer,

                    scores:
                        room.scores
                }
            );

        }
    );

};

export default playAgainHandler;