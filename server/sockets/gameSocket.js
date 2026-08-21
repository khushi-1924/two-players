const rooms = {};
const disconnectTimers = {};


const generateRoomId = () => {
    return Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
};


// =====================================================
// TIC TAC TOE HELPERS
// =====================================================

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


const checkDraw = (board) => {
    return board.every(cell => cell !== null);
};


// =====================================================
// GAME SOCKET
// =====================================================

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

                scores: {
                    1: 0,
                    2: 0
                },

                playAgainRequest: null
            };


            socket.join(roomId);


            rooms[roomId].players.push({
                socketId: socket.id,
                name,
                playerNumber: 1,
                connected: true
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

            const room = rooms[roomId];


            if (!room) {

                socket.emit("joinError", {
                    message: "Room not found"
                });

                return;
            }


            if (room.players.length >= 2) {

                socket.emit("joinError", {
                    message: "Room is full"
                });

                return;
            }


            socket.join(roomId);


            room.players.push({
                socketId: socket.id,
                name,
                playerNumber: 2,
                connected: true
            });


            console.log(
                `${socket.id} joined room ${roomId}`
            );


            if (room.players.length === 2) {

                room.players.forEach((player) => {

                    io.to(player.socketId).emit(
                        "roomReady",
                        {
                            roomId,
                            players: room.players,
                            playerNumber: player.playerNumber
                        }
                    );

                });


                console.log(
                    `Room ${roomId} is ready`
                );
            }

        });


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
                    player =>
                        player.socketId === socket.id
                );


                const receiver = room.players.find(
                    player =>
                        player.playerNumber !==
                        sender?.playerNumber
                );


                if (
                    !sender ||
                    !receiver ||
                    !receiver.connected
                ) {

                    socket.emit("gameError", {
                        message:
                            "Another player is not available"
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
        // RESPOND TO GAME INVITATION
        // =====================================================

        socket.on(
            "respondGameInvitation",
            ({ roomId, game, accepted }) => {

                const room = rooms[roomId];

                if (!room) {
                    return;
                }


                const responder = room.players.find(
                    player =>
                        player.socketId === socket.id
                );


                if (!responder) {
                    return;
                }


                const sender = room.players.find(
                    player =>
                        player.playerNumber !==
                        responder.playerNumber
                );


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
        // START GAME
        // =====================================================

        socket.on(
            "startGame",
            ({ roomId, game }) => {

                console.log(
                    `${socket.id} wants to start ${game} in room ${roomId}`
                );


                const room = rooms[roomId];


                if (!room) {

                    socket.emit("gameError", {
                        message: "Room not found"
                    });

                    return;
                }


                if (room.players.length !== 2) {

                    socket.emit("gameError", {
                        message:
                            "Waiting for another player"
                    });

                    return;
                }


                if (game !== "ticTacToe") {

                    socket.emit("gameError", {
                        message:
                            "Game not supported"
                    });

                    return;
                }


                // -------------------------------------------------
                // GAME ALREADY EXISTS
                // Important for refresh / reconnection
                // -------------------------------------------------

                if (room.currentGame) {

                    console.log(
                        `Game already running in room ${roomId}`
                    );


                    // Send COMPLETE existing state
                    // only to the player requesting it

                    socket.emit(
                        "gameStarted",
                        {
                            game:
                                room.currentGame.name,

                            board:
                                room.currentGame.board,

                            currentPlayer:
                                room.currentGame.currentPlayer,

                            status:
                                room.currentGame.status,

                            winner:
                                room.currentGame.winner,

                            winningCells:
                                room.currentGame.winningCells,

                            draw:
                                room.currentGame.draw || false,

                            scores:
                                room.scores
                        }
                    );

                    return;
                }


                // -------------------------------------------------
                // CREATE NEW TIC TAC TOE GAME
                // -------------------------------------------------

                room.currentGame = {

                    name: "ticTacToe",

                    board: Array(9).fill(null),

                    currentPlayer: 1,

                    startingPlayer: 1,

                    status: "playing",

                    winner: null,

                    winningCells: [],

                    draw: false
                };


                console.log(
                    `Tic Tac Toe started in room ${roomId}`
                );


                io.to(roomId).emit(
                    "gameStarted",
                    {
                        game: "ticTacToe",

                        board:
                            room.currentGame.board,

                        currentPlayer:
                            room.currentGame.currentPlayer,

                        status:
                            room.currentGame.status,

                        winner: null,

                        winningCells: [],

                        draw: false,

                        scores:
                            room.scores
                    }
                );

            }
        );


        // =====================================================
        // REJOIN ROOM AFTER REFRESH / RECONNECT
        // =====================================================

        socket.on(
            "rejoinRoom",
            ({ roomId, playerNumber }) => {

                const room = rooms[roomId];


                if (!room) {

                    socket.emit(
                        "rejoinFailed",
                        {
                            message:
                                "Room no longer exists"
                        }
                    );

                    return;
                }


                const player = room.players.find(
                    p =>
                        p.playerNumber ===
                        Number(playerNumber)
                );


                if (!player) {

                    socket.emit(
                        "rejoinFailed",
                        {
                            message:
                                "Player not found in room"
                        }
                    );

                    return;
                }


                console.log(
                    `${player.name} is rejoining room ${roomId}`
                );


                // Replace old socket ID
                player.socketId = socket.id;

                // Mark player connected
                player.connected = true;

                // Join socket room again
                socket.join(roomId);


                // -------------------------------------------------
                // CANCEL DISCONNECT TIMER
                // -------------------------------------------------

                const timerKey =
                    `${roomId}-${player.playerNumber}`;


                if (disconnectTimers[timerKey]) {

                    clearTimeout(
                        disconnectTimers[timerKey]
                    );

                    delete disconnectTimers[timerKey];

                    console.log(
                        `Reconnect timer cancelled for ${player.name}`
                    );
                }


                // -------------------------------------------------
                // SEND COMPLETE ROOM STATE
                // This is used by useRoomReconnection
                // -------------------------------------------------

                socket.emit(
                    "roomRejoined",
                    {
                        roomId,

                        playerNumber:
                            player.playerNumber,

                        players:
                            room.players,

                        currentGame:
                            room.currentGame,

                        scores:
                            room.scores
                    }
                );


                // Tell the other player
                socket.to(roomId).emit(
                    "playerReconnected",
                    {
                        playerNumber:
                            player.playerNumber,

                        playerName:
                            player.name
                    }
                );


                console.log(
                    `${player.name} successfully reconnected`
                );

            }
        );


        // =====================================================
        // MAKE MOVE
        // =====================================================

        socket.on(
            "makeMove",
            ({ roomId, index }) => {

                const room = rooms[roomId];


                if (!room) {

                    socket.emit("gameError", {
                        message: "Room not found"
                    });

                    return;
                }


                if (!room.currentGame) {

                    socket.emit("gameError", {
                        message:
                            "Game has not started"
                    });

                    return;
                }


                const game =
                    room.currentGame;


                if (
                    game.name !== "ticTacToe"
                ) {
                    return;
                }


                if (
                    game.status === "finished"
                ) {

                    socket.emit("gameError", {
                        message:
                            "Game is already over"
                    });

                    return;
                }


                if (
                    !Number.isInteger(index) ||
                    index < 0 ||
                    index > 8
                ) {

                    socket.emit("gameError", {
                        message:
                            "Invalid cell"
                    });

                    return;
                }


                const player =
                    room.players.find(
                        p =>
                            p.socketId === socket.id
                    );


                if (!player) {

                    socket.emit("gameError", {
                        message:
                            "You are not in this room"
                    });

                    return;
                }


                if (
                    player.playerNumber !==
                    game.currentPlayer
                ) {

                    socket.emit("gameError", {
                        message:
                            "Not your turn"
                    });

                    return;
                }


                if (
                    game.board[index] !== null
                ) {

                    socket.emit("gameError", {
                        message:
                            "Cell already occupied"
                    });

                    return;
                }


                const symbol =
                    player.playerNumber === 1
                        ? "X"
                        : "O";


                game.board[index] = symbol;


                console.log(
                    `${player.name} played ${symbol} at index ${index}`
                );


                // -------------------------------------------------
                // CHECK WINNER
                // -------------------------------------------------

                const result =
                    checkWinner(
                        game.board
                    );


                if (result) {

                    game.status = "finished";

                    game.winner =
                        result.winner;

                    game.winningCells =
                        result.cells;

                    game.draw = false;


                    room.scores[
                        player.playerNumber
                    ]++;


                    console.log(
                        `${player.name} won Tic Tac Toe`
                    );


                    io.to(roomId).emit(
                        "gameOver",
                        {
                            board:
                                game.board,

                            winner:
                                result.winner,

                            winningCells:
                                result.cells,

                            draw: false,

                            scores:
                                room.scores
                        }
                    );

                    return;
                }


                // -------------------------------------------------
                // CHECK DRAW
                // -------------------------------------------------

                if (
                    checkDraw(
                        game.board
                    )
                ) {

                    game.status = "finished";

                    game.winner = null;

                    game.winningCells = [];

                    game.draw = true;


                    console.log(
                        "Tic Tac Toe ended in a draw"
                    );


                    io.to(roomId).emit(
                        "gameOver",
                        {
                            board:
                                game.board,

                            winner: null,

                            winningCells: [],

                            draw: true,

                            scores:
                                room.scores
                        }
                    );

                    return;
                }


                // -------------------------------------------------
                // SWITCH TURN
                // -------------------------------------------------

                game.currentPlayer =
                    game.currentPlayer === 1
                        ? 2
                        : 1;


                io.to(roomId).emit(
                    "boardUpdated",
                    {
                        board:
                            game.board,

                        currentPlayer:
                            game.currentPlayer
                    }
                );

            }
        );


        // =====================================================
        // PLAY AGAIN REQUEST
        // =====================================================

        socket.on(
            "playAgainRequest",
            ({ roomId }) => {

                const room = rooms[roomId];


                if (!room) {

                    socket.emit("gameError", {
                        message: "Room not found"
                    });

                    return;
                }


                if (!room.currentGame) {

                    socket.emit("gameError", {
                        message:
                            "No game found"
                    });

                    return;
                }


                if (
                    room.currentGame.status !==
                    "finished"
                ) {

                    socket.emit("gameError", {
                        message:
                            "Game is still in progress"
                    });

                    return;
                }


                const player =
                    room.players.find(
                        p =>
                            p.socketId === socket.id
                    );


                if (!player) {

                    socket.emit("gameError", {
                        message:
                            "You are not in this room"
                    });

                    return;
                }


                if (
                    room.playAgainRequest
                ) {

                    socket.emit("gameError", {
                        message:
                            "A Play Again request is already pending"
                    });

                    return;
                }


                room.playAgainRequest = {
                    from:
                        player.playerNumber
                };


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

                    room.playAgainRequest = null;

                    socket.emit("gameError", {
                        message:
                            "Opponent is not connected"
                    });

                    return;
                }


                console.log(
                    `${player.name} requested to play again in room ${roomId}`
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
        // PLAY AGAIN RESPONSE
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

                    socket.emit("gameError", {
                        message:
                            "No Play Again request"
                    });

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


                if (
                    player.playerNumber ===
                    room.playAgainRequest.from
                ) {

                    socket.emit("gameError", {
                        message:
                            "You cannot respond to your own request"
                    });

                    return;
                }


                const requester =
                    room.players.find(
                        p =>
                            p.playerNumber ===
                            room.playAgainRequest.from
                    );


                // -------------------------------------------------
                // DECLINED
                // -------------------------------------------------

                if (!accepted) {

                    console.log(
                        `${player.name} declined Play Again`
                    );


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


                // -------------------------------------------------
                // ACCEPTED
                // -------------------------------------------------

                console.log(
                    `${player.name} accepted Play Again`
                );


                const previousStarter =
                    room.currentGame
                        .startingPlayer || 1;


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


                room.playAgainRequest = null;


                io.to(roomId).emit(
                    "gameRestarted",
                    {
                        game: "ticTacToe",

                        board:
                            room.currentGame.board,

                        currentPlayer:
                            room.currentGame.currentPlayer,

                        scores:
                            room.scores
                    }
                );

            }
        );


        // =====================================================
        // DISCONNECT
        // =====================================================

        socket.on(
            "disconnect",
            () => {

                console.log(
                    "Player disconnected:",
                    socket.id
                );


                const roomId =
                    Object.keys(rooms).find(
                        id =>
                            rooms[id].players.some(
                                player =>
                                    player.socketId ===
                                    socket.id
                            )
                    );


                if (!roomId) {

                    console.log(
                        "Disconnected player was not in any room"
                    );

                    return;
                }


                const room =
                    rooms[roomId];


                const disconnectedPlayer =
                    room.players.find(
                        player =>
                            player.socketId ===
                            socket.id
                    );


                if (!disconnectedPlayer) {
                    return;
                }


                const remainingPlayer =
                    room.players.find(
                        player =>
                            player.playerNumber !==
                            disconnectedPlayer.playerNumber
                    );


                // Mark disconnected
                disconnectedPlayer.connected = false;


                console.log(
                    `${disconnectedPlayer.name} disconnected from room ${roomId}`
                );


                if (!remainingPlayer) {
                    return;
                }


                // Notify the other player only if
                // they are still connected

                if (
                    remainingPlayer.connected
                ) {

                    io.to(
                        remainingPlayer.socketId
                    ).emit(
                        "playerDisconnected",
                        {
                            playerName:
                                disconnectedPlayer.name,

                            timeLeft: 15
                        }
                    );

                }


                // -------------------------------------------------
                // DISCONNECT TIMER
                // Each player gets their own timer
                // -------------------------------------------------

                const timerKey =
                    `${roomId}-${disconnectedPlayer.playerNumber}`;


                if (
                    disconnectTimers[timerKey]
                ) {

                    clearTimeout(
                        disconnectTimers[timerKey]
                    );
                }


                disconnectTimers[timerKey] =
                    setTimeout(
                        () => {

                            const currentRoom =
                                rooms[roomId];


                            if (!currentRoom) {
                                return;
                            }


                            const player =
                                currentRoom.players.find(
                                    p =>
                                        p.playerNumber ===
                                        disconnectedPlayer.playerNumber
                                );


                            // Player successfully reconnected
                            if (
                                !player ||
                                player.connected
                            ) {

                                delete disconnectTimers[
                                    timerKey
                                ];

                                return;
                            }


                            console.log(
                                `${player.name} did not reconnect within 15 seconds`
                            );


                            const opponent =
                                currentRoom.players.find(
                                    p =>
                                        p.playerNumber !==
                                        player.playerNumber
                                );


                            if (
                                opponent &&
                                opponent.connected
                            ) {

                                io.to(
                                    opponent.socketId
                                ).emit(
                                    "playerLeftRoom",
                                    {
                                        playerName:
                                            player.name
                                    }
                                );

                            }


                            // Delete the room
                            delete rooms[roomId];

                            delete disconnectTimers[
                                timerKey
                            ];

                        },
                        15000
                    );

            }
        );

    });

};


export default gameSocket;