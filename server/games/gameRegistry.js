import createTicTacToeGame from "./ticTacToe/createGame.js";
import restartTicTacToe from "./ticTacToe/restartGame.js";

import createRPSGame from "./rockPaperScissors/createGame.js";
import restartRPSGame from "./rockPaperScissors/restartGame.js";

import createConnectFourGame from "./connectFour/createGame.js";
import restartConnectFourGame from "./connectFour/restartGame.js";


const gameRegistry = {

    ticTacToe: {
        createGame: createTicTacToeGame,
        restartGame: restartTicTacToe
    },

    rps: {
        createGame: createRPSGame,
        restartGame: restartRPSGame
    },

    connectFour: {
        createGame: createConnectFourGame,
        restartGame: restartConnectFourGame
    }

};


export default gameRegistry;