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
        socket.on("createRoom", () => {

            let roomId = generateRoomId();

            while (rooms[roomId]) {
                roomId = generateRoomId();
            }

            rooms[roomId] = {
                players: []
            };

            socket.join(roomId);

            rooms[roomId].players.push(socket.id);

            console.log(`Room created: ${roomId}`);
            console.log(`Creator: ${socket.id}`);

            socket.emit("roomCreated", {
                roomId
            });
        });


        // JOIN ROOM
        socket.on("joinRoom", (roomId) => {

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

            rooms[roomId].players.push(socket.id);

            console.log(
                `${socket.id} joined room ${roomId}`
            );

            console.log(
                "Players:",
                rooms[roomId].players
            );

            // Both players are now connected
            if (rooms[roomId].players.length === 2) {

                io.to(roomId).emit("roomReady", {
                    roomId
                });

                console.log(
                    `Room ${roomId} is ready`
                );
            }
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