const createConnectFourGame = () => {

    return {

        name: "connectFour",

        // 6 rows × 7 columns
        board: Array(6)
            .fill(null)
            .map(() =>
                Array(7).fill(null)
            ),

        currentPlayer: 1,

        status: "playing",

        winner: null,

        winningCells: [],

        draw: false

    };

};


export default createConnectFourGame;