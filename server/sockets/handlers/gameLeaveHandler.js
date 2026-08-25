import { rooms } from "../roomStore.js";


const gameLeaveHandler = (io, socket) => {

    socket.on(
        "leaveGame",
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


            // ==========================================
            // FIND PLAYER
            // ==========================================

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


            // ==========================================
            // CHECK IF A GAME EXISTS
            // ==========================================

            if (!room.currentGame) {

                socket.emit(
                    "gameLeft",
                    {
                        playerName:
                            player.name
                    }
                );

                return;
            }


            console.log(
                `${player.name} left ${room.currentGame.name} in room ${roomId}`
            );


            // ==========================================
            // CLEAR CURRENT GAME
            // ==========================================

            room.currentGame = null;

            room.playAgainRequest = null;


            // ==========================================
            // NOTIFY BOTH PLAYERS
            // ==========================================

            // ==========================================
            // PLAYER WHO LEFT
            // Go home without notification
            // ==========================================

            socket.emit(
                "gameLeft",
                {
                    playerName: player.name,
                    leftBySelf: true
                }
            );


            // ==========================================
            // OTHER PLAYER
            // Notify that opponent left
            // ==========================================

            socket.to(roomId).emit(
                "gameLeft",
                {
                    playerName: player.name,
                    leftBySelf: false
                }
            );

        }
    );

};


export default gameLeaveHandler;