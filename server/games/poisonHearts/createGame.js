const createPoisonHeartsGame = () => {

    // ==========================================
    // CREATE 6 x 6 BOARD
    // ==========================================

    const board = [];

    for (let row = 0; row < 6; row++) {

        const currentRow = [];

        for (let column = 0; column < 6; column++) {

            currentRow.push({
                id: row * 6 + column,
                color: null,
                selected: false
            });

        }

        board.push(currentRow);
    }


    // ==========================================
    // AVAILABLE HEART COLORS
    // ==========================================

    const colors = [
        "gray",
        "cyan",
        "purple",
        "green",
        "pink",
        "blue",
        "orange",
        "yellow"
    ];


    // ==========================================
    // ASSIGN COLORS
    // ==========================================

    const shuffledColors = [];

    for (let i = 0; i < 36; i++) {

        shuffledColors.push(
            colors[i % colors.length]
        );

    }


    // Shuffle colors

    for (
        let i = shuffledColors.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            shuffledColors[i],
            shuffledColors[j]
        ] = [
            shuffledColors[j],
            shuffledColors[i]
        ];

    }


    // ==========================================
    // PUT COLORS ON BOARD
    // ==========================================

    for (let row = 0; row < 6; row++) {

        for (let column = 0; column < 6; column++) {

            const index =
                row * 6 + column;

            board[row][column].color =
                shuffledColors[index];

        }

    }


    // ==========================================
    // GAME STATE
    // ==========================================

    return {

        name: "poisonHearts",

        board,

        phase: "poisonSelection",

        poisonChoices: {
            1: null,
            2: null
        },

        currentPlayer: null,

        winner: null,

        loser: null,

        status: "playing",

        round: 1

    };

};


export default createPoisonHeartsGame;