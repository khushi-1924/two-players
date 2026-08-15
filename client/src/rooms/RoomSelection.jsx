import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';
import PlayerName from '../components/PlayerName/PlayerName';

const RoomSelection = () => {

    const navigate = useNavigate();

    const [modal, setModal] = useState(null);

    const [roomId, setRoomId] = useState('');
    const [joinRoomId, setJoinRoomId] = useState('');

    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const [playerName, setPlayerName] = useState(
        localStorage.getItem('playerName')
    );

    // Room created
    useEffect(() => {

        const handleRoomCreated = (data) => {
            console.log("Room created:", data.roomId);

            setRoomId(data.roomId);

            // Save room ID for later
            sessionStorage.setItem(
                "roomId",
                data.roomId
            );
        };

        socket.on(
            "roomCreated",
            handleRoomCreated
        );

        return () => {
            socket.off(
                "roomCreated",
                handleRoomCreated
            );
        };

    }, []);


    // Both players connected
    useEffect(() => {

        const handleRoomReady = (data) => {

            console.log(
                "Room ready:",
                data.roomId
            );

            sessionStorage.setItem(
                "roomId",
                data.roomId
            );

            navigate("/home");
        };

        socket.on(
            "roomReady",
            handleRoomReady
        );

        return () => {
            socket.off(
                "roomReady",
                handleRoomReady
            );
        };

    }, [navigate]);


    // Join error
    useEffect(() => {

        const handleJoinError = (data) => {
            setError(data.message);
        };

        socket.on(
            "joinError",
            handleJoinError
        );

        return () => {
            socket.off(
                "joinError",
                handleJoinError
            );
        };

    }, []);


    const createRoom = () => {

        setError('');

        socket.emit("createRoom");
    };


    const joinRoom = () => {

        setError('');

        if (!joinRoomId.trim()) {
            setError("Please enter a Room ID");
            return;
        }

        socket.emit(
            "joinRoom",
            joinRoomId
        );
    };


    const copyRoomId = async () => {

        await navigator.clipboard.writeText(roomId);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };


    const closeModal = () => {
        setModal(null);
        setRoomId('');
        setJoinRoomId('');
        setError('');
        setCopied(false);
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white">

            <h1 className="text-5xl font-bold text-pink-300 mb-12">
                Two Player
            </h1>

            {!playerName && (
                <PlayerName
                    onSave={(name) => setPlayerName(name)}
                />
            )}


            <div className="flex flex-col gap-5 w-64">

                <button
                    onClick={() => {
                        setModal("create");
                        setRoomId('');
                        setError('');
                        createRoom();
                    }}
                    className="px-6 py-4 rounded-xl bg-pink-500
                               hover:bg-pink-600 transition font-semibold"
                >
                    Create Room
                </button>


                <button
                    onClick={() => {
                        setModal("join");
                        setError('');
                    }}
                    className="px-6 py-4 rounded-xl bg-blue-500
                               hover:bg-blue-600 transition font-semibold"
                >
                    Join Room
                </button>

            </div>


            {/* MODAL */}

            {modal && (

                <div className="fixed inset-0 bg-black/60
                                flex items-center justify-center
                                z-50">

                    <div className="relative w-[90%] max-w-md
                                    bg-[#0a0a2a]
                                    border border-blue-500
                                    rounded-2xl p-8
                                    shadow-[0_0_25px_rgba(59,130,246,0.4)]">


                        {/* Close */}

                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-4
                                       text-gray-400
                                       hover:text-white
                                       text-2xl"
                        >
                            ×
                        </button>


                        {/* CREATE ROOM */}

                        {modal === "create" && (

                            <div className="text-center">

                                <h2 className="text-3xl font-bold
                                               text-pink-300 mb-6">
                                    Room Created
                                </h2>

                                <p className="text-gray-300 mb-4">
                                    Share this Room ID with your friend
                                </p>


                                {roomId ? (

                                    <>
                                        <div className="flex items-center
                                                        justify-center gap-3">

                                            <div className="px-5 py-3
                                                            bg-[#05051c]
                                                            border border-blue-500
                                                            rounded-lg
                                                            text-2xl font-bold
                                                            tracking-widest">
                                                {roomId}
                                            </div>

                                            <button
                                                onClick={copyRoomId}
                                                className="px-4 py-3
                                                           bg-blue-500
                                                           hover:bg-blue-600
                                                           rounded-lg"
                                            >
                                                {copied
                                                    ? "Copied!"
                                                    : "Copy"}
                                            </button>

                                        </div>


                                        <p className="text-gray-400 mt-6">
                                            Waiting for your friend to join...
                                        </p>

                                    </>

                                ) : (

                                    <p className="text-gray-400">
                                        Creating room...
                                    </p>

                                )}

                            </div>

                        )}


                        {/* JOIN ROOM */}

                        {modal === "join" && (

                            <div>

                                <h2 className="text-3xl font-bold
                                               text-blue-300
                                               text-center mb-6">
                                    Join Room
                                </h2>


                                <input
                                    type="text"
                                    value={joinRoomId}
                                    onChange={(e) =>
                                        setJoinRoomId(
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    placeholder="Enter Room ID"
                                    className="w-full px-4 py-3
                                               rounded-lg
                                               bg-[#05051c]
                                               border border-blue-500
                                               outline-none
                                               text-white
                                               tracking-widest
                                               uppercase"
                                />


                                {error && (

                                    <p className="text-red-400 mt-3 text-center">
                                        {error}
                                    </p>

                                )}


                                <button
                                    onClick={joinRoom}
                                    className="w-full mt-5
                                               px-5 py-3
                                               bg-blue-500
                                               hover:bg-blue-600
                                               rounded-lg
                                               font-semibold"
                                >
                                    Join Room
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
};

export default RoomSelection;