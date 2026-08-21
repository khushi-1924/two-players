import React, { useEffect, useState } from 'react';

const PlayerDisconnectedModal = ({
    playerName,
    seconds = 15
}) => {

    const [timeLeft, setTimeLeft] =
        useState(seconds);

    useEffect(() => {

        setTimeLeft(seconds);

        const interval = setInterval(() => {

            setTimeLeft((prev) => {

                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }

                return prev - 1;

            });

        }, 1000);

        return () => {
            clearInterval(interval);
        };

    }, [seconds]);


    const radius = 45;
    const circumference =
        2 * Math.PI * radius;

    const progress =
        (timeLeft / seconds) * circumference;


    return (

        <div className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/70 backdrop-blur-sm
        ">

            <div
                className="
                    w-[90%] max-w-md
                    bg-[#0a0a2a]
                    border border-blue-500
                    rounded-2xl
                    p-8
                    text-center
                    shadow-[0_0_30px_rgba(59,130,246,0.3)]
                "
            >

                <div className="flex justify-center mb-6">

                    <div className="relative w-32 h-32">

                        <svg
                            className="
                                w-32 h-32
                                -rotate-90
                            "
                        >

                            {/* Background circle */}

                            <circle
                                cx="64"
                                cy="64"
                                r={radius}
                                fill="transparent"
                                stroke="#1e3a5f"
                                strokeWidth="8"
                            />

                            {/* Countdown circle */}

                            <circle
                                cx="64"
                                cy="64"
                                r={radius}
                                fill="transparent"
                                stroke="#ec4899"
                                strokeWidth="8"
                                strokeLinecap="round"

                                strokeDasharray={
                                    circumference
                                }

                                strokeDashoffset={
                                    circumference - progress
                                }

                                className="
                                    transition-all
                                    duration-1000
                                    ease-linear
                                "
                            />

                        </svg>


                        <div
                            className="
                                absolute inset-0
                                flex items-center
                                justify-center
                                text-3xl
                                font-bold
                                text-white
                            "
                        >

                            {timeLeft}

                        </div>

                    </div>

                </div>


                <h2
                    className="
                        text-2xl
                        font-bold
                        text-pink-300
                        mb-4
                    "
                >
                    Player Disconnected
                </h2>


                <p
                    className="
                        text-gray-300
                        text-lg
                        leading-relaxed
                    "
                >

                    <span className="font-semibold text-white">

                        {playerName}

                    </span>

                    {" "}has disconnected.

                    <br />

                    <span className="text-gray-400">

                        Waiting for them to reconnect...

                    </span>

                </p>

            </div>

        </div>

    );

};

export default PlayerDisconnectedModal;