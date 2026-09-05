import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import socket from "../../socket/socket";
import HeartGrid from "./HeartGrid";

import usePlayAgain from "../../hooks/usePlayAgain";
import PlayAgainModal from "../../components/PlayAgain/PlayAgainModal";
import PlayAgainNotification from "../../components/PlayAgain/PlayAgainNotification";

import { gamesList } from "../../data/gamesList";

import '../GameCommon.css';
import "../../components/Instructions/Instructions.css";
import Instructions from "../../components/Instructions/Instructions";

import "./poisonhearts.css";

const PoisonHearts = () => {

    // ==========================================
    // ROOM / PLAYER INFORMATION
    // ==========================================

    const location = useLocation();

    const { game } = location.state || {};

    const gameInfo = gamesList.find(
        (item) => item.gameId === "poisonHearts"
    );

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

    const [explodingHeart, setExplodingHeart] =
        useState(null);

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
    // RESTART GAME
    // Called by reusable Play Again system
    // ==========================================

    const handleGameRestarted = useCallback((data) => {

        console.log(
            "Poison Hearts restarted:",
            data
        );

        const gameState =
            data.gameState;

        if (!gameState) {
            console.error(
                "Restarted game state is missing"
            );

            return;
        }

        // New board
        setBoard(
            gameState.board || []
        );

        // New phase
        setPhase(
            gameState.phase ||
            "poisonSelection"
        );

        // New current player
        setCurrentPlayer(
            gameState.currentPlayer ??
            null
        );

        /*
         * New round means both players need
         * to choose a new poison heart.
         *
         * We intentionally reset this locally.
         */
        setMyPoisonHeart(null);

        // Reset selected hearts
        setSelectedHearts(
            gameState.selectedHearts || []
        );

        // No exploding heart in a new round
        setExplodingHeart(null);

        // Reset result
        setWinner(
            gameState.winner ??
            null
        );

        setLoser(
            gameState.loser ??
            null
        );

        setIsDraw(
            gameState.draw ||
            false
        );

        /*
         * Scores should NOT reset when playing again.
         * They belong to the room/match.
         */
        setScores(
            data.scores || {
                1: 0,
                2: 0
            }
        );

    }, []);


    // ==========================================
    // REUSABLE PLAY AGAIN HOOK
    // ==========================================

    const {
        playAgainRequest,
        playAgainDeclined,
        waitingForResponse,
        requestPlayAgain,
        respondToPlayAgain,
        closeDeclineNotification
    } = usePlayAgain(
        roomId,
        handleGameRestarted
    );


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

            /*
             * The server sends the player's own
             * poison heart through public game state.
             */
            setMyPoisonHeart(
                gameState.myPoisonHeart ??
                gameState.myPoisonChoice ??
                null
            );

            setExplodingHeart(null);

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

            /*
             * Each player receives their own
             * poison choice only.
             */
            setMyPoisonHeart(
                gameState.myPoisonHeart ??
                gameState.myPoisonChoice ??
                null
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

            setExplodingHeart(null);

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
                "finished"
            );

            setCurrentPlayer(
                gameState.currentPlayer
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

            setScores(
                data.scores || {
                    1: 0,
                    2: 0
                }
            );

            // ==========================================
            // TRIGGER EXPLOSION
            // ==========================================

            if (
                data.explodedHeart !== undefined &&
                data.explodedHeart !== null
            ) {
                setExplodingHeart(
                    data.explodedHeart
                );
            }

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
    // GAME PROMPTS
    // ==========================================

    const getGamePrompt = () => {

        // ==========================================
        // POISON SELECTION
        // ==========================================

        if (
            phase === "poisonSelection"
        ) {

            if (
                myPoisonHeart === null
            ) {

                return {
                    title:
                        "Choose Your Poison Heart",

                    message:
                        "Select one heart. This heart will be poisonous for your opponent. Your choice is secret.",

                    type:
                        "choose"
                };
            }

            return {
                title:
                    "Poison Heart Locked!",

                message:
                    "Your poison heart has been chosen. Waiting for the other player to choose their heart...",

                type:
                    "waiting"
            };
        }


        // ==========================================
        // PLAYING
        // ==========================================

        if (
            phase === "playing"
        ) {

            if (
                currentPlayer ===
                playerNumber
            ) {

                return {
                    title:
                        "Your Turn!",

                    message:
                        "Choose a heart carefully. It could be the poisoned heart!",

                    type:
                        "your-turn"
                };
            }

            return {
                title:
                    "Opponent's Turn",

                message:
                    "Waiting for the other player to choose a heart...",

                type:
                    "opponent-turn"
            };
        }


        // ==========================================
        // GAME FINISHED
        // ==========================================

        if (
            phase === "finished"
        ) {

            return {
                title:
                    "Game Over",

                message:
                    "The game has ended.",

                type:
                    "finished"
            };
        }


        // ==========================================
        // DEFAULT
        // ==========================================

        return {
            title:
                "Poison Hearts",

            message:
                "Get ready to play!",

            type:
                "default"
        };
    };


    const prompt =
        getGamePrompt();


    // ==========================================
    // RENDER
    // ==========================================

    return (
        <div className="min-h-screen bg-[#05051f] text-white flex flex-col items-center px-4 py-8">

            <div className="game-header">
                <div className="game-title-row">

                    <h1 className="game-title">
                        {gameInfo.name}
                    </h1>

                    <Instructions
                        gameName={gameInfo.name}
                        instructions={gameInfo.instructions}
                    />

                </div>

                <p className="game-description">
                    {gameInfo.description}
                </p>
            </div>


            {/* GAME PROMPT */}

            <div
                className={`poison-prompt ${prompt.type}`}
            >
                <h4 className="text-xl font-bold mb-2 text-center">
                    {prompt.title}
                </h4>

                <p className="mb-2">
                    {prompt.message}
                </p>
            </div>


            {/* ROUND STATUS */}

            {/* 
            <p className="text-blue-200 mb-6 text-center">
                {getStatusMessage()}
            </p>
            */}


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
                explodingHeart={explodingHeart}

                onPoisonChoice={
                    handlePoisonChoice
                }

                onHeartSelect={
                    handleHeartSelect
                }

                // Play Again
                onPlayAgain={
                    requestPlayAgain
                }

                waitingForResponse={
                    waitingForResponse
                }

                winner={winner}
                isDraw={isDraw}
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


            {/* PLAY AGAIN REQUEST */}

            <PlayAgainModal
                request={playAgainRequest}

                gameName={
                    game?.name ||
                    "Poison Hearts"
                }

                onRespond={
                    respondToPlayAgain
                }
            />


            {/* PLAY AGAIN DECLINED */}

            <PlayAgainNotification
                playerName={
                    playAgainDeclined
                }

                onClose={
                    closeDeclineNotification
                }
            />

        </div>
    );
};


export default PoisonHearts;