import React, {
    useEffect,
    useState,
    useCallback
} from "react";

import Grid from "./Grid";
import ScoreBoard from "./ScoreBoard";

import { useLocation } from "react-router-dom";

import socket from "../../socket/socket";
import usePlayAgain from "../../hooks/usePlayAgain";
import PlayAgainModal from
    "../../components/PlayAgain/PlayAgainModal";
import PlayAgainNotification from
    "../../components/PlayAgain/PlayAgainNotification";

import { gamesList } from "../../data/gamesList";
import "../GameCommon.css";

import "../../components/Instructions/Instructions.css";
import Instructions from
    "../../components/Instructions/Instructions";

import usePlayerNames from
    "../../hooks/usePlayerNames";


const DotsAndBoxes = () => {

    const location = useLocation();

    const {
        game,
        restoredGame,
        scores: restoredScores
    } = location.state || {};


    // ==========================================
    // GAME INFO
    // ==========================================

    const gameInfo = gamesList.find(
        (item) => item.gameId === "dotsAndBoxes"
    );


    // ==========================================
    // GAME RESULT STATES
    // ==========================================

    const [winner, setWinner] =
        useState(
            restoredGame?.winner || null
        );

    const [isDraw, setIsDraw] =
        useState(
            restoredGame?.draw || false
        );


    // ==========================================
    // OVERALL ROOM SCORES
    // ==========================================

    const [scores, setScores] =
        useState(
            restoredScores || {
                1: 0,
                2: 0
            }
        );

    // ==========================================
    // GAME STATE
    // ==========================================

    const [currentPlayer, setCurrentPlayer] =
        useState(
            restoredGame?.currentPlayer || 1
        );

    const [horizontalLines, setHorizontalLines] =
        useState([]);

    const [verticalLines, setVerticalLines] =
        useState([]);

    const [boxes, setBoxes] =
        useState([]);

    const [player1Score, setPlayer1Score] =
        useState(0);

    const [player2Score, setPlayer2Score] =
        useState(0);

    // ==========================================
    // COMPLETE GAME STATE
    // ==========================================

    const getGameState = () => {

        return {
            currentPlayer,

            horizontalLines,

            verticalLines,

            boxes,

            scores: {
                player1: player1Score,
                player2: player2Score
            }
        };
    };


    // ==========================================
    // RESET GAME
    // ==========================================

    const resetGame = () => {

        setCurrentPlayer(1);

        setHorizontalLines([]);

        setVerticalLines([]);

        setBoxes([]);

        setPlayer1Score(0);

        setPlayer2Score(0);
    };


    // ==========================================
    // ROOM / PLAYER INFORMATION
    // ==========================================

    const roomId =
        sessionStorage.getItem("roomId");

    const {
        playerNames,
        playerNumber,
    } = usePlayerNames();



    // ==========================================
    // RESTART DOTS AND BOXES
    // ==========================================

    const handleGameRestarted =
        useCallback((data) => {

            console.log(
                "Dots and Boxes restarted:",
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


            setCurrentPlayer(
                gameState.currentPlayer
            );

            setWinner(
                gameState.winner || null
            );

            setIsDraw(
                gameState.draw || false
            );

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
    // GAME SOCKET EVENTS
    // ==========================================

    useEffect(() => {

        // ========================================
        // GAME STARTED / RESTORED
        // ========================================

        const handleGameStarted = (data) => {

            console.log(
                "Dots and Boxes state received:",
                data
            );

            const gameState = data.gameState;

            if (!gameState) {
                return;
            }

            // Restore board
            setHorizontalLines(
                gameState.horizontalLines || []
            );

            setVerticalLines(
                gameState.verticalLines || []
            );

            setBoxes(
                gameState.boxes || []
            );

            // Restore turn
            setCurrentPlayer(
                gameState.currentPlayer
            );

            // Restore scores
            const newScores =
                data.scores || {
                    1: 0,
                    2: 0
                };

            setScores(newScores);

            setPlayer1Score(
                newScores[1] || 0
            );

            setPlayer2Score(
                newScores[2] || 0
            );

            // Restore result state
            if (
                gameState.status === "finished"
            ) {

                setWinner(
                    gameState.winner || null
                );

                setIsDraw(
                    gameState.draw || false
                );

            } else {

                setWinner(null);
                setIsDraw(false);

            }

        };


        // ========================================
        // GAME UPDATED
        // ========================================

        const handleGameUpdated = (data) => {

            console.log(
                "Dots and Boxes updated:",
                data
            );

            setHorizontalLines(
                data.horizontalLines || []
            );

            setVerticalLines(
                data.verticalLines || []
            );

            setBoxes(
                data.boxes || []
            );

            setCurrentPlayer(
                data.currentPlayer
            );

            const newScores =
                data.scores || {
                    1: 0,
                    2: 0
                };

            setScores(newScores);

            setPlayer1Score(
                newScores[1] || 0
            );

            setPlayer2Score(
                newScores[2] || 0
            );
        };


        // ========================================
        // GAME OVER
        // ========================================

        const handleGameOver = (data) => {

            console.log(
                "Dots and Boxes game over:",
                data
            );


            setWinner(
                data.winner || null
            );


            setIsDraw(
                data.draw || false
            );


            setScores(
                data.scores || {
                    1: 0,
                    2: 0
                }
            );


            setCurrentPlayer(null);

        };


        // ========================================
        // REGISTER LISTENERS
        // ========================================

        socket.on(
            "gameStarted",
            handleGameStarted
        );

        socket.on(
            "boardUpdated",
            handleGameUpdated
        );

        socket.on(
            "gameOver",
            handleGameOver
        );


        // ========================================
        // REQUEST CURRENT SERVER STATE
        // ========================================

        const startGame = () => {

            console.log(
                "Requesting Dots and Boxes state..."
            );

            socket.emit(
                "startGame",
                {
                    roomId,
                    game: "dotsAndBoxes"
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


        // ========================================
        // CLEANUP
        // ========================================

        return () => {

            socket.off(
                "gameStarted",
                handleGameStarted
            );

            socket.off(
                "boardUpdated",
                handleGameUpdated
            );

            socket.off(
                "gameOver",
                handleGameOver
            );

            socket.off(
                "connect",
                startGame
            );

        };

    }, [roomId]);


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="game-container">

            <div className="game-header">

                <div className="game-title-row">

                    <h1 className="game-title">
                        {gameInfo.name}
                    </h1>


                    <Instructions
                        gameName={gameInfo.name}
                        instructions={
                            gameInfo.instructions
                        }
                    />

                </div>


                <p className="game-description">
                    {gameInfo.description}
                </p>

            </div>


            <div className="py-10 dots-boxes-game">

                <Grid
                    currentPlayer={currentPlayer}
                    setCurrentPlayer={setCurrentPlayer}

                    horizontalLines={horizontalLines}
                    setHorizontalLines={setHorizontalLines}

                    verticalLines={verticalLines}
                    setVerticalLines={setVerticalLines}

                    boxes={boxes}
                    setBoxes={setBoxes}

                    setPlayer1Score={setPlayer1Score}
                    setPlayer2Score={setPlayer2Score}
                />
                <ScoreBoard
                    currentPlayer={currentPlayer}
                    player1Score={player1Score}
                    player2Score={player2Score}
                />

            </div>


            <PlayAgainModal
                request={playAgainRequest}
                gameName={
                    game?.name ||
                    "Dots and Boxes"
                }
                onRespond={
                    respondToPlayAgain
                }
            />


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


export default DotsAndBoxes;