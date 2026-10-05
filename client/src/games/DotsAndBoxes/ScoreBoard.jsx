import React from "react";

const ScoreBoard = ({
    currentPlayer,
    player1Score,
    player2Score
}) => {

    return (
        <div className="dots-boxes-scoreboard">

            {/* ==================================
                PLAYER 1
               ================================== */}

            <div
                className={
                    `score-player ${
                        currentPlayer === 1
                            ? "active-player"
                            : ""
                    }`
                }
            >

                <div className="score-player-name">
                    Player 1
                </div>

                <div className="score-player-score">
                    {player1Score}
                </div>

            </div>


            {/* ==================================
                PLAYER 2
               ================================== */}

            <div
                className={
                    `score-player ${
                        currentPlayer === 2
                            ? "active-player"
                            : ""
                    }`
                }
            >

                <div className="score-player-name">
                    Player 2
                </div>

                <div className="score-player-score">
                    {player2Score}
                </div>

            </div>

        </div>
    );
};

export default ScoreBoard;