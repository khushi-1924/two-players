import createTicTacToeGame from "./ticTacToe/createGame.js";
import restartTicTacToe from "./ticTacToe/restartGame.js";

import createRPSGame from "./rockPaperScissors/createGame.js";
import restartRPSGame from "./rockPaperScissors/restartGame.js";


const gameRegistry = {

    ticTacToe: {
        createGame: createTicTacToeGame,
        restartGame: restartTicTacToe
    },

    rps: {
        createGame: createRPSGame,
        restartGame: restartRPSGame
    }

};


export default gameRegistry;