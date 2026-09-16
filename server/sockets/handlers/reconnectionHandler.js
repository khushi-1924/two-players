import {
    rooms,
    disconnectTimers,
    RECONNECT_WINDOW
} from "../roomStore.js";

import getPublicGameState
    from "../../games/getPublicGameState.js";


const reconnectionHandler = (
    io,
    socket
) => {

    socket.on(
        "rejoinRoom",
        ({ roomId }) => {

            roomId =
                roomId
                    ?.trim()
                    .toUpperCase();

            const room =
                rooms[roomId];


            // ==========================================
            // ROOM NOT FOUND
            // ==========================================

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


            // ==========================================
            // GET PLAYER ID
            // ==========================================

            const playerId =
                socket.handshake.auth.playerId;


            if (!playerId) {

                socket.emit(
                    "rejoinFailed",
                    {
                        message:
                            "Player identity not found"
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
                        p.playerId ===
                        playerId
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


            // ==========================================
            // CHECK RECONNECTION WINDOW
            // ==========================================

            if (
                player.disconnectedAt &&
                Date.now() -
                player.disconnectedAt >
                RECONNECT_WINDOW
            ) {

                socket.emit(
                    "rejoinFailed",
                    {
                        message:
                            "Reconnection time expired"
                    }
                );

                return;
            }


            console.log(
                `${player.name} is rejoining room ${roomId}`
            );


            // ==========================================
            // REPLACE SOCKET
            // ==========================================

            player.socketId =
                socket.id;

            player.connected =
                true;

            player.disconnectedAt =
                null;


            socket.join(roomId);


            // ==========================================
            // CANCEL DISCONNECT TIMER
            // ==========================================

            const timerKey =
                `${roomId}-${player.playerNumber}`;


            if (
                disconnectTimers[timerKey]
            ) {

                clearTimeout(
                    disconnectTimers[timerKey]
                );

                delete
                    disconnectTimers[timerKey];

            }


            // ==========================================
            // RESTORE ROOM
            // ==========================================

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


            // ==========================================
            // NOTIFY OPPONENT
            // ==========================================

            socket
                .to(roomId)
                .emit(
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