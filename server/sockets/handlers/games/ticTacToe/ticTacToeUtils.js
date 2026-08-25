const winningPatterns = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];


export const checkWinner = (board) => {

    for (
        const pattern of winningPatterns
    ) {

        const [a, b, c] = pattern;

        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return {

                winner: board[a],

                cells: pattern

            };

        }

    }

    return null;

};


export const checkDraw = (board) => {

    return board.every(
        cell => cell !== null
    );

};