import { useEffect, useState } from 'react';
import socket from '../socket/socket';

const usePlayAgain = (roomId, onGameRestarted) => {

  const [playAgainRequest, setPlayAgainRequest] = useState(null);

  const [playAgainDeclined, setPlayAgainDeclined] =
    useState(null);

  const [waitingForResponse, setWaitingForResponse] =
    useState(false);


  // ==========================================
  // REQUEST PLAY AGAIN
  // ==========================================

  const requestPlayAgain = () => {

    console.log("I clicked Play Again");

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
      accepted ? "Accepted" : "Declined"
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

      setPlayAgainDeclined(data.playerName);

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