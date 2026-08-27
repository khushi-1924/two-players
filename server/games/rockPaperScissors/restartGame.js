const restartRPSGame = (previousGame) => {

    return {

        name: "rps",

        choices: {
            1: null,
            2: null
        },

        status: "playing",

        winner: null,

        round:
            previousGame.round + 1

    };

};


export default restartRPSGame;