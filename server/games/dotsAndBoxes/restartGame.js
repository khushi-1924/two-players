const restartDotsAndBoxesGame = (gameState) => {

    gameState.horizontalLines = [];

    gameState.verticalLines = [];

    gameState.boxes = [];

    gameState.currentPlayer = 1;

    gameState.startingPlayer = 1;

    gameState.status = "playing";

    gameState.winner = null;


    return gameState;

};


export default restartDotsAndBoxesGame;