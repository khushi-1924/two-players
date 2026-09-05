import {
    rooms,
    disconnectTimers
} from "../roomStore.js";

import getPublicGameState from "../../games/getPublicGameState.js";

const reconnectionHandler = (io, socket) => {

    socket.on(
        "rejoinRoom",
        ({ roomId, playerNumber, name }) => {

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


            // =================================================
            // FIND PLAYER
            // Supports playerNumber and name
            // =================================================

            let player = null;

            if (playerNumber !== undefined) {

                player = room.players.find(
                    p =>
                        p.playerNumber ===
                        Number(playerNumber)
                );

            }

            if (!player && name) {

                player = room.players.find(
                    p =>
                        p.name === name
                );

            }


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


            // =================================================
            // REPLACE OLD SOCKET
            // =================================================

            player.socketId = socket.id;

            player.connected = true;

            socket.join(roomId);


            // =================================================
            // CANCEL DISCONNECT TIMER
            // =================================================

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


            // =================================================
            // SEND ROOM STATE TO RECONNECTED PLAYER
            // =================================================

            socket.emit(
                "roomRejoined",
                {
                    roomId,

                    playerNumber:
                        player.playerNumber,

                    players:
                        room.players,

                    currentGame:
                        getPublicGameState(
                            room.currentGame,
                            player.playerNumber
                        ),

                    scores:
                        room.scores
                }
            );


            // =================================================
            // NOTIFY OTHER PLAYER
            // =================================================

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

};

export default reconnectionHandler;