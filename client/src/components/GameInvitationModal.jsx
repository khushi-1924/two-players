import React from "react";

const GameInvitationModal = ({
  invitation,
  onAccept,
  onDecline
}) => {

  if (!invitation) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60 backdrop-blur-sm
      "
    >
      <div
        className="
          w-[90%] max-w-md
          rounded-2xl
          bg-[#0a0a2a]
          border border-blue-500
          p-8
          text-center
          shadow-[0_0_30px_rgba(59,130,246,0.25)]
        "
      >
        <div className="text-5xl mb-4">
          🎮
        </div>

        <h2 className="text-2xl font-bold text-pink-300 mb-4">
          Game Invitation!
        </h2>

        <p className="text-white text-lg mb-2">
          <span className="font-semibold text-cyan-300">
            {invitation.senderName}
          </span>
          {" "}invited you to play
        </p>

        <p className="text-xl font-bold text-yellow-300 mb-8">
          {invitation.game}
        </p>

        <div className="flex justify-center gap-4">

          <button
            onClick={onAccept}
            className="
              px-6 py-3 rounded-xl
              bg-green-500
              text-white font-semibold
              hover:bg-green-600
              transition
            "
          >
            Accept
          </button>

          <button
            onClick={onDecline}
            className="
              px-6 py-3 rounded-xl
              bg-red-500
              text-white font-semibold
              hover:bg-red-600
              transition
            "
          >
            Decline
          </button>

        </div>

      </div>
    </div>
  );
};

export default GameInvitationModal;