const createGuessTheNumberGame = () => {

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

        startingPlayer: 1,

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

        // ==========================================
        // ERROR / RESULT MESSAGE
        // ==========================================

        lastResult: null

    };

};


export default createGuessTheNumberGame;