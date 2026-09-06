const getPublicGameState = (
    game,
    playerNumber
) => {

    if (!game) {
        return null;
    }


    // ==========================================
    // GUESS THE NUMBER
    // ==========================================

    if (game.name === "guessTheNumber") {

        const {
            secretNumbers,
            ...publicGame
        } = game;


        return {

            ...publicGame,

            mySecretNumber:
                secretNumbers?.[playerNumber] ?? null,

            opponentSubmitted:
                secretNumbers
                    ? Boolean(
                        secretNumbers[
                            playerNumber === 1
                                ? 2
                                : 1
                        ]
                    )
                    : false

        };

    }


    // ==========================================
    // POISON HEARTS
    // ==========================================

    if (game.name === "poisonHearts") {

        const {
            poisonChoices,
            ...publicGame
        } = game;


        return {

            ...publicGame,

            myPoisonChoice:
                poisonChoices?.[playerNumber] ?? null

        };

    }


    // ==========================================
    // ALL OTHER GAMES
    // ==========================================

    return game;

};


export default getPublicGameState;