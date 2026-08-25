import { rooms } from "../roomStore.js";
import { generateRoomId } from "../utils/roomUtils.js";

const roomHandler = (io, socket) => {

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
        console.log(`Creator: ${name}`);

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


        // Count actual players
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
            `${name} joined room ${roomId}`
        );


        // =====================================================
        // ROOM READY
        // =====================================================

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

};

export default roomHandler;