const rooms = {};

const generateRoomId = () => {
    return Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
};


// Tic Tac Toe winning patterns
const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


// Check winner
const checkWinner = (board) => {

    for (const pattern of winningPatterns) {

        const [a, b, c] = pattern;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return {
                winner: board[a],
                cells: pattern
            };
        }
    }

    return null;
};


// Check draw
const checkDraw = (board) => {
    return board.every(cell => cell !== null);
};


const gameSocket = (io) => {

    io.on("connection", (socket) => {

        console.log("Player connected:", socket.id);


        // =====================================================
        // CREATE ROOM
        // =====================================================

        socket.on("createRoom", ({ name }) => {

            let roomId = generateRoomId();

            while (rooms[roomId]) {
                roomId = generateRoomId();
            }


            rooms[roomId] = {

                players: [],

                currentGame: null,

                // Overall room score
                scores: {
                    1: 0,
                    2: 0
                },

                playAgainRequest: null
            };


            socket.join(roomId);


            rooms[roomId].players.push({

                socketId: socket.id,

                name: name,

                playerNumber: 1

            });


            console.log(`Room created: ${roomId}`);

            console.log(`Creator: ${socket.id}`);


            socket.emit("roomCreated", {
                roomId
            });

        });


        // =====================================================
        // JOIN ROOM
        // =====================================================

        socket.on("joinRoom", ({ roomId, name }) => {

            roomId = roomId.trim().toUpperCase();


            console.log(
                `${socket.id} wants to join room: ${roomId}`
            );


            // Room doesn't exist
            if (!rooms[roomId]) {

                socket.emit("joinError", {
                    message: "Room not found"
                });

                return;
            }


            // Room already has 2 players
            if (rooms[roomId].players.length >= 2) {

                socket.emit("joinError", {
                    message: "Room is full"
                });

                return;
            }


            socket.join(roomId);


            rooms[roomId].players.push({

                socketId: socket.id,

                name: name,

                playerNumber: 2

            });


            console.log(
                `${socket.id} joined room ${roomId}`
            );


            console.log(
                "Players:",
                rooms[roomId].players
            );


            // Both players are now connected
            if (rooms[roomId].players.length === 2) {

                const players = rooms[roomId].players;


                players.forEach((player) => {

                    io.to(player.socketId).emit("roomReady", {

                        roomId,

                        players,

                        playerNumber: player.playerNumber

                    });

                });


                console.log(
                    `Room ${roomId} is ready`
                );

            }

        });


        // =====================================================
        // START GAME
        // =====================================================

        socket.on("startGame", ({ roomId, game }) => {

            console.log(
                `${socket.id} wants to start ${game} in room ${roomId}`
            );


            const room = rooms[roomId];


            // Room doesn't exist
            if (!room) {

                socket.emit("gameError", {
                    message: "Room not found"
                });

                return;
            }


            // Need exactly 2 players
            if (room.players.length !== 2) {

                socket.emit("gameError", {
                    message: "Waiting for another player"
                });

                return;
            }


            // Only Tic Tac Toe for now
            if (game !== "ticTacToe") {

                socket.emit("gameError", {
                    message: "Game not supported"
                });

                return;
            }


            // Game already exists
            if (room.currentGame) {

                console.log(
                    `Game already running in room ${roomId}`
                );


                // Send existing game state
                // to the player who requested it
                socket.emit("gameStarted", {

                    game: room.currentGame.name,

                    board: room.currentGame.board,

                    currentPlayer:
                        room.currentGame.currentPlayer

                });


                return;
            }


            // Create Tic Tac Toe game
            room.currentGame = {

                name: "ticTacToe",

                board: Array(9).fill(null),

                currentPlayer: 1,

                startingPlayer: 1,

                status: "playing",

                winner: null,

                winningCells: []

            };


            console.log(
                `Tic Tac Toe started in room ${roomId}`
            );


            // Send game state to both players
            io.to(roomId).emit("gameStarted", {

                game: "ticTacToe",

                board: room.currentGame.board,

                currentPlayer:
                    room.currentGame.currentPlayer

            });

        });


        // =====================================================
        // MAKE MOVE
        // =====================================================

        socket.on("makeMove", ({ roomId, index }) => {

            const room = rooms[roomId];


            // Room doesn't exist
            if (!room) {

                socket.emit("gameError", {
                    message: "Room not found"
                });

                return;
            }


            // No game running
            if (!room.currentGame) {

                socket.emit("gameError", {
                    message: "Game has not started"
                });

                return;
            }


            const game = room.currentGame;


            // Make sure this is Tic Tac Toe
            if (game.name !== "ticTacToe") {
                return;
            }


            // Game already finished
            if (game.status === "finished") {

                socket.emit("gameError", {
                    message: "Game is already over"
                });

                return;
            }


            // Validate cell index
            if (
                !Number.isInteger(index) ||
                index < 0 ||
                index > 8
            ) {

                socket.emit("gameError", {
                    message: "Invalid cell"
                });

                return;
            }


            // Find the player
            const player = room.players.find(
                (p) => p.socketId === socket.id
            );


            if (!player) {

                socket.emit("gameError", {
                    message: "You are not in this room"
                });

                return;
            }


            // Check whose turn it is
            if (
                player.playerNumber !==
                game.currentPlayer
            ) {

                socket.emit("gameError", {
                    message: "Not your turn"
                });

                return;
            }


            // Check if cell is already occupied
            if (game.board[index] !== null) {

                socket.emit("gameError", {
                    message: "Cell already occupied"
                });

                return;
            }


            // Determine symbol
            const symbol =
                player.playerNumber === 1
                    ? "X"
                    : "O";


            // Make move
            game.board[index] = symbol;


            console.log(
                `${player.name} played ${symbol} at index ${index}`
            );


            // =================================================
            // CHECK WINNER
            // =================================================

            const result = checkWinner(game.board);


            if (result) {

                game.status = "finished";

                game.winner = result.winner;

                game.winningCells = result.cells;


                // Update overall room score
                const winnerPlayer =
                    player.playerNumber;

                room.scores[winnerPlayer]++;


                console.log(
                    `${player.name} won Tic Tac Toe`
                );


                // Send game over to both players
                io.to(roomId).emit("gameOver", {

                    board: game.board,

                    winner: result.winner,

                    winningCells: result.cells,

                    draw: false,

                    scores: room.scores

                });


                return;
            }


            // =================================================
            // CHECK DRAW
            // =================================================

            if (checkDraw(game.board)) {

                game.status = "finished";

                game.winner = null;

                game.winningCells = [];


                console.log(
                    `Tic Tac Toe ended in a draw`
                );


                io.to(roomId).emit("gameOver", {

                    board: game.board,

                    winner: null,

                    winningCells: [],

                    draw: true,

                    scores: room.scores

                });


                return;
            }


            // =================================================
            // SWITCH TURN
            // =================================================

            game.currentPlayer =
                game.currentPlayer === 1
                    ? 2
                    : 1;


            // Send updated board to both players
            io.to(roomId).emit("boardUpdated", {

                board: game.board,

                currentPlayer:
                    game.currentPlayer

            });

        });

        // =====================================================
        // PLAY AGAIN REQUEST
        // =====================================================

        socket.on("playAgainRequest", ({ roomId }) => {

            const room = rooms[roomId];

            // Room doesn't exist
            if (!room) {
                socket.emit("gameError", {
                    message: "Room not found"
                });

                return;
            }


            // Game doesn't exist
            if (!room.currentGame) {
                socket.emit("gameError", {
                    message: "No game found"
                });

                return;
            }


            // Game must be finished
            if (room.currentGame.status !== "finished") {
                socket.emit("gameError", {
                    message: "Game is still in progress"
                });

                return;
            }


            // Find the player requesting another game
            const player = room.players.find(
                (p) => p.socketId === socket.id
            );

            if (!player) {
                socket.emit("gameError", {
                    message: "You are not in this room"
                });

                return;
            }


            // Don't allow duplicate requests
            if (room.playAgainRequest) {

                socket.emit("gameError", {
                    message: "A Play Again request is already pending"
                });

                return;
            }


            // Store the request
            room.playAgainRequest = {
                from: player.playerNumber
            };


            console.log(
                `${player.name} requested to play again in room ${roomId}`
            );


            // Find the other player
            const opponent = room.players.find(
                (p) => p.playerNumber !== player.playerNumber
            );


            if (!opponent) {
                return;
            }


            // Send request to opponent
            io.to(opponent.socketId).emit(
                "playAgainRequested",
                {
                    playerName: player.name,
                    game: room.currentGame.name
                }
            );

        });

        // =====================================================
        // PLAY AGAIN RESPONSE
        // =====================================================

        socket.on(
            "playAgainResponse",
            ({ roomId, accepted }) => {

                const room = rooms[roomId];

                // Room doesn't exist
                if (!room) {
                    socket.emit("gameError", {
                        message: "Room not found"
                    });

                    return;
                }


                // No pending request
                if (!room.playAgainRequest) {

                    socket.emit("gameError", {
                        message: "No Play Again request"
                    });

                    return;
                }


                // Find the player responding
                const player = room.players.find(
                    (p) => p.socketId === socket.id
                );

                if (!player) {

                    socket.emit("gameError", {
                        message: "You are not in this room"
                    });

                    return;
                }


                // Make sure the responder is NOT
                // the person who originally requested
                if (
                    player.playerNumber ===
                    room.playAgainRequest.from
                ) {

                    socket.emit("gameError", {
                        message: "You cannot respond to your own request"
                    });

                    return;
                }


                // Find the requester
                const requester = room.players.find(
                    (p) =>
                        p.playerNumber ===
                        room.playAgainRequest.from
                );


                // =================================================
                // DECLINED
                // =================================================

                if (!accepted) {

                    console.log(
                        `${player.name} declined Play Again`
                    );


                    if (requester) {

                        io.to(requester.socketId).emit(
                            "playAgainDeclined",
                            {
                                playerName: player.name
                            }
                        );

                    }


                    // Remove pending request
                    room.playAgainRequest = null;

                    return;
                }


                // =================================================
                // ACCEPTED
                // =================================================

                console.log(
                    `${player.name} accepted Play Again`
                );


                // Alternate who starts the next round
                const previousStarter =
                    room.currentGame.currentPlayer === null
                        ? room.currentGame.startingPlayer
                        : room.currentGame.startingPlayer;


                const nextStarter =
                    previousStarter === 1
                        ? 2
                        : 1;


                // Create a fresh Tic Tac Toe game
                room.currentGame = {

                    name: "ticTacToe",

                    board: Array(9).fill(null),

                    currentPlayer: nextStarter,

                    startingPlayer: nextStarter,

                    status: "playing",

                    winner: null,

                    winningCells: []

                };


                // Remove pending request
                room.playAgainRequest = null;


                console.log(
                    `New Tic Tac Toe round started in room ${roomId}`
                );


                // Tell BOTH players
                io.to(roomId).emit(
                    "gameRestarted",
                    {
                        game: "ticTacToe",

                        board: room.currentGame.board,

                        currentPlayer:
                            room.currentGame.currentPlayer,

                        scores: room.scores
                    }
                );

            }
        );

        // ==========================================
        // SEND GAME INVITATION
        // ==========================================

        socket.on("sendGameInvitation", ({ roomId, game }) => {

            const room = rooms[roomId];

            if (!room) {
                socket.emit("gameError", {
                    message: "Room not found"
                });

                return;
            }

            const sender = room.players.find(
                (player) => player.socketId === socket.id
            );

            const receiver = room.players.find(
                (player) => player.socketId !== socket.id
            );

            if (!sender || !receiver) {
                socket.emit("gameError", {
                    message: "Another player is not available"
                });

                return;
            }

            console.log(
                `${sender.name} invited ${receiver.name} to play ${game}`
            );

            // Send invitation only to the other player
            io.to(receiver.socketId).emit("gameInvitationReceived", {
                roomId,
                game,
                senderName: sender.name,
                senderSocketId: sender.socketId
            });

            // Let sender know invitation was sent
            socket.emit("gameInvitationSent", {
                game
            });

        });

        // ==========================================
        // RESPOND TO GAME INVITATION
        // ==========================================

        socket.on(
            "respondToGameInvitation",
            ({ roomId, game, accepted, senderSocketId }) => {

                const room = rooms[roomId];

                if (!room) {
                    return;
                }

                const responder = room.players.find(
                    (player) => player.socketId === socket.id
                );

                if (!responder) {
                    return;
                }

                if (accepted) {

                    console.log(
                        `${responder.name} accepted invitation for ${game}`
                    );

                    // Tell both players to open the game
                    io.to(roomId).emit(
                        "gameInvitationAccepted",
                        {
                            game
                        }
                    );

                } else {

                    console.log(
                        `${responder.name} declined invitation for ${game}`
                    );

                    // Tell only the sender
                    io.to(senderSocketId).emit(
                        "gameInvitationDeclined",
                        {
                            game,
                            playerName: responder.name
                        }
                    );

                }

            }
        );

        // =====================================================
        // SEND GAME INVITATION
        // =====================================================

        socket.on(
            "sendGameInvitation",
            ({ roomId, game }) => {

                const room = rooms[roomId];

                if (!room) {
                    socket.emit("gameError", {
                        message: "Room not found"
                    });

                    return;
                }

                const sender = room.players.find(
                    player => player.socketId === socket.id
                );

                const receiver = room.players.find(
                    player => player.socketId !== socket.id
                );

                if (!sender || !receiver) {
                    socket.emit("gameError", {
                        message: "Another player is required"
                    });

                    return;
                }

                console.log(
                    `${sender.name} invited ${receiver.name} to ${game}`
                );

                io.to(receiver.socketId).emit(
                    "gameInvitation",
                    {
                        roomId,
                        game,
                        playerName: sender.name
                    }
                );

            }
        );

        // =====================================================
        // RESPONSE TO GAME INVITATION
        // =====================================================

        socket.on(
            "respondGameInvitation",
            ({ roomId, game, accepted }) => {

                const room = rooms[roomId];

                if (!room) {
                    return;
                }

                const responder = room.players.find(
                    player => player.socketId === socket.id
                );

                if (!responder) {
                    return;
                }

                if (accepted) {

                    console.log(
                        `${responder.name} accepted invitation for ${game}`
                    );

                    io.to(roomId).emit(
                        "gameInvitationAccepted",
                        {
                            roomId,
                            game
                        }
                    );

                } else {

                    console.log(
                        `${responder.name} declined invitation for ${game}`
                    );

                    const sender = room.players.find(
                        player => player.socketId !== socket.id
                    );

                    if (sender) {

                        io.to(sender.socketId).emit(
                            "gameInvitationDeclined",
                            {
                                roomId,
                                game,
                                playerName: responder.name
                            }
                        );

                    }

                }

            }
        );


        // =====================================================
        // DISCONNECT
        // =====================================================

        socket.on("disconnect", () => {

            console.log(
                "Player disconnected:",
                socket.id
            );

        });

    });

};


export default gameSocket;