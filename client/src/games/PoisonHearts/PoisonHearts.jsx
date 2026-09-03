import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import socket from "../../socket/socket";
import HeartGrid from "./HeartGrid";
import "./poisonhearts.css";

const PoisonHearts = () => {

    // ==========================================
    // ROOM / PLAYER INFORMATION
    // ==========================================

    const location = useLocation();

    const { game } = location.state || {};

    const roomId =
        sessionStorage.getItem("roomId");

    const playerNumber =
        Number(
            sessionStorage.getItem("playerNumber")
        );


    // ==========================================
    // GAME STATE
    // ==========================================

    const [board, setBoard] = useState([]);

    const [phase, setPhase] =
        useState("poisonSelection");

    const [currentPlayer, setCurrentPlayer] =
        useState(null);

    const [myPoisonHeart, setMyPoisonHeart] =
        useState(null);

    const [selectedHearts, setSelectedHearts] =
        useState([]);

    const [winner, setWinner] =
        useState(null);

    const [loser, setLoser] =
        useState(null);

    const [isDraw, setIsDraw] =
        useState(false);

    const [scores, setScores] =
        useState({
            1: 0,
            2: 0
        });


    // ==========================================
    // GAME STARTED / RESTORED
    // ==========================================

    const handleGameStarted =
        useCallback((data) => {

            const gameState =
                data.gameState;

            if (!gameState) {
                return;
            }


            setBoard(
                gameState.board || []
            );

            setPhase(
                gameState.phase ||
                "poisonSelection"
            );

            setCurrentPlayer(
                gameState.currentPlayer
            );

            setSelectedHearts(
                gameState.selectedHearts ||
                []
            );

            setWinner(
                gameState.winner ||
                null
            );

            setLoser(
                gameState.loser ||
                null
            );

            setIsDraw(
                gameState.draw ||
                false
            );

            setMyPoisonHeart(
                gameState.myPoisonHeart ??
                null
            );

            setScores(
                data.scores || {
                    1: 0,
                    2: 0
                }
            );

        }, []);


    // ==========================================
    // POISON HEART CHOICE SAVED
    // ==========================================

    const handlePoisonChoiceSaved =
        useCallback((data) => {

            setMyPoisonHeart(
                data.heartId
            );

        }, []);


    // ==========================================
    // BOTH PLAYERS FINISHED POISON SELECTION
    // ==========================================

    const handlePoisonSelectionComplete =
        useCallback((data) => {

            const gameState =
                data.gameState;

            if (!gameState) {
                return;
            }


            setBoard(
                gameState.board || []
            );

            setPhase(
                gameState.phase ||
                "playing"
            );

            setCurrentPlayer(
                gameState.currentPlayer
            );

            setSelectedHearts(
                gameState.selectedHearts ||
                []
            );

            setMyPoisonHeart(
                gameState.myPoisonHeart ??
                null
            );

            setScores(
                data.scores || {
                    1: 0,
                    2: 0
                }
            );

        }, []);


    // ==========================================
    // HEART SELECTED DURING GAME
    // ==========================================

    const handlePoisonHeartSelected =
        useCallback((data) => {

            const gameState =
                data.gameState;

            if (!gameState) {
                return;
            }


            setBoard(
                gameState.board || []
            );

            setSelectedHearts(
                gameState.selectedHearts ||
                []
            );

            setCurrentPlayer(
                gameState.currentPlayer
            );

            setPhase(
                gameState.phase ||
                "playing"
            );

        }, []);


    // ==========================================
    // GAME OVER
    // ==========================================

    const handleGameOver =
        useCallback((data) => {

            const gameState =
                data.gameState;

            if (!gameState) {
                return;
            }


            setBoard(
                gameState.board || []
            );

            setPhase(
                gameState.phase ||
                "playing"
            );

            setCurrentPlayer(null);

            setSelectedHearts(
                gameState.selectedHearts ||
                []
            );

            setWinner(
                data.winner ??
                gameState.winner ??
                null
            );

            setLoser(
                data.loser ??
                gameState.loser ??
                null
            );

            setIsDraw(
                data.draw ||
                gameState.draw ||
                false
            );

            setMyPoisonHeart(
                gameState.myPoisonHeart ??
                null
            );

            setScores(
                data.scores || {
                    1: 0,
                    2: 0
                }
            );

        }, []);


    // ==========================================
    // GAME SOCKET EVENTS
    // ==========================================

    useEffect(() => {

        socket.on(
            "gameStarted",
            handleGameStarted
        );

        socket.on(
            "poisonChoiceSaved",
            handlePoisonChoiceSaved
        );

        socket.on(
            "poisonSelectionComplete",
            handlePoisonSelectionComplete
        );

        socket.on(
            "poisonHeartSelected",
            handlePoisonHeartSelected
        );

        socket.on(
            "gameOver",
            handleGameOver
        );


        // ========================================
        // CLEANUP
        // ========================================

        return () => {

            socket.off(
                "gameStarted",
                handleGameStarted
            );

            socket.off(
                "poisonChoiceSaved",
                handlePoisonChoiceSaved
            );

            socket.off(
                "poisonSelectionComplete",
                handlePoisonSelectionComplete
            );

            socket.off(
                "poisonHeartSelected",
                handlePoisonHeartSelected
            );

            socket.off(
                "gameOver",
                handleGameOver
            );

        };

    }, [
        handleGameStarted,
        handlePoisonChoiceSaved,
        handlePoisonSelectionComplete,
        handlePoisonHeartSelected,
        handleGameOver
    ]);


    // ==========================================
    // REQUEST GAME
    // ==========================================

    useEffect(() => {

        if (!roomId) {
            return;
        }


        socket.emit(
            "startGame",
            {
                roomId,
                game: "poisonHearts"
            }
        );

    }, [roomId]);


    // ==========================================
    // CHOOSE POISON HEART
    // ==========================================

    const handlePoisonChoice =
        (heartId) => {

            if (
                phase !==
                "poisonSelection"
            ) {
                return;
            }

            if (
                myPoisonHeart !== null
            ) {
                return;
            }


            socket.emit(
                "poisonHeartChoice",
                {
                    roomId,
                    heartId
                }
            );

        };


    // ==========================================
    // SELECT HEART DURING GAME
    // ==========================================

    const handleHeartSelect =
        (heartId) => {

            if (
                phase !== "playing"
            ) {
                return;
            }


            if (
                currentPlayer !==
                playerNumber
            ) {
                return;
            }


            if (
                selectedHearts.includes(
                    heartId
                )
            ) {
                return;
            }


            socket.emit(
                "selectPoisonHeart",
                {
                    roomId,
                    heartId
                }
            );

        };


    // ==========================================
    // GAME STATUS MESSAGE
    // ==========================================

    const getStatusMessage = () => {

        if (
            winner !== null
        ) {

            if (
                winner === playerNumber
            ) {
                return "🎉 You won!";
            }

            return "💔 You lost!";
        }


        if (isDraw) {
            return "❤️ Both players survived!";
        }


        if (
            phase ===
            "poisonSelection"
        ) {

            if (
                myPoisonHeart !== null
            ) {
                return "✅ Poison heart chosen — waiting for opponent...";
            }

            return "💜 Choose your poison heart";
        }


        if (
            currentPlayer ===
            playerNumber
        ) {
            return "🎮 Your turn — choose a heart";
        }


        return "⏳ Waiting for opponent...";
    };


    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="min-h-screen bg-[#05051f] text-white flex flex-col items-center px-4 py-8">

            {/* TITLE */}

            <h1 className="text-3xl sm:text-4xl font-bold text-pink-300 mb-2">
                💜 Poison Hearts
            </h1>


            {/* ROUND STATUS */}

            <p className="text-blue-200 mb-6 text-center">
                {getStatusMessage()}
            </p>


            {/* SCORE */}

            <div className="flex gap-8 mb-6 text-lg font-semibold">

                <div>
                    Player 1:
                    <span className="text-blue-300 ml-2">
                        {scores[1]}
                    </span>
                </div>

                <div>
                    Player 2:
                    <span className="text-pink-300 ml-2">
                        {scores[2]}
                    </span>
                </div>

            </div>


            {/* HEART BOARD */}

            <HeartGrid
                board={board}
                phase={phase}
                currentPlayer={currentPlayer}
                playerNumber={playerNumber}
                myPoisonHeart={myPoisonHeart}
                selectedHearts={selectedHearts}
                onPoisonChoice={
                    handlePoisonChoice
                }
                onHeartSelect={
                    handleHeartSelect
                }
            />


            {/* RESULT */}

            {winner !== null && (
                <div className="mt-8 text-xl font-bold">

                    {winner === playerNumber
                        ? "🎉 You won the game!"
                        : "💔 Your opponent won!"
                    }

                </div>
            )}


            {isDraw && (
                <div className="mt-8 text-xl font-bold text-pink-300">
                    ❤️ Both players survived!
                </div>
            )}

        </div>
    );
};


export default PoisonHearts;