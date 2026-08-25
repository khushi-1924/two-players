import { rooms } from "../roomStore.js";

const invitationHandler = (io, socket) => {

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


            if (!sender) {

                socket.emit("gameError", {
                    message: "You are not in this room"
                });

                return;
            }


            const receiver = room.players.find(
                player =>
                    player.playerNumber !==
                    sender.playerNumber
            );


            if (
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


            const responder =
                room.players.find(
                    player =>
                        player.socketId === socket.id
                );


            if (!responder) {
                return;
            }


            const sender =
                room.players.find(
                    player =>
                        player.playerNumber !==
                        responder.playerNumber
                );


            // =================================================
            // ACCEPTED
            // =================================================

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

                return;
            }


            // =================================================
            // DECLINED
            // =================================================

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
    );

};

export default invitationHandler;