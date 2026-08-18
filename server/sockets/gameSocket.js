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
                }
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