import React, { useState } from "react";
import { TiHeart } from "react-icons/ti";
import "./DotsAndBoxes.css";

const GRID_SIZE = 7;

const Grid = () => {

    // ==========================================
    // SELECTED EDGES
    // ==========================================

    const [horizontalLines, setHorizontalLines] =
        useState([]);

    const [verticalLines, setVerticalLines] =
        useState([]);

    // ==========================================
    // COMPLETED BOXES
    // ==========================================

    const [boxes, setBoxes] =
        useState([]);


    // ==========================================
    // CURRENT PLAYER
    // ==========================================

    const [currentPlayer, setCurrentPlayer] =
        useState(1);

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

        const edgeId =
            `${row}-${col}`;


        // Don't allow duplicate edge

        if (
            horizontalLines.some(
                (edge) =>
                    edge.id === edgeId
            )
        ) {
            return;
        }


        // Create new edge

        const newEdge = {
            id: edgeId,
            player: currentPlayer
        };


        const updatedHorizontalLines = [
            ...horizontalLines,
            newEdge
        ];


        setHorizontalLines(
            updatedHorizontalLines
        );


        // Check boxes affected by this edge

        const completedBoxes = [];


        // This horizontal edge can affect:
        //
        // box above
        // box below


        // Box BELOW

        if (
            row < GRID_SIZE - 1
        ) {

            const boxRow = row;
            const boxCol = col;


            const top =
                updatedHorizontalLines.some(
                    (edge) =>
                        edge.id ===
                        `${boxRow}-${boxCol}`
                );


            const bottom =
                updatedHorizontalLines.some(
                    (edge) =>
                        edge.id ===
                        `${boxRow + 1}-${boxCol}`
                );


            const left =
                hasVerticalLine(
                    boxRow,
                    boxCol
                );


            const right =
                hasVerticalLine(
                    boxRow,
                    boxCol + 1
                );


            if (
                top &&
                bottom &&
                left &&
                right
            ) {

                completedBoxes.push({
                    id: `${boxRow}-${boxCol}`,
                    row: boxRow,
                    col: boxCol,
                    player: currentPlayer
                });

            }

        }


        // Box ABOVE

        if (
            row > 0
        ) {

            const boxRow = row - 1;
            const boxCol = col;

            const top =
                updatedHorizontalLines.some(
                    (edge) =>
                        edge.id ===
                        `${boxRow}-${boxCol}`
                );

            const bottom =
                updatedHorizontalLines.some(
                    (edge) =>
                        edge.id ===
                        `${boxRow + 1}-${boxCol}`
                );

            const left =
                hasVerticalLine(
                    boxRow,
                    boxCol
                );


            const right =
                hasVerticalLine(
                    boxRow,
                    boxCol + 1
                );


            if (
                top &&
                bottom &&
                left &&
                right
            ) {

                completedBoxes.push({
                    id: `${boxRow}-${boxCol}`,
                    row: boxRow,
                    col: boxCol,
                    player: currentPlayer
                });

            }

        }


        // Add completed boxes

        if (completedBoxes.length > 0) {

            setBoxes((prev) => [
                ...prev,
                ...completedBoxes
            ]);

            // IMPORTANT:
            // Player gets another turn
            return;
        }


        // No box completed
        // Switch player

        setCurrentPlayer(
            currentPlayer === 1
                ? 2
                : 1
        );
    };


    // ==========================================
    // VERTICAL EDGE CLICK
    // ==========================================

    const handleVerticalClick = (
        row,
        col
    ) => {

        const edgeId =
            `${row}-${col}`;


        // Don't allow duplicate edge

        if (
            verticalLines.some(
                (edge) =>
                    edge.id === edgeId
            )
        ) {
            return;
        }


        // Create new edge

        const newEdge = {
            id: edgeId,
            player: currentPlayer
        };


        const updatedVerticalLines = [
            ...verticalLines,
            newEdge
        ];


        setVerticalLines(
            updatedVerticalLines
        );


        // Check boxes affected by this edge

        const completedBoxes = [];


        // A vertical edge can affect:
        //
        // box on the LEFT
        // box on the RIGHT


        // Box on RIGHT

        if (
            col < GRID_SIZE - 1
        ) {

            const boxRow = row;
            const boxCol = col;


            const top =
                hasHorizontalLine(
                    boxRow,
                    boxCol
                );


            const bottom =
                hasHorizontalLine(
                    boxRow + 1,
                    boxCol
                );


            const left =
                updatedVerticalLines.some(
                    (edge) =>
                        edge.id ===
                        `${boxRow}-${boxCol}`
                );


            const right =
                updatedVerticalLines.some(
                    (edge) =>
                        edge.id ===
                        `${boxRow}-${boxCol + 1}`
                );


            if (
                top &&
                bottom &&
                left &&
                right
            ) {

                completedBoxes.push({
                    id: `${boxRow}-${boxCol}`,
                    row: boxRow,
                    col: boxCol,
                    player: currentPlayer
                });

            }

        }


        // Box on LEFT

        if (
            col > 0
        ) {

            const boxRow = row;
            const boxCol = col - 1;


            const top =
                hasHorizontalLine(
                    boxRow,
                    boxCol
                );


            const bottom =
                hasHorizontalLine(
                    boxRow + 1,
                    boxCol
                );


            const left =
                hasVerticalLine(
                    boxRow,
                    boxCol
                );


            const right =
                updatedVerticalLines.some(
                    (edge) =>
                        edge.id ===
                        `${boxRow}-${boxCol + 1}`
                );


            if (
                top &&
                bottom &&
                left &&
                right
            ) {

                completedBoxes.push({
                    id: `${boxRow}-${boxCol}`,
                    row: boxRow,
                    col: boxCol,
                    player: currentPlayer
                });

            }

        }


        // Add completed boxes

        if (
            completedBoxes.length > 0
        ) {

            setBoxes((prev) => [
                ...prev,
                ...completedBoxes
            ]);

            // Same player gets another turn

            return;
        }


        // No box completed
        // Switch player

        setCurrentPlayer(
            currentPlayer === 1
                ? 2
                : 1
        );
    };


    return (

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
            <div style={{ color: "white" }}>
                <p>Current Player: {currentPlayer}</p>
                <p>Boxes: {boxes.length}</p>
            </div>

        </div>
    );
};

export default Grid;