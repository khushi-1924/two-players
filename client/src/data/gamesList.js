export const gamesList = [
  // TIC TAC TOE
  {
    id: 1,
    gameId: "ticTacToe",
    name: "Tic Tac Toe",
    path: "/game/tic-tac-toe",
    description: "Classic 2-player strategy game.",
    image: "/images/tic-tac-toe.png",

    instructions: [
      {
        title: "Take turns",
        description:
          "Two players take turns placing their symbol on the 3×3 board. Player 1 uses X and Player 2 uses O."
      },
      {
        title: "Make your move",
        description:
          "On your turn, click any empty square to place your symbol."
      },
      {
        title: "Get three in a row",
        description:
          "Try to place three of your symbols in a horizontal row, vertical column, or diagonal."
      },
      {
        title: "Win the game",
        description:
          "The first player to get three of their symbols in a row wins."
      },
      {
        title: "Draw",
        description:
          "If all nine squares are filled and neither player has three in a row, the game ends in a draw."
      }
    ]
  },

  // CONNECT FOUR
  {
    id: 2,
    gameId: "connectFour",
    name: "Connect Four",
    path: "/game/connect-four",
    description: "Drop discs and connect four.",
    image: "/images/connect4.png",

    instructions: [
      {
        title: "Take turns",
        description:
          "Two players take turns dropping their discs onto the board."
      },
      {
        title: "Choose a column",
        description:
          "On your turn, click a column to drop your disc into it. The disc will fall to the lowest available position."
      },
      {
        title: "Plan your moves",
        description:
          "Try to place your discs where they help you create a line while blocking your opponent."
      },
      {
        title: "Connect four",
        description:
          "Connect four of your discs in a horizontal, vertical, or diagonal line to win."
      },
      {
        title: "Win or draw",
        description:
          "The first player to connect four wins. If the board fills up without either player connecting four, the game ends in a draw."
      }
    ]
  },

  // ROCK PAPER SCISSORS
  {
    id: 3,
    gameId: "rockPaperScissors",
    name: "Rock Paper Scissors",
    path: "/game/rps",
    description: "Quick reaction game.",
    image: "/images/rps.png",

    instructions: [
      {
        title: "Choose your move",
        description:
          "Both players secretly choose one of three options: Rock, Paper, or Scissors."
      },
      {
        title: "Know the rules",
        description:
          "Rock beats Scissors, Scissors beats Paper, and Paper beats Rock."
      },
      {
        title: "Wait for your opponent",
        description:
          "Your choice is hidden from your opponent until both players have made their choice."
      },
      {
        title: "See the result",
        description:
          "Once both players choose, their choices are revealed and the winner of the round is shown."
      },
      {
        title: "Keep playing",
        description:
          "The score is updated after each round. Choose again to play the next round."
      },
      {
        title: "Draw",
        description:
          "If both players choose the same option, the round is a draw."
      }
    ]
  },

  // POISON HEARTS
  {
    id: 4,
    gameId: "poisonHearts",
    name: "Poison Hearts",
    path: "/game/poison-hearts",
    description: "Pick hearts carefully, one is poisoned.",
    image: "/images/poison-hearts.png",

    instructions: [
      {
        title: "Take turns",
        description:
          "Two players take turns choosing a heart from the board."
      },
      {
        title: "Choose carefully",
        description:
          "Each turn, select one of the available hearts."
      },
      {
        title: "Avoid the poisoned heart",
        description:
          "One heart is secretly poisoned. Choosing it will cause you to lose the game."
      },
      {
        title: "Stay alert",
        description:
          "The poisoned heart is hidden, so choose carefully and try to avoid it."
      },
      {
        title: "Win",
        description:
          "Avoid the poisoned heart and make your opponent pick it first to win."
      }
    ]
  },

  // GUESS THE NUMBER
  {
    id: 5,
    gameId: "guessTheNumber",
    name: "Guess the Number",
    path: "/game/guess-the-number",
    description: "Guess the Number I'm thinking of.",
    image: "/images/guess-the-number.png",

    instructions: [
      {
        title: "Choose a number",
        description:
          "One player secretly chooses a number within the game's allowed range."
      },
      {
        title: "Take turns guessing",
        description:
          "The other player tries to guess the secret number."
      },
      {
        title: "Use the hints",
        description:
          "After each guess, use the feedback to figure out whether your next guess should be higher or lower."
      },
      {
        title: "Narrow it down",
        description:
          "Keep using the hints to reduce the possible range of numbers."
      },
      {
        title: "Guess correctly",
        description:
          "The player who correctly guesses the secret number wins the round."
      }
    ]
  }
];