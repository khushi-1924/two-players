import React from "react";

const ConnectFourBoard = ({
    board,
    currentPlayer,
    playerNumber,
    winner,
    winningCells,
    isDraw,
    scores,
    onColumnClick,
    onPlayAgain,
    waitingForResponse
}) => {

    const isWinningCell = (
        row,
        column
    ) => {

        return winningCells.some(
            ([r, c]) =>
                r === row &&
                c === column
        );

    };


    return (

        <div className="flex flex-col items-center gap-6">


            {/* =====================================
                GAME STATUS
            ===================================== */}

            <p className="text-xl text-white">

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


            {/* =====================================
                BOARD
            ===================================== */}

            <div
                className="
                    bg-[#0a0f3d]
                    p-4
                    rounded-xl
                    border-2
                    border-blue-500
                    shadow-[0_0_20px_rgba(59,130,246,0.25)]
                "
            >

                {board.map(
                    (row, rowIndex) => (

                        <div
                            key={rowIndex}
                            className="flex"
                        >

                            {row.map(
                                (cell, columnIndex) => (

                                    <button
                                        key={columnIndex}
                                        onClick={() =>
                                            onColumnClick(
                                                columnIndex
                                            )
                                        }
                                        disabled={
                                            !!winner ||
                                            isDraw ||
                                            currentPlayer !==
                                            playerNumber ||
                                            waitingForResponse
                                        }
                                        className={`
                                            w-14
                                            h-14
                                            md:w-16
                                            md:h-16
                                            rounded-full
                                            m-1
                                            border
                                            border-blue-500/40
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

                                            ${isWinningCell(
                                                rowIndex,
                                                columnIndex
                                            )
                                                ? `
                                                        ring-2
                                                        ring-purple-500
                                                        scale-105
                                                    `
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

                                )
                            )}

                        </div>

                    )
                )}

            </div>


            {/* =====================================
                PLAYER COLORS
            ===================================== */}

            <div className="flex gap-8 text-lg">

                <p className="text-sky-300">

                    Player 1

                </p>

                <p className="text-pink-300">

                    Player 2

                </p>

            </div>


            {/* =====================================
                SCORE
            ===================================== */}

            <p className="text-lg text-white">

                You: {
                    scores[playerNumber] || 0
                }

                {" | "}

                Opponent: {
                    scores[
                    playerNumber === 1
                        ? 2
                        : 1
                    ] || 0
                }

            </p>

            {/* =====================================
    PLAY AGAIN
===================================== */}

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