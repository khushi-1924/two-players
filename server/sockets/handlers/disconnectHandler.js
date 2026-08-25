import {
    rooms,
    disconnectTimers
} from "../roomStore.js";

const disconnectHandler = (io, socket) => {

    socket.on(
        "disconnect",
        () => {

            console.log(
                "Player disconnected:",
                socket.id
            );


            // =================================================
            // FIND ROOM
            // =================================================

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


            const room = rooms[roomId];


            const disconnectedPlayer =
                room.players.find(
                    player =>
                        player.socketId ===
                        socket.id
                );


            if (!disconnectedPlayer) {
                return;
            }


            // Prevent duplicate disconnect handling
            if (!disconnectedPlayer.connected) {
                return;
            }


            // =================================================
            // MARK PLAYER DISCONNECTED
            // =================================================

            disconnectedPlayer.connected = false;


            console.log(
                `${disconnectedPlayer.name} disconnected from room ${roomId}`
            );


            const remainingPlayer =
                room.players.find(
                    player =>
                        player.playerNumber !==
                        disconnectedPlayer.playerNumber
                );


            // =================================================
            // NOTIFY OPPONENT
            // =================================================

            if (
                remainingPlayer &&
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


            // =================================================
            // START RECONNECT TIMER
            // =================================================

            const timerKey =
                `${roomId}-${disconnectedPlayer.playerNumber}`;


            // Clear old timer if one exists
            if (disconnectTimers[timerKey]) {

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


                        // Player came back
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


                        // =================================================
                        // TELL OPPONENT ROOM IS OVER
                        // =================================================

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


                        // =================================================
                        // DELETE ROOM
                        // =================================================

                        delete rooms[roomId];

                        delete disconnectTimers[
                            timerKey
                        ];

                    },
                    15000
                );

        }
    );

};

export default disconnectHandler;