import createPoisonHeartsGame
    from "./createGame.js";


const restartPoisonHearts = (
    previousGame
) => {

    const newGame =
        createPoisonHeartsGame();


    newGame.round =
        (previousGame.round || 1) + 1;


    return newGame;

};


export default restartPoisonHearts;