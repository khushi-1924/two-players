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

    const roomId =
      sessionStorage.getItem("roomId");


    const savedPlayerNumber =
      sessionStorage.getItem(
        "playerNumber"
      );


    // ==========================================
    // NO ACTIVE ROOM
    // ==========================================

    if (
      !roomId ||
      !savedPlayerNumber
    ) {

      return;

    }


    const playerNumber =
      Number(savedPlayerNumber);


    // ==========================================
    // REJOIN ROOM
    // ==========================================

    const handleConnect = () => {

      console.log(
        "Socket connected. Trying to rejoin room..."
      );


      socket.emit(
        "rejoinRoom",
        {
          roomId,
          playerNumber
        }
      );

    };


    // ==========================================
    // ROOM REJOINED
    // ==========================================

    const handleRoomRejoined = (data) => {

      console.log(
        "Successfully rejoined room:",
        data
      );


      // ------------------------------------------
      // RESTORE PLAYER NUMBER
      // ------------------------------------------

      sessionStorage.setItem(
        "playerNumber",
        data.playerNumber
      );


      // ------------------------------------------
      // IF THERE IS AN ACTIVE GAME
      // ------------------------------------------

      if (data.currentGame) {

        // ==========================================
        // RESTORE GAME ONLY IF USER DID NOT
        // INTENTIONALLY GO BACK TO HOME
        // ==========================================

        const stayOnHome =
          sessionStorage.getItem("stayOnHome");


        if (
          data.currentGame &&
          stayOnHome !== "true"
        ) {

          const gameName =
            data.currentGame.name;


          console.log(
            "Restoring game:",
            gameName
          );


          sessionStorage.setItem(
            "currentGame",
            gameName
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


      sessionStorage.removeItem(
        "roomId"
      );


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


    // ==========================================
    // REJOIN WHEN SOCKET CONNECTS
    // ==========================================

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