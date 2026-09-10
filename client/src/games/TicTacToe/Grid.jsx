import React from "react";

import Cell from "./Cell";

import PlayAgainButton from "../../components/PlayAgain/PlayAgainButton";

const Grid = ({
    board,
    currentPlayer,
    playerNumber,
    playerNames = {
        1: "Player 1",
        2: "Player 2",
    },
    winningCells = [],
    winner,
    isDraw,
    scores = { 1: 0, 2: 0 },
    onCellClick,
    onPlayAgain,
    waitingForResponse,
}) => {
    const getWinningLineStyle = (cells) => {
        const styles = {
            "0,1,2": {
                width: "100%",
                height: "3px",
                top: "16%",
                left: 0,
            },
            "3,4,5": {
                width: "100%",
                height: "3px",
                top: "50%",
                left: 0,
            },
            "6,7,8": {
                width: "100%",
                height: "3px",
                top: "83%",
                left: 0,
            },
            "0,3,6": {
                width: "3px",
                height: "100%",
                left: "16%",
                top: 0,
            },
            "1,4,7": {
                width: "3px",
                height: "100%",
                left: "50%",
                top: 0,
            },
            "2,5,8": {
                width: "3px",
                height: "100%",
                left: "83%",
                top: 0,
            },
            "0,4,8": {
                width: "140%",
                height: "3px",
                top: "50%",
                left: "-20%",
                transform: "rotate(45deg)",
            },
            "2,4,6": {
                width: "140%",
                height: "3px",
                top: "50%",
                left: "-20%",
                transform: "rotate(-45deg)",
            },
        };

        return styles[cells.join(",")];
    };

    console.log(winner);

    const winningLineStyle =
        winningCells.length > 0
            ? getWinningLineStyle(winningCells)
            : null;

    return (
        <div className="flex flex-col items-center gap-4 sm:gap-6 w-full px-4">

            {/* GAME STATUS */}
            <p className="text-base sm:text-xl text-white text-center">
                {winner
                    ? `🎉 Winner: ${winner === 'O' ? playerNames[2] : playerNames[1]} 🎉`
                    : isDraw
                        ? "It's a Draw!"
                        : currentPlayer
                            ? currentPlayer === playerNumber
                                ? "Your turn!"
                                : "Opponent's turn..."
                            : "Waiting..."
                }
            </p>

            {/* BOARD */}
            <div className="relative max-w-full">
                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                    {(board || []).map((value, index) => (
                        <Cell
                            key={index}
                            value={value}
                            isWinning={winningCells.includes(index)}
                            onClick={() => onCellClick(index)}
                        />
                    ))}
                </div>

                {/* WINNING LINE */}
                {winningLineStyle && (
                    <div
                        className="
                            absolute
                            bg-white
                            rounded-full
                            z-20
                            pointer-events-none
                        "
                        style={winningLineStyle}
                    />
                )}
            </div>

            {/* PLAYER INFORMATION */}
            <p className="text-sm sm:text-lg text-gray-400 text-center">
                You are - {" "}
                <span className={`font-semibold ${playerNumber === 1 ? "text-pink-400" : "text-blue-400"}`}>
                    {playerNumber === 1 ? "X" : "O"}
                </span>
            </p>

            {/* SCORE */}
            <div className="text-base sm:text-lg text-white text-center">
                <span>
                    {playerNames[1] || "Player 1"}: {scores[1] || 0}
                </span>

                {" | "}

                <span>
                    {playerNames[2] || "Player 2"}: {scores[2] || 0}
                </span>
            </div>

            {/* PLAY AGAIN */}
            {(winner || isDraw) && (
                <PlayAgainButton
                    onClick={onPlayAgain}
                    waitingForResponse={waitingForResponse}
                />
            )}
        </div>
    );
};

export default Grid;