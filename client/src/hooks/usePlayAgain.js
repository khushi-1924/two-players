import { useEffect, useState } from 'react';

import socket from '../socket/socket';

const usePlayAgain = (roomId, onGameRestarted) => {

    const [playAgainRequest, setPlayAgainRequest] =
        useState(null);

    const [playAgainDeclined, setPlayAgainDeclined] =
        useState(null);

    const [waitingForResponse, setWaitingForResponse] =
        useState(false);


    // ==========================================
    // REQUEST PLAY AGAIN
    // ==========================================

    const requestPlayAgain = () => {

        console.log("I clicked Play Again");

        console.log("Room ID:", roomId);
        console.log("Socket ID:", socket.id);
        console.log("Socket connected:", socket.connected);

        setWaitingForResponse(true);

        socket.emit("playAgainRequest", {
            roomId
        });

    };


    // ==========================================
    // ACCEPT / DECLINE REQUEST
    // ==========================================

    const respondToPlayAgain = (accepted) => {

        console.log(
            "Play Again response:",
            accepted
                ? "Accepted"
                : "Declined"
        );

        socket.emit("playAgainResponse", {
            roomId,
            accepted
        });

        // Close the modal
        setPlayAgainRequest(null);

    };


    // ==========================================
    // SOCKET LISTENERS
    // ==========================================

    useEffect(() => {

        const handlePlayAgainRequested = (data) => {

            console.log(
                "Play Again request received:",
                data
            );

            setPlayAgainRequest(data);

        };


        const handlePlayAgainDeclined = (data) => {

            console.log(
                `${data.playerName} declined Play Again`
            );

            setWaitingForResponse(false);

            setPlayAgainDeclined(
                data.playerName
            );

            setTimeout(() => {

                setPlayAgainDeclined(null);

            }, 3000);

        };


        const handleGameRestarted = (data) => {

            console.log(
                "Game restarted:",
                data
            );

            // Stop waiting
            setWaitingForResponse(false);

            // Close any open request modal
            setPlayAgainRequest(null);

            // Let the current game decide
            // how to reset itself
            if (onGameRestarted) {

                onGameRestarted(data);

            }

        };


        // ==========================================
        // GAME ERROR
        // ==========================================

        const handleGameError = (data) => {

            console.error(
                "Play Again error:",
                data.message
            );

            // Important:
            // Don't leave the button stuck
            setWaitingForResponse(false);

        };


        socket.on(
            "playAgainRequested",
            handlePlayAgainRequested
        );

        socket.on(
            "playAgainDeclined",
            handlePlayAgainDeclined
        );

        socket.on(
            "gameRestarted",
            handleGameRestarted
        );

        socket.on(
            "gameError",
            handleGameError
        );


        return () => {

            socket.off(
                "playAgainRequested",
                handlePlayAgainRequested
            );

            socket.off(
                "playAgainDeclined",
                handlePlayAgainDeclined
            );

            socket.off(
                "gameRestarted",
                handleGameRestarted
            );

            socket.off(
                "gameError",
                handleGameError
            );

        };

    }, [roomId, onGameRestarted]);


    return {

        // States

        playAgainRequest,

        playAgainDeclined,

        waitingForResponse,


        // Functions

        requestPlayAgain,

        respondToPlayAgain,


        // Optional close function

        closeDeclineNotification: () => {

            setPlayAgainDeclined(null);

        }

    };

};

export default usePlayAgain;