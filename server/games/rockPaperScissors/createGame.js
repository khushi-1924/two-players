const createRPSGame = () => {

    return {

        name: "rps",

        choices: {
            1: null,
            2: null
        },

        status: "playing",

        winner: null,

        round: 1

    };

};


export default createRPSGame;