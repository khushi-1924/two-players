import roomHandler from "./handlers/roomHandler.js";
import invitationHandler from "./handlers/invitationHandler.js";
import reconnectionHandler from "./handlers/reconnectionHandler.js";
import disconnectHandler from "./handlers/disconnectHandler.js";
import playAgainHandler from "./handlers/playAgainHandler.js";
import gameHandler from "../handlers/gameHandler.js";
import gameLeaveHandler from "./handlers/gameLeaveHandler.js";
import ticTacToeSocket from "./handlers/games/ticTacToe/ticTacToeSocket.js";
import rockPaperScissorsSocket from "./handlers/games/rockPaperScissors/rockPaperScissorsSocket.js";
import connectFourSocket from "./handlers/games/connectFour/connectFourSocket.js";


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
            // COMMON GAME HANDLER
            // ================================================

            gameHandler(
                io,
                socket
            );


            // ================================================
            // GAME-SPECIFIC SOCKETS
            // ================================================

            ticTacToeSocket(
                io,
                socket
            );

            rockPaperScissorsSocket(
                io,
                socket
            );

            connectFourSocket(
                io,
                socket
            );

        }
    );

};


export default gameSocket;