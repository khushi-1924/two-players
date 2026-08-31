const restartConnectFour = (previousGame) => {

    const previousStarter =
        previousGame.startingPlayer || 1;

    const nextStarter =
        previousStarter === 1
            ? 2
            : 1;

    return {

        name: "connectFour",

        board: Array.from(
            { length: 6 },
            () => Array(7).fill(null)
        ),

        currentPlayer:
            nextStarter,

        startingPlayer:
            nextStarter,

        status: "playing",

        winner: null,

        winningCells: [],

        draw: false,

        round:
            (previousGame.round || 1) + 1

    };

};

export default restartConnectFour;