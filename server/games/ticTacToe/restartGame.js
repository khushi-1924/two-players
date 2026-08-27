const restartTicTacToe = (previousGame) => {

    const previousStarter =
        previousGame.startingPlayer || 1;


    const nextStarter =
        previousStarter === 1
            ? 2
            : 1;


    return {

        name: "ticTacToe",

        board: Array(9).fill(null),

        currentPlayer: nextStarter,

        startingPlayer: nextStarter,

        status: "playing",

        winner: null,

        winningCells: [],

        draw: false

    };

};


export default restartTicTacToe;