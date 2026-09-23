const createDotsAndBoxesGame = () => {

    return {

        name: "dotsAndBoxes",

        gridSize: 7,

        horizontalLines: [],

        verticalLines: [],

        boxes: [],

        currentPlayer: 1,

        startingPlayer: 1,

        status: "playing",

        winner: null

    };

};


export default createDotsAndBoxesGame;