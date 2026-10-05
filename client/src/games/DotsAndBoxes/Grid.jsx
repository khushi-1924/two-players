/* eslint-disable no-unused-vars */
import React from "react";
import { TiHeart } from "react-icons/ti";
import socket from "../../socket/socket";
import "./DotsAndBoxes.css";

const GRID_SIZE = 7;

const Grid = ({
    currentPlayer,
    setCurrentPlayer,

    horizontalLines,
    setHorizontalLines,

    verticalLines,
    setVerticalLines,

    boxes,
    setBoxes,

    setPlayer1Score,
    setPlayer2Score
}) => {

    const roomId =
        sessionStorage.getItem("roomId");


    // ==========================================
    // CHECK HORIZONTAL EDGE
    // ==========================================

    const hasHorizontalLine = (row, col) => {

        return horizontalLines.some(
            (edge) =>
                edge.id === `${row}-${col}`
        );
    };


    // ==========================================
    // CHECK VERTICAL EDGE
    // ==========================================

    const hasVerticalLine = (row, col) => {

        return verticalLines.some(
            (edge) =>
                edge.id === `${row}-${col}`
        );
    };

    // ==========================================
    // CHECK COMPLETED BOX
    // ==========================================

    const checkCompletedBox = (
        row,
        col,
        player
    ) => {

        // A box has:
        //
        //       top
        //   ●────────●
        //   │        │
        // left      right
        //   │        │
        //   ●────────●
        //      bottom


        const top =
            hasHorizontalLine(
                row,
                col
            );


        const bottom =
            hasHorizontalLine(
                row + 1,
                col
            );


        const left =
            hasVerticalLine(
                row,
                col
            );


        const right =
            hasVerticalLine(
                row,
                col + 1
            );


        return (
            top &&
            bottom &&
            left &&
            right
        );
    };


    // ==========================================
    // HORIZONTAL EDGE CLICK
    // ==========================================

    const handleHorizontalClick = (
        row,
        col
    ) => {

        socket.emit(
            "makeMove",
            {
                roomId,
                type: "horizontal",
                row,
                col
            }
        );

    };


    // ==========================================
    // VERTICAL EDGE CLICK
    // ==========================================

    const handleVerticalClick = (
        row,
        col
    ) => {

        socket.emit(
            "makeMove",
            {
                roomId,
                type: "vertical",
                row,
                col
            }
        );

    };


    return (

        <div className="dots-boxes-game">

            <div className="dots-boxes-grid w-full mx-auto" style={{
                "--grid-size": GRID_SIZE
            }}>

                {Array.from({
                    length: GRID_SIZE
                }).map((_, row) => (

                    <React.Fragment key={row}>

                        {/* ==================================
                        DOT + HORIZONTAL EDGE ROW
                       ================================== */}

                        <div className="dots-boxes-row">

                            {Array.from({
                                length: GRID_SIZE
                            }).map((_, col) => (

                                <React.Fragment key={col}>

                                    {/* DOT */}

                                    <div className="dot" />


                                    {/* HORIZONTAL EDGE */}

                                    {col <
                                        GRID_SIZE - 1 && (() => {

                                            const edgeId =
                                                `${row}-${col}`;

                                            const edge =
                                                horizontalLines.find(
                                                    (item) =>
                                                        item.id === edgeId
                                                );


                                            return (

                                                <button
                                                    className={
                                                        `horizontal-edge ${edge
                                                            ? `player-${edge.player}`
                                                            : ""
                                                        }`
                                                    }
                                                    onClick={() =>
                                                        handleHorizontalClick(
                                                            row,
                                                            col
                                                        )
                                                    }
                                                    aria-label={
                                                        `Horizontal edge ${row}-${col}`
                                                    }
                                                />

                                            );

                                        })()}

                                </React.Fragment>

                            ))}

                        </div>


                        {/* ==================================
                        VERTICAL EDGE ROW
                       ================================== */}

                        {row <
                            GRID_SIZE - 1 && (

                                <div className="dots-boxes-row">

                                    {Array.from({
                                        length: GRID_SIZE
                                    }).map((_, col) => (

                                        <React.Fragment key={col}>

                                            {/* VERTICAL EDGE */}

                                            {(() => {

                                                const edgeId =
                                                    `${row}-${col}`;

                                                const edge =
                                                    verticalLines.find(
                                                        (item) =>
                                                            item.id === edgeId
                                                    );


                                                return (

                                                    <button
                                                        className={
                                                            `vertical-edge ${edge
                                                                ? `player-${edge.player}`
                                                                : ""
                                                            }`
                                                        }
                                                        onClick={() =>
                                                            handleVerticalClick(
                                                                row,
                                                                col
                                                            )
                                                        }
                                                        aria-label={
                                                            `Vertical edge ${row}-${col}`
                                                        }
                                                    />

                                                );

                                            })()}


                                            {/* SPACE / BOX */}

                                            {col <
                                                GRID_SIZE - 1 && (

                                                    <div
                                                        className={
                                                            `box ${boxes.find(
                                                                (item) =>
                                                                    item.row === row &&
                                                                    item.col === col
                                                            )
                                                                ? `player-${boxes.find(
                                                                    (item) =>
                                                                        item.row === row &&
                                                                        item.col === col
                                                                ).player
                                                                }`
                                                                : ""
                                                            }`
                                                        }
                                                    >

                                                        {
                                                            boxes.find(
                                                                (item) =>
                                                                    item.row === row &&
                                                                    item.col === col
                                                            ) && (

                                                                <span className="box-heart">
                                                                    <TiHeart />
                                                                </span>

                                                            )
                                                        }

                                                    </div>

                                                )}

                                        </React.Fragment>

                                    ))}

                                </div>

                            )}

                    </React.Fragment>

                ))}

            </div>

        </div>
    );
};

export default Grid;