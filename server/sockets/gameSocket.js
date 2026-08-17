const rooms = {};

const generateRoomId = () => {
    return Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
};

const gameSocket = (io) => {
    io.on("connection", (socket) => {

        console.log("Player connected:", socket.id);

        // CREATE ROOM
        socket.on("createRoom", ({ name }) => {

            let roomId = generateRoomId();

            while (rooms[roomId]) {
                roomId = generateRoomId();
            }

            rooms[roomId] = {
                players: [],
                currentGame: null
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


        // JOIN ROOM
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

        // START GAME
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

            // If a game is already running, don't create another one
            if (room.currentGame) {
                console.log(
                    `Game already running in room ${roomId}`
                );

                socket.emit("gameStarted", {
                    game: room.currentGame.name,
                    board: room.currentGame.board,
                    currentPlayer: room.currentGame.currentPlayer
                });

                return;
            }

            // Create Tic Tac Toe state
            room.currentGame = {
                name: "ticTacToe",

                board: Array(9).fill(null),

                currentPlayer: 1,

                status: "playing"
            };

            console.log(
                `Tic Tac Toe started in room ${roomId}`
            );

            // Send game state to both players
            io.to(roomId).emit("gameStarted", {
                game: "ticTacToe",
                board: room.currentGame.board,
                currentPlayer: room.currentGame.currentPlayer
            });
        });


        socket.on("disconnect", () => {
            console.log(
                "Player disconnected:",
                socket.id
            );
        });

    });
};

export default gameSocket;