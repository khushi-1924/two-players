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

import usePlayerNames from "../../hooks/usePlayerNames";

import "./poisonhearts.css";

const PoisonHearts = () => {

    // ==========================================
    // ROOM / PLAYER INFORMATION
    // ==========================================

    const location = useLocation();

    const {
        game,
        restoredGame,
        scores: restoredScores
    } = location.state || {};

    const gameInfo = gamesList.find(
        (item) => item.gameId === "poisonHearts"
    );

    const roomId =
        sessionStorage.getItem("roomId");

    const {
        playerNames,
        playerNumber,
    } = usePlayerNames();


    // ==========================================
    // GAME STATE
    // ==========================================

    const [board, setBoard] =
        useState(
            restoredGame?.board || []
        );

    const [phase, setPhase] =
        useState(
            restoredGame?.phase ||
            "poisonSelection"
        );

    const [currentPlayer, setCurrentPlayer] =
        useState(
            restoredGame?.currentPlayer ??
            null
        );

    const [myPoisonHeart, setMyPoisonHeart] =
        useState(
            restoredGame?.myPoisonChoice ??
            null
        );

    const [selectedHearts, setSelectedHearts] =
        useState(
            restoredGame?.selectedHearts || []
        );

    const [winner, setWinner] =
        useState(
            restoredGame?.winner ??
            null
        );

    const [loser, setLoser] =
        useState(
            restoredGame?.loser ??
            null
        );

    const [isDraw, setIsDraw] =
        useState(
            restoredGame?.draw ||
            false
        );

    const [scores, setScores] =
        useState(
            restoredScores || {
                1: 0,
                2: 0
            }
        );

    const [explodingHeart, setExplodingHeart] =
        useState(null);


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
    // RESTORE GAME STATE AFTER RECONNECTION
    // ==========================================

    useEffect(() => {

        if (!restoredGame) {
            return;
        }

        console.log(
            "Restoring Poison Hearts state:",
            restoredGame
        );

        setBoard(
            restoredGame.board || []
        );

        setPhase(
            restoredGame.phase ||
            "poisonSelection"
        );

        setCurrentPlayer(
            restoredGame.currentPlayer ??
            null
        );

        setMyPoisonHeart(
            restoredGame.myPoisonChoice ??
            null
        );

        setSelectedHearts(
            restoredGame.selectedHearts || []
        );

        setWinner(
            restoredGame.winner ??
            null
        );

        setLoser(
            restoredGame.loser ??
            null
        );

        setIsDraw(
            restoredGame.draw ||
            false
        );

        setExplodingHeart(null);

        if (restoredScores) {
            setScores(restoredScores);
        }

    }, [restoredGame, restoredScores]);


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

        // If this game was restored after refresh,
        // do NOT start/request the game again.
        if (restoredGame) {
            return;
        }

        const startGame = () => {

            socket.emit(
                "startGame",
                {
                    roomId,
                    game: "poisonHearts"
                }
            );

        };

        if (socket.connected) {

            startGame();

        } else {

            socket.once(
                "connect",
                startGame
            );

        }

        return () => {

            socket.off(
                "connect",
                startGame
            );

        };

    }, [roomId, restoredGame]);


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
        // GAME OVER
        if (winner !== null) {
            if (winner === playerNumber) {
                return "🎉 You won!";
            }

            return `💔 ${playerNames[winner] || "Opponent"} won!`;
        }

        // DRAW
        if (isDraw) {
            return "❤️ Both players survived!";
        }

        // POISON SELECTION
        if (phase === "poisonSelection") {
            if (myPoisonHeart !== null) {
                return "⏳ Waiting for opponent to choose their poison heart...";
            }

            return "💜 Choose your poison heart";
        }

        // PLAYING
        if (currentPlayer === playerNumber) {
            return "Your turn";
        }

        return "Opponent's turn...";
    };


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


            {/* POISON SELECTION PROMPT */}

            {phase === "poisonSelection" &&
                myPoisonHeart === null && (
                    <div className="poison-prompt choose">
                        <h4 className="text-xl font-bold mb-2 text-center">
                            Choose Your Poison Heart
                        </h4>

                        <p className="mb-2">
                            Select one heart. This heart will be poisonous
                            for your opponent. Your choice is secret.
                        </p>
                    </div>
                )}

            {/* GAME STATUS */}

            <p className="text-xl text-white text-center mb-6">
                {getStatusMessage()}
            </p>


            {/* HEART BOARD */}

            <HeartGrid
                board={board}
                phase={phase}
                currentPlayer={currentPlayer}
                playerNumber={playerNumber}
                playerNames={playerNames}
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

            {/* SCORE */}
            <div className="mt-5 text-base sm:text-lg text-white text-center">
                <span>
                    {playerNames[1] || "Player 1"}: {scores[1] || 0}
                </span>

                {" | "}

                <span>
                    {playerNames[2] || "Player 2"}: {scores[2] || 0}
                </span>
            </div>


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