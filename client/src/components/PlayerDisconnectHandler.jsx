import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";

const PlayerDisconnectHandler = () => {
    const [disconnectedPlayer, setDisconnectedPlayer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(15);

    const navigate = useNavigate();

    useEffect(() => {
        const handlePlayerDisconnected = (data) => {
            console.log(
                "PLAYER DISCONNECTED EVENT RECEIVED:",
                data
            );

            setDisconnectedPlayer(data);
            setTimeLeft(data.timeLeft || 15);
        };

        const handlePlayerLeftRoom = (data) => {
            console.log(
                "PLAYER LEFT ROOM:",
                data
            );

            setDisconnectedPlayer(null);

            sessionStorage.removeItem("roomId");
            sessionStorage.removeItem("playerNumber");

            navigate("/home");
        };

        const handlePlayerReconnected = (data) => {

            console.log(
                "PLAYER RECONNECTED:",
                data
            );

            setDisconnectedPlayer(null);

        };

        socket.on(
            "playerDisconnected",
            handlePlayerDisconnected
        );

        socket.on(
            "playerLeftRoom",
            handlePlayerLeftRoom
        );

        socket.on(
            "playerReconnected",
            handlePlayerReconnected
        );

        return () => {
            socket.off(
                "playerDisconnected",
                handlePlayerDisconnected
            );

            socket.off(
                "playerLeftRoom",
                handlePlayerLeftRoom
            );

            socket.off(
                "playerReconnected",
                handlePlayerReconnected
            );
        };
    }, [navigate]);

    useEffect(() => {
        if (!disconnectedPlayer) return;

        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [disconnectedPlayer, timeLeft]);

    if (!disconnectedPlayer) {
        return null;
    }

    const progress = (timeLeft / 15) * 100;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div className="w-[90%] max-w-md rounded-2xl bg-[#0a0a2a] border border-blue-500 p-8 text-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">

                <h2 className="text-2xl font-bold text-pink-300 mb-4">
                    Player Disconnected
                </h2>

                <p className="text-gray-300 mb-6">
                    <span className="font-semibold text-white">
                        {disconnectedPlayer.playerName}
                    </span>{" "}
                    got disconnected.
                </p>

                <p className="text-gray-400 text-sm mb-6">
                    Waiting for them to reconnect...
                </p>

                <div className="relative w-28 h-28 mx-auto">

                    <svg
                        className="w-28 h-28 -rotate-90"
                        viewBox="0 0 100 100"
                    >
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="7"
                        />

                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="none"
                            stroke="#60a5fa"
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeDasharray="263.9"
                            strokeDashoffset={
                                263.9 - (263.9 * progress) / 100
                            }
                            className="transition-all duration-1000"
                        />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">

                        <span className="text-3xl font-bold text-white">
                            {timeLeft}
                        </span>

                    </div>

                </div>

                <p className="text-gray-500 text-sm mt-5">
                    You will return to the room screen if they don't reconnect.
                </p>

            </div>

        </div>
    );
};

export default PlayerDisconnectHandler;