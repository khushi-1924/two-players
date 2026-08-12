const rooms = {};

const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const gameSocket = (io) => {
    io.on("connection", (socket) => {

        console.log("Player connected:", socket.id);

        socket.on("createRoom", () => {
            console.log("createRoom received from:", socket.id);

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

        socket.on("disconnect", () => {
            console.log("Player disconnected:", socket.id);
        });
    });
};

export default gameSocket;