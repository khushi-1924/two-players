const getPublicGameState = (
    game,
    playerNumber
) => {

    if (!game) {
        return null;
    }


    // ==========================================
    // ALL NON-POISON-HEARTS GAMES
    // ==========================================

    if (game.name !== "poisonHearts") {

        return game;

    }


    // ==========================================
    // POISON HEARTS
    // ==========================================
    // Never send both poison choices.
    // A player may only receive their own choice.

    const {
        poisonChoices,
        ...publicGame
    } = game;


    return {

        ...publicGame,

        myPoisonChoice:
            poisonChoices?.[playerNumber] ?? null

    };

};


export default getPublicGameState;