import { useNavigate } from "react-router-dom";
import socket from "../socket/socket";

const GameNavbar = () => {
    const navigate = useNavigate();

    const handleBackToGames = () => {
        const roomId = sessionStorage.getItem("roomId");

        // ==========================================
        // TELL SERVER PLAYER LEFT THE GAME
        // ==========================================
        if (roomId) {
            socket.emit("leaveGame", {
                roomId,
            });
        }

        // ==========================================
        // PREVENT OLD GAME FROM BEING RESTORED
        // ==========================================
        sessionStorage.setItem("stayOnHome", "true");

        sessionStorage.removeItem("currentGame");

        // ==========================================
        // GO BACK TO GAMES IMMEDIATELY
        // ==========================================
        navigate("/home", {
            replace: true,
        });
    };

    return (
        <nav
            className="
                w-full
                flex
                items-center
                justify-between
                px-3 sm:px-6
                py-3 sm:py-4
                bg-[#0a0a2a]
                border-b
                border-blue-500/30
                gap-3
            "
        >
            <h1
                className="
                    text-base sm:text-xl
                    font-bold
                    text-pink-300
                    whitespace-nowrap
                "
            >
                🎮 Two Player Games
            </h1>

            <button
                onClick={handleBackToGames}
                className="
                    px-3 sm:px-5
                    py-2
                    rounded-lg
                    bg-blue-500
                    text-white
                    text-sm sm:text-base
                    font-semibold
                    hover:bg-blue-600
                    transition
                    whitespace-nowrap
                "
            >
                ← Back to Games
            </button>
        </nav>
    );
};

export default GameNavbar;