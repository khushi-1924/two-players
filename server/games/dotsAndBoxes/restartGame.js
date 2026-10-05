const restartDotsAndBoxesGame = (gameState) => {
    gameState.horizontalLines = [];
    gameState.verticalLines = [];
    gameState.boxes = [];

    // Switch starting player
    gameState.startingPlayer =
        gameState.startingPlayer === 1 ? 2 : 1;

    gameState.currentPlayer =
        gameState.startingPlayer;

    gameState.status = "playing";
    gameState.winner = null;

    return gameState;
};

export default restartDotsAndBoxesGame;