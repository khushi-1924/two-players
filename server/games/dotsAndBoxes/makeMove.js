const makeDotsAndBoxesMove = (gameState, move) => {

    const {
        type,
        row,
        col,
        player
    } = move;


    // ------------------------------------------
    // VALIDATE PLAYER TURN
    // ------------------------------------------

    if (gameState.currentPlayer !== player) {
        return {
            success: false,
            message: "Not your turn"
        };
    }


    // ------------------------------------------
    // VALIDATE MOVE TYPE
    // ------------------------------------------

    if (
        type !== "horizontal" &&
        type !== "vertical"
    ) {
        return {
            success: false,
            message: "Invalid move type"
        };
    }


    // ------------------------------------------
    // CREATE EDGE ID
    // ------------------------------------------

    const edgeId = `${row}-${col}`;


    // ------------------------------------------
    // CHECK IF EDGE ALREADY EXISTS
    // ------------------------------------------

    const existingLines =
        type === "horizontal"
            ? gameState.horizontalLines
            : gameState.verticalLines;


    const alreadySelected =
        existingLines.some(
            (line) => line.id === edgeId
        );


    if (alreadySelected) {
        return {
            success: false,
            message: "Line already selected"
        };
    }


    // ------------------------------------------
    // ADD THE LINE
    // ------------------------------------------

    const newLine = {
        id: edgeId,
        row,
        col,
        player
    };


    if (type === "horizontal") {

        gameState.horizontalLines.push(
            newLine
        );

    } else {

        gameState.verticalLines.push(
            newLine
        );

    }


    // ------------------------------------------
    // CHECK COMPLETED BOXES
    // ------------------------------------------

    const completedBoxes =
        findCompletedBoxes(
            gameState,
            type,
            row,
            col
        );


    // ------------------------------------------
    // ADD COMPLETED BOXES
    // ------------------------------------------

    completedBoxes.forEach((box) => {

        gameState.boxes.push({
            id: box.id,
            row: box.row,
            col: box.col,
            player
        });

    });


    // ------------------------------------------
    // UPDATE TURN
    // ------------------------------------------

    // Completing a box gives the same
    // player another turn.

    if (completedBoxes.length === 0) {

        gameState.currentPlayer =
            player === 1 ? 2 : 1;

    }


    // ------------------------------------------
    // CHECK GAME OVER
    // ------------------------------------------

    const totalBoxes =
        (gameState.gridSize - 1) *
        (gameState.gridSize - 1);


    if (
        gameState.boxes.length === totalBoxes
    ) {

        gameState.status = "finished";


        const player1Score =
            gameState.boxes.filter(
                (box) => box.player === 1
            ).length;


        const player2Score =
            gameState.boxes.filter(
                (box) => box.player === 2
            ).length;


        if (player1Score > player2Score) {

            gameState.winner = 1;

        } else if (player2Score > player1Score) {

            gameState.winner = 2;

        } else {

            gameState.winner = null;

        }

    }


    return {
        success: true,
        completedBoxes
    };

};


// ==================================================
// FIND COMPLETED BOXES
// ==================================================

const findCompletedBoxes = (
    gameState,
    type,
    row,
    col
) => {

    const completedBoxes = [];


    // ------------------------------------------
    // HORIZONTAL LINE
    // ------------------------------------------

    if (type === "horizontal") {

        // Box below the horizontal line

        if (row < gameState.gridSize - 1) {

            if (
                hasHorizontalLine(
                    gameState,
                    row,
                    col
                ) &&
                hasHorizontalLine(
                    gameState,
                    row + 1,
                    col
                ) &&
                hasVerticalLine(
                    gameState,
                    row,
                    col
                ) &&
                hasVerticalLine(
                    gameState,
                    row,
                    col + 1
                )
            ) {

                completedBoxes.push({
                    id: `${row}-${col}`,
                    row,
                    col
                });

            }

        }


        // Box above the horizontal line

        if (row > 0) {

            if (
                hasHorizontalLine(
                    gameState,
                    row,
                    col
                ) &&
                hasHorizontalLine(
                    gameState,
                    row - 1,
                    col
                ) &&
                hasVerticalLine(
                    gameState,
                    row - 1,
                    col
                ) &&
                hasVerticalLine(
                    gameState,
                    row - 1,
                    col + 1
                )
            ) {

                completedBoxes.push({
                    id: `${row - 1}-${col}`,
                    row: row - 1,
                    col
                });

            }

        }

    }


    // ------------------------------------------
    // VERTICAL LINE
    // ------------------------------------------

    if (type === "vertical") {

        // Box to the right

        if (col < gameState.gridSize - 1) {

            if (
                hasVerticalLine(
                    gameState,
                    row,
                    col
                ) &&
                hasVerticalLine(
                    gameState,
                    row,
                    col + 1
                ) &&
                hasHorizontalLine(
                    gameState,
                    row,
                    col
                ) &&
                hasHorizontalLine(
                    gameState,
                    row + 1,
                    col
                )
            ) {

                completedBoxes.push({
                    id: `${row}-${col}`,
                    row,
                    col
                });

            }

        }


        // Box to the left

        if (col > 0) {

            if (
                hasVerticalLine(
                    gameState,
                    row,
                    col
                ) &&
                hasVerticalLine(
                    gameState,
                    row,
                    col - 1
                ) &&
                hasHorizontalLine(
                    gameState,
                    row,
                    col - 1
                ) &&
                hasHorizontalLine(
                    gameState,
                    row + 1,
                    col - 1
                )
            ) {

                completedBoxes.push({
                    id: `${row}-${col - 1}`,
                    row,
                    col: col - 1
                });

            }

        }

    }


    return completedBoxes;

};


// ==================================================
// HELPERS
// ==================================================

const hasHorizontalLine = (
    gameState,
    row,
    col
) => {

    return gameState.horizontalLines.some(
        (line) =>
            line.row === row &&
            line.col === col
    );

};


const hasVerticalLine = (
    gameState,
    row,
    col
) => {

    return gameState.verticalLines.some(
        (line) =>
            line.row === row &&
            line.col === col
    );

};


export default makeDotsAndBoxesMove;