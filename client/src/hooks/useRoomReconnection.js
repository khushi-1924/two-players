import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";

const gameRoutes = {
  ticTacToe: "/game/tic-tac-toe",
  connectFour: "/game/connect-four",
  rps: "/game/rps",
  poisonHearts: "/game/poison-hearts",
  guessTheNumber: "/game/guess-the-number"
};

const useRoomReconnection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const roomId = sessionStorage.getItem("roomId");

    const savedPlayerNumber = sessionStorage.getItem(
      "playerNumber"
    );

    // No active room
    if (!roomId || !savedPlayerNumber) {
      return;
    }

    const playerNumber = Number(savedPlayerNumber);

    // ==========================================
    // REJOIN ROOM
    // ==========================================

    const handleConnect = () => {
      console.log(
        "Socket connected. Trying to rejoin room..."
      );

      socket.emit("rejoinRoom", {
        roomId,
        playerNumber
      });
    };

    // ==========================================
    // ROOM REJOINED
    // ==========================================

    const handleRoomRejoined = (data) => {
      console.log(
        "Successfully rejoined room:",
        data
      );

      // Restore player number
      sessionStorage.setItem(
        "playerNumber",
        data.playerNumber
      );

      // If there is a game running
      if (data.currentGame) {
        const gameName =
          data.currentGame.name;

        console.log(
          "Restoring game:",
          gameName
        );

        // Save current game name
        sessionStorage.setItem(
          "currentGame",
          gameName
        );

        // Save complete state temporarily
        sessionStorage.setItem(
          "rejoinedGameState",
          JSON.stringify({
            currentGame:
              data.currentGame,

            scores:
              data.scores
          })
        );

        const gameRoute =
          gameRoutes[gameName];

        if (gameRoute) {
          console.log(
            "Redirecting to:",
            gameRoute
          );

          navigate(
            gameRoute,
            {
              replace: true
            }
          );
        }
      }
    };

    // ==========================================
    // REJOIN FAILED
    // ==========================================

    const handleRejoinFailed = (data) => {
      console.log(
        "Could not rejoin room:",
        data.message
      );

      sessionStorage.removeItem("roomId");

      sessionStorage.removeItem(
        "playerNumber"
      );

      sessionStorage.removeItem(
        "currentGame"
      );

      sessionStorage.removeItem(
        "rejoinedGameState"
      );

      navigate(
        "/",
        {
          replace: true
        }
      );
    };

    // ==========================================
    // SOCKET LISTENERS
    // ==========================================

    socket.on(
      "roomRejoined",
      handleRoomRejoined
    );

    socket.on(
      "rejoinFailed",
      handleRejoinFailed
    );

    // If already connected, immediately rejoin
    if (socket.connected) {
      handleConnect();
    } else {
      socket.once(
        "connect",
        handleConnect
      );
    }

    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      socket.off(
        "roomRejoined",
        handleRoomRejoined
      );

      socket.off(
        "rejoinFailed",
        handleRejoinFailed
      );

      socket.off(
        "connect",
        handleConnect
      );
    };

  }, [navigate]);
};

export default useRoomReconnection;