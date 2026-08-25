import roomHandler from "./handlers/roomHandler.js";

import invitationHandler from "./handlers/invitationHandler.js";

import reconnectionHandler from "./handlers/reconnectionHandler.js";

import disconnectHandler from "./handlers/disconnectHandler.js";

import gameLeaveHandler from "./handlers/gameLeaveHandler.js";

import playAgainHandler from "./handlers/playAgainHandler.js";

import ticTacToeSocket from "./handlers/games/ticTacToe/ticTacToeSocket.js";


const gameSocket = (io) => {

    io.on(
        "connection",
        (socket) => {

            console.log(
                "Player connected:",
                socket.id
            );


            // ================================================
            // ROOM
            // ================================================

            roomHandler(
                io,
                socket
            );


            // ================================================
            // GAME INVITATIONS
            // ================================================

            invitationHandler(
                io,
                socket
            );


            // ================================================
            // RECONNECTION
            // ================================================

            reconnectionHandler(
                io,
                socket
            );


            // ================================================
            // DISCONNECTION
            // ================================================

            disconnectHandler(
                io,
                socket
            );


            // ================================================
            // PLAY AGAIN
            // ================================================

            playAgainHandler(
                io,
                socket
            );


            // ================================================
            // LEAVE GAME
            // ================================================

            gameLeaveHandler(
                io,
                socket
            );


            // ================================================
            // GAMES
            // ================================================

            ticTacToeSocket(
                io,
                socket
            );

        }
    );

};


export default gameSocket;