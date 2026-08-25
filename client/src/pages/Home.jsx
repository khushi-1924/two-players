import React, { useEffect, useState } from 'react';
import {
  useNavigate,
  useLocation
} from "react-router-dom";
import { gamesList } from '../data/gamesList';
import GameCard from '../components/GameCard';
import socket from '../socket/socket';
import PlayerDisconnectedModal from '../components/PlayerDisconnectedModal';

const Home = () => {

  const navigate = useNavigate();
  const location = useLocation();


  const [invitation, setInvitation] = useState(null);
  const [sentInvitation, setSentInvitation] = useState(null);
  const [declinedInvitation, setDeclinedInvitation] = useState(null);
  const [disconnectedPlayer, setDisconnectedPlayer] = useState(null);

  const [gameLeftNotification, setGameLeftNotification] =
    useState(
      location.state?.gameLeftBy || null
    );

  const roomId = sessionStorage.getItem("roomId");


  useEffect(() => {

    // ==========================================
    // RECEIVE INVITATION
    // ==========================================

    const handleGameInvitation = (data) => {

      console.log("Game invitation received:", data);

      setInvitation(data);

    };


    // ==========================================
    // INVITATION ACCEPTED
    // ==========================================

    const handleInvitationAccepted = (data) => {

      sessionStorage.removeItem(
        "stayOnHome"
      );

      console.log("Invitation accepted:", data);

      setInvitation(null);
      setSentInvitation(null);

      const selectedGame = gamesList.find(
        (game) => game.gameId === data.game
      );

      if (!selectedGame) {
        console.log("Game not found:", data.game);
        return;
      }

      navigate(
        selectedGame.path,
        {
          state: {
            game: selectedGame
          }
        }
      );

    };


    // ==========================================
    // INVITATION DECLINED
    // ==========================================

    const handleInvitationDeclined = (data) => {

      console.log("Invitation declined:", data);

      // Remove the waiting modal
      setSentInvitation(null);

      // Show declined modal instead
      setDeclinedInvitation(data);

    };


    socket.on(
      "gameInvitation",
      handleGameInvitation
    );

    socket.on(
      "gameInvitationAccepted",
      handleInvitationAccepted
    );

    socket.on(
      "gameInvitationDeclined",
      handleInvitationDeclined
    );


    return () => {

      socket.off(
        "gameInvitation",
        handleGameInvitation
      );

      socket.off(
        "gameInvitationAccepted",
        handleInvitationAccepted
      );

      socket.off(
        "gameInvitationDeclined",
        handleInvitationDeclined
      );

    };

  }, [navigate]);

  useEffect(() => {

    const handlePlayerDisconnected = (data) => {

      console.log(
        "PLAYER DISCONNECTED EVENT RECEIVED:",
        data
      );

      setDisconnectedPlayer(data);
    };

    socket.on(
      "playerDisconnected",
      handlePlayerDisconnected
    );

    return () => {

      socket.off(
        "playerDisconnected",
        handlePlayerDisconnected
      );

    };

  }, []);


  // ==========================================
  // SEND INVITATION
  // ==========================================

  const handleInvite = (game) => {

    if (sentInvitation) {
      return;
    }

    console.log(
      "Sending invitation:",
      game.gameId
    );

    socket.emit("sendGameInvitation", {
      roomId,
      game: game.gameId
    });

    setSentInvitation(game);

  };


  // ==========================================
  // ACCEPT INVITATION
  // ==========================================

  const handleAcceptInvitation = () => {

    socket.emit(
      "respondGameInvitation",
      {
        roomId,
        game: invitation.game,
        accepted: true
      }
    );

    setInvitation(null);

  };


  // ==========================================
  // DECLINE INVITATION
  // ==========================================

  const handleDeclineInvitation = () => {

    socket.emit(
      "respondGameInvitation",
      {
        roomId,
        game: invitation.game,
        accepted: false
      }
    );

    setInvitation(null);

  };


  return (
    <div className='flex flex-col justify-center items-center'>

      <h1 className='my-3 text-3xl font-bold text-sky-200'>
        Multiplayer Games
      </h1>

      <p className='text-gray-500'>
        Select any game you want to play
      </p>


      {/* GAME CARDS */}

      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-10'>

        {gamesList.map((game) => (

          <GameCard
            key={game.id}
            game={game}
            onInvite={handleInvite}
          />

        ))}

      </div>


      {/* =====================================
          INVITATION RECEIVED MODAL
      ====================================== */}

      {invitation && (

        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>

          <div className='w-[90%] max-w-md rounded-2xl bg-[#0a0a2a] border border-blue-500 p-8 text-center shadow-[0_0_30px_rgba(59,130,246,0.25)]'>

            <h2 className='text-2xl font-bold text-pink-300 mb-4'>
              🎮 Game Challenge!
            </h2>

            <p className='text-white text-lg mb-8'>

              <span className='font-semibold'>
                {invitation.playerName}
              </span>

              {" "}challenged you to play{" "}

              <span className='font-semibold text-cyan-300'>
                {
                  gamesList.find(
                    game =>
                      game.gameId === invitation.game
                  )?.name
                }
              </span>

              !

            </p>


            <div className='flex justify-center gap-4'>

              <button
                onClick={handleAcceptInvitation}
                className='px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition'
              >
                Accept
              </button>

              <button
                onClick={handleDeclineInvitation}
                className='px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition'
              >
                Decline
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================
          INVITATION SENT MODAL
      ====================================== */}

      {sentInvitation && (

        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>

          <div className='w-[90%] max-w-md rounded-2xl bg-[#0a0a2a] border border-blue-500 p-8 text-center shadow-[0_0_30px_rgba(59,130,246,0.25)]'>

            <div className='text-5xl mb-4 animate-pulse'>
              🎮
            </div>

            <h2 className='text-2xl font-bold text-pink-300 mb-4'>
              Invitation Sent!
            </h2>

            <p className='text-white text-lg'>

              Waiting for the other player to accept your challenge to play{" "}

              <span className='font-semibold text-cyan-300'>
                {sentInvitation.name}
              </span>

              ...

            </p>

            <div className='mt-6 flex justify-center'>
              <div className='flex gap-2'>

                <span className='w-2 h-2 rounded-full bg-blue-400 animate-bounce'></span>

                <span className='w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.15s]'></span>

                <span className='w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.3s]'></span>

              </div>
            </div>

          </div>

        </div>

      )}

      {/* =====================================
    INVITATION DECLINED MODAL
===================================== */}

      {declinedInvitation && (

        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>

          <div className='w-[90%] max-w-md rounded-2xl bg-[#0a0a2a] border border-red-500 p-8 text-center shadow-[0_0_30px_rgba(239,68,68,0.2)]'>

            <div className='text-5xl mb-4'>
              😢
            </div>

            <h2 className='text-2xl font-bold text-red-300 mb-4'>
              Invitation Declined
            </h2>

            <p className='text-white text-lg mb-8'>

              <span className='font-semibold text-pink-300'>
                {declinedInvitation.playerName}
              </span>

              {" "}declined your invitation to play{" "}

              <span className='font-semibold text-cyan-300'>
                {
                  gamesList.find(
                    game => game.gameId === declinedInvitation.game
                  )?.name
                }
              </span>

              .

            </p>

            <button
              onClick={() => setDeclinedInvitation(null)}
              className='px-7 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition'
            >
              Okay
            </button>

          </div>

        </div>

      )}

      {disconnectedPlayer && (

        <PlayerDisconnectedModal
          playerName={
            disconnectedPlayer.playerName
          }
          seconds={
            disconnectedPlayer.seconds
          }
        />

      )}

      {gameLeftNotification && (

        <div className="
    fixed
    inset-0
    z-50
    flex
    items-center
    justify-center
    bg-black/60
    backdrop-blur-sm
  ">

          <div className="
      w-[90%]
      max-w-md
      rounded-2xl
      bg-[#0a0a2a]
      border
      border-blue-500
      p-8
      text-center
    ">

            <div className="text-5xl mb-4">

              🎮

            </div>


            <h2 className="
        text-2xl
        font-bold
        text-pink-300
        mb-4
      ">

              Game Ended

            </h2>


            <p className="
        text-white
        text-lg
        mb-8
      ">

              {gameLeftNotification ===
                sessionStorage.getItem("playerName")
                ? (
                  <>
                    You left the game.
                  </>
                )
                : (
                  <>
                    {gameLeftNotification} left the game.
                  </>
                )}

            </p>


            <button

              onClick={() =>
                setGameLeftNotification(null)
              }

              className="
          px-7
          py-3
          rounded-xl
          bg-blue-500
          text-white
          font-semibold
          hover:bg-blue-600
          transition
        "

            >

              Okay

            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Home;