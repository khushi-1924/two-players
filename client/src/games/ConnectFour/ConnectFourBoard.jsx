import React, { useEffect, useRef, useState } from "react";

const ConnectFourBoard = ({
    board,
    currentPlayer,
    playerNumber,
    playerNames = {
        1: "Player 1",
        2: "Player 2",
    },
    winner,
    winningCells,
    isDraw,
    scores,
    onColumnClick,
    onPlayAgain,
    waitingForResponse,
}) => {
    const previousBoard = useRef(board);
    const [animatedCell, setAnimatedCell] = useState(null);

    // Detect the newly placed coin
    useEffect(() => {
        const oldBoard = previousBoard.current;

        if (!oldBoard || !board) {
            previousBoard.current = board;
            return;
        }

        for (let row = 0; row < board.length; row++) {
            for (let column = 0; column < board[row].length; column++) {
                if (
                    oldBoard[row]?.[column] === null &&
                    board[row]?.[column] !== null
                ) {
                    setAnimatedCell({
                        row,
                        column,
                    });

                    previousBoard.current = board;
                    return;
                }
            }
        }

        previousBoard.current = board;
    }, [board]);

    // Remove animation marker after animation finishes
    useEffect(() => {
        if (!animatedCell) {
            return;
        }

        const timer = setTimeout(() => {
            setAnimatedCell(null);
        }, 500);

        return () => clearTimeout(timer);
    }, [animatedCell]);

    return (
        <div className="flex flex-col items-center gap-4 sm:gap-6 w-full px-4">

            {/* GAME STATUS */}
            <p className="text-base sm:text-xl text-white text-center">
                {winner
                    ? `Player ${winner} wins!`
                    : isDraw
                        ? "It's a draw!"
                        : currentPlayer
                            ? currentPlayer === playerNumber
                                ? "Your turn!"
                                : "Opponent's turn..."
                            : "Waiting..."
                }
            </p>

            {/* BOARD */}
            <div
                className="
                    bg-[#0a0f3d]
                    p-2 sm:p-4
                    rounded-xl
                    border-2
                    border-blue-500
                    shadow-[0_0_20px_rgba(59,130,246,0.25)]
                    max-w-full
                    overflow-hidden
                "
            >
                {board.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="flex"
                    >
                        {row.map((cell, columnIndex) => {

                            const isAnimated =
                                animatedCell?.row === rowIndex &&
                                animatedCell?.column === columnIndex;

                            const isWinningCell = winningCells.some(
                                ([winningRow, winningCol]) =>
                                    winningRow === rowIndex &&
                                    winningCol === columnIndex
                            );

                            return (
                                <button
                                    key={columnIndex}
                                    onClick={() => onColumnClick(columnIndex)}
                                    disabled={
                                        !!winner ||
                                        isDraw ||
                                        currentPlayer !== playerNumber ||
                                        waitingForResponse
                                    }
                                    className={`
                                        w-[clamp(32px,9vw,64px)]
                                        h-[clamp(32px,9vw,64px)]
                                        rounded-full
                                        m-0.5 sm:m-1
                                        border
                                        flex
                                        items-center
                                        justify-center
                                        transition-all
                                        duration-200

                                        ${cell === 1
                                            ? `
                                                    bg-sky-300
                                                    border-sky-200
                                                `
                                            : cell === 2
                                                ? `
                                                        bg-pink-300
                                                        border-pink-200
                                                    `
                                                : `
                                                        bg-[#050820]
                                                        border-blue-500/40
                                                        shadow-[inset_0_0_8px_rgba(59,130,246,0.15)]
                                                    `
                                        }

                                        ${isWinningCell
                                            ? cell === 1
                                                ? `
                                                        bg-sky-700
                                                        border-1
                                                        border-blue-600
                                                        shadow-[0_0_10px_0_rgba(96,165,250,0.8)]
                                                    `
                                                : `
                                                        bg-pink-500
                                                        border-1
                                                        border-pink-400
                                                        shadow-[0_0_10px_0_rgba(244,114,182,0.8)]
                                                    `
                                            : ""
                                        }

                                        ${isAnimated
                                            ? "animate-[drop_500ms_ease-out]"
                                            : ""
                                        }

                                        ${!cell &&
                                            currentPlayer === playerNumber &&
                                            !winner &&
                                            !isDraw
                                            ? `
                                                    hover:scale-105
                                                    hover:border-blue-400
                                                    hover:shadow-[0_0_12px_rgba(59,130,246,0.45)]
                                                `
                                            : ""
                                        }
                                    `}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* PLAYER COLORS */}
            <div className="flex gap-6 sm:gap-8 text-base sm:text-lg">
                <p className="text-sky-300">
                    {playerNames[1] || "Player 1"}
                </p>

                <p className="text-pink-300">
                    {playerNames[2] || "Player 2"}
                </p>
            </div>

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
                <button
                    onClick={onPlayAgain}
                    disabled={waitingForResponse}
                    className="
                        px-6
                        py-3
                        rounded-lg
                        bg-blue-500
                        text-white
                        font-semibold
                        hover:bg-blue-600
                        transition
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "
                >
                    {waitingForResponse
                        ? "Waiting for opponent..."
                        : "Play Again"
                    }
                </button>
            )}
        </div>
    );
};

export default ConnectFourBoard;