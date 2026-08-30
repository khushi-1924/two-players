import { rooms } from "../../../roomStore.js";


// =====================================================
// VALID RPS CHOICES
// =====================================================

const validChoices = [
    "rock",
    "paper",
    "scissors"
];


// =====================================================
// DETERMINE WINNER
// =====================================================

const getWinner = (
    player1Choice,
    player2Choice
) => {

    // DRAW
    if (
        player1Choice === player2Choice
    ) {
        return "draw";
    }


    // PLAYER 1 WINS
    if (
        (player1Choice === "rock" &&
            player2Choice === "scissors") ||

        (player1Choice === "paper" &&
            player2Choice === "rock") ||

        (player1Choice === "scissors" &&
            player2Choice === "paper")
    ) {

        return 1;
    }


    // PLAYER 2 WINS
    return 2;
};


// =====================================================
// ROCK PAPER SCISSORS SOCKET
// =====================================================

const rockPaperScissorsSocket = (
    io,
    socket
) => {


    // =================================================
    // MAKE RPS CHOICE
    // =================================================

    socket.on(
        "rpsChoice",
        ({ roomId, choice }) => {

            console.log(
                "========== RPS CHOICE RECEIVED =========="
            );

            console.log(
                "Socket:",
                socket.id
            );

            console.log(
                "Room:",
                roomId
            );

            console.log(
                "Choice:",
                choice
            );

            const room = rooms[roomId];


            // =============================================
            // ROOM CHECK
            // =============================================

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


            // =============================================
            // GAME CHECK
            // =============================================

            const game =
                room.currentGame;

            console.log(
                "CURRENT RPS GAME:",
                game
            );

            console.log(
                "GAME CHOICES:",
                game?.choices
            );


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
                game.name !== "rps"
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Rock Paper Scissors is not the current game"
                    }
                );

                return;
            }


            // =============================================
            // GAME ALREADY FINISHED
            // =============================================

            if (
                game.status === "finished"
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Round is already over"
                    }
                );

                return;
            }


            // =============================================
            // VALIDATE CHOICE
            // =============================================

            if (
                !validChoices.includes(
                    choice
                )
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "Invalid choice"
                    }
                );

                return;
            }


            // =============================================
            // FIND PLAYER
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
            // CHECK CONNECTION
            // =============================================

            if (
                !player.connected
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "You are disconnected"
                    }
                );

                return;
            }


            // =============================================
            // PREVENT SECOND CHOICE
            // =============================================

            if (
                game.choices[
                player.playerNumber
                ] !== null
            ) {

                socket.emit(
                    "gameError",
                    {
                        message:
                            "You have already made your choice"
                    }
                );

                return;
            }


            // =============================================
            // SAVE CHOICE
            // =============================================

            game.choices[
                player.playerNumber
            ] = choice;


            console.log(
                `${player.name} chose ${choice}`
            );


            // =============================================
            // CHECK IF BOTH HAVE CHOSEN
            // =============================================

            const player1Choice =
                game.choices[1];

            const player2Choice =
                game.choices[2];


            // =============================================
            // WAIT FOR OTHER PLAYER
            // =============================================

            if (
                player1Choice === null ||
                player2Choice === null
            ) {

                socket.emit(
                    "rpsChoiceSaved"
                );

                socket.to(roomId).emit(
                    "rpsOpponentWaiting"
                );

                return;
            }


            // =============================================
            // DETERMINE WINNER
            // =============================================

            const winner =
                getWinner(
                    player1Choice,
                    player2Choice
                );


            game.winner =
                winner;

            game.status =
                "finished";


            // =============================================
            // UPDATE SCORE
            // =============================================

            if (
                winner === 1 ||
                winner === 2
            ) {

                room.scores[
                    winner
                ]++;

            }


            console.log(
                `RPS round finished in room ${roomId}`
            );

            console.log(
                `Player 1: ${player1Choice}`
            );

            console.log(
                `Player 2: ${player2Choice}`
            );

            console.log(
                `Winner: ${winner}`
            );


            // =============================================
            // SEND RESULT
            // =============================================

            io.to(roomId).emit(
                "rpsRoundResult",
                {
                    player1Choice,

                    player2Choice,

                    winner,

                    scores:
                        room.scores
                }
            );

        }
    );

};


export default rockPaperScissorsSocket;