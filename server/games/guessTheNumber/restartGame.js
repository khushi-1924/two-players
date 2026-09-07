const restartGuessTheNumber = (previousGame) => {

    const previousStarter =
        previousGame.startingPlayer || 1;


    const nextStarter =
        previousStarter === 1
            ? 2
            : 1;


    return {

        name: "guessTheNumber",

        // ==========================================
        // GAME SETUP
        // ==========================================

        digitLength: null,

        digitLengthChosenBy: null,

        // ==========================================
        // SECRET NUMBERS
        // ==========================================

        secretNumbers: {
            1: null,
            2: null
        },

        numbersSubmitted: {
            1: false,
            2: false
        },

        // ==========================================
        // GAME STATUS
        // ==========================================

        status: "choosingDigits",

        // ==========================================
        // TURN
        // ==========================================

        currentPlayer: null,

        startingPlayer: nextStarter,

        // ==========================================
        // GUESSES
        // ==========================================

        guesses: {
            1: [],
            2: []
        },

        // ==========================================
        // RESULT
        // ==========================================

        winner: null,

        lastResult: null

    };

};


export default restartGuessTheNumber;