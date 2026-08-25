import {
  Outlet,
  useNavigate
} from "react-router-dom";

import {
  useEffect
} from "react";

import GameNavbar from "../components/GameNavbar";

import socket from "../socket/socket";


const GameLayout = () => {

  const navigate = useNavigate();


  useEffect(() => {

    // ==========================================
    // GAME LEFT
    // BOTH PLAYERS RETURN TO HOME
    // ==========================================

    const handleGameLeft = (data) => {

      console.log(
        `${data.playerName} left the game`
      );


      // Prevent reconnection logic
      // from restoring the old game

      sessionStorage.setItem(
        "stayOnHome",
        "true"
      );


      // Remove old game information

      sessionStorage.removeItem(
        "currentGame"
      );


      // Return both players to Home

      if (data.leftBySelf) {

        // The current player intentionally left
        navigate(
          "/home",
          {
            replace: true
          }
        );

      } else {

        // The other player left
        navigate(
          "/home",
          {
            replace: true,

            state: {
              gameLeftBy:
                data.playerName
            }
          }
        );

      }

    };


    socket.on(
      "gameLeft",
      handleGameLeft
    );


    return () => {

      socket.off(
        "gameLeft",
        handleGameLeft
      );

    };

  }, [navigate]);


  return (

    <div className="min-h-screen">

      <GameNavbar />

      <main>

        <Outlet />

      </main>

    </div>

  );

};


export default GameLayout;