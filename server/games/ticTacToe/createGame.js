const createTicTacToeGame = () => {

    return {

        name: "ticTacToe",

        board: Array(9).fill(null),

        currentPlayer: 1,

        startingPlayer: 1,

        status: "playing",

        winner: null,

        winningCells: [],

        draw: false

    };

};


export default createTicTacToeGame;