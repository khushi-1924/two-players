import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';

const CreateRoom = () => {
  const [roomId, setRoomId] = useState(null);
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleRoomCreated = (data) => {
      console.log("Room created:", data.roomId);
      setRoomId(data.roomId);
    };

    socket.on("roomCreated", handleRoomCreated);

    return () => {
      socket.off("roomCreated", handleRoomCreated);
    };
  }, []);

  const createRoom = () => {
    socket.emit("createRoom");
  };

  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">

      {!roomId ? (
        <>
          <h1 className="text-4xl font-bold text-pink-300 mb-8">
            Create Room
          </h1>

          <button
            onClick={createRoom}
            className="px-8 py-4 rounded-xl bg-pink-500
                       hover:bg-pink-600 transition font-semibold"
          >
            Create Room
          </button>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-pink-300 mb-8">
            Room Created!
          </h1>

          <p className="text-lg mb-3">
            Share this Room ID with your friend:
          </p>

          <div className="flex items-center gap-3">
            <div className="px-6 py-3 rounded-lg bg-[#0a0a2a] border border-blue-500 text-2xl font-bold tracking-widest">
              {roomId}
            </div>

            <button
              onClick={copyRoomId}
              className="px-4 py-3 rounded-lg bg-blue-500
                         hover:bg-blue-600 transition"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <p className="mt-6 text-gray-300">
            Waiting for another player...
          </p>
        </>
      )}

    </div>
  );
};

export default CreateRoom;