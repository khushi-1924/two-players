import { rooms } from "../../../roomStore.js";
import getPublicGameState from "../../../../games/getPublicGameState.js";

const poisonHeartsSocket = (io, socket) => {

    // -----------------------------------------
    // PLAYER CHOOSES THEIR POISON HEART
    // -----------------------------------------
    socket.on("poisonHeartChoice", ({ roomId, heartId }) => {

        const room = rooms[roomId];

        if (!room) return;

        const player = room.players.find(
            (p) => p.socketId === socket.id
        );

        if (!player) return;

        const game = room.currentGame;

        if (!game || game.name !== "poisonHearts") return;

        if (game.phase !== "poisonSelection") return;

        // Player has already selected their poison heart
        if (game.poisonChoices[player.playerNumber] !== null) {
            return;
        }

        // Validate heart ID
        if (
            typeof heartId !== "number" ||
            heartId < 0 ||
            heartId >= 36
        ) {
            return;
        }

        // Save player's poison choice
        game.poisonChoices[player.playerNumber] = heartId;

        // Tell only this player that their choice was saved
        socket.emit("poisonChoiceSaved", {
            heartId
        });

        // Check if both players have selected
        const player1Choice = game.poisonChoices[1];
        const player2Choice = game.poisonChoices[2];

        if (
            player1Choice !== null &&
            player2Choice !== null
        ) {

            game.phase = "playing";

            // Player 1 starts
            game.currentPlayer = 1;

            // Send each player their own private game state
            room.players.forEach((roomPlayer) => {

                const playerSocket = io.sockets.sockets.get(
                    roomPlayer.socketId
                );

                if (!playerSocket) return;

                playerSocket.emit("poisonSelectionComplete", {
                    gameState: getPublicGameState(
                        game,
                        roomPlayer.playerNumber
                    )
                });
            });
        }
    });


    // -----------------------------------------
    // PLAYER SELECTS A HEART DURING THE GAME
    // -----------------------------------------
    socket.on("selectPoisonHeart", ({ roomId, heartId }) => {

        const room = rooms[roomId];

        if (!room) return;

        const player = room.players.find(
            (p) => p.socketId === socket.id
        );

        if (!player) return;

        const game = room.currentGame;

        if (!game || game.name !== "poisonHearts") return;

        // Game must be in playing phase
        if (game.phase !== "playing") return;

        // Make sure it is this player's turn
        if (game.currentPlayer !== player.playerNumber) {
            return;
        }

        // Validate heart ID
        if (
            typeof heartId !== "number" ||
            heartId < 0 ||
            heartId >= 36
        ) {
            return;
        }

        // Find the heart on the board
        const row = Math.floor(heartId / 6);
        const column = heartId % 6;

        const heart = game.board[row][column];

        if (!heart) return;

        // Heart has already been selected
        if (heart.selected) return;

        // Mark heart as selected
        heart.selected = true;

        game.selectedHearts.push(heartId);

        // The poison heart belongs to the OTHER player
        const opponentNumber =
            player.playerNumber === 1 ? 2 : 1;

        const opponentPoisonHeart =
            game.poisonChoices[opponentNumber];


        // -----------------------------------------
        // PLAYER HIT THE POISON HEART
        // -----------------------------------------
        if (heartId === opponentPoisonHeart) {

            game.phase = "finished";
            game.status = "finished";
            game.winner = opponentNumber;
            game.loser = player.playerNumber;
            game.currentPlayer = null;
            game.draw = false;

            // Increase winner's score
            room.scores[opponentNumber] =
                (room.scores[opponentNumber] || 0) + 1;

            // Send private state to each player
            room.players.forEach((roomPlayer) => {

                const playerSocket = io.sockets.sockets.get(
                    roomPlayer.socketId
                );

                if (!playerSocket) return;

                playerSocket.emit("gameOver", {
                    gameState: getPublicGameState(
                        game,
                        roomPlayer.playerNumber
                    ),
                    scores: room.scores,
                    explodedHeart: heartId
                });
            });

            return;
        }


        // -----------------------------------------
        // ALL HEARTS HAVE BEEN SELECTED
        // -----------------------------------------
        if (game.selectedHearts.length === 36) {

            game.phase = "finished";
            game.status = "finished";
            game.winner = opponentNumber;
            game.loser = player.playerNumber;
            game.currentPlayer = null;
            game.draw = false;

            room.players.forEach((roomPlayer) => {

                const playerSocket = io.sockets.sockets.get(
                    roomPlayer.socketId
                );

                if (!playerSocket) return;

                playerSocket.emit("gameOver", {
                    gameState: getPublicGameState(
                        game,
                        roomPlayer.playerNumber
                    ),
                    scores: room.scores
                });
            });

            return;
        }


        // -----------------------------------------
        // CONTINUE TO NEXT PLAYER
        // -----------------------------------------
        game.currentPlayer = opponentNumber;

        // Broadcast updated state to both players
        room.players.forEach((roomPlayer) => {

            const playerSocket = io.sockets.sockets.get(
                roomPlayer.socketId
            );

            if (!playerSocket) return;

            playerSocket.emit("poisonHeartSelected", {
                gameState: getPublicGameState(
                    game,
                    roomPlayer.playerNumber
                ),
                selectedHeart: heartId
            });
        });
    });
};

export default poisonHeartsSocket;