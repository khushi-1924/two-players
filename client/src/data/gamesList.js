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
          "Players take turns placing their symbol on the 3×3 board. Player 1 uses X and Player 2 uses O."
      },
      {
        title: "Make your move",
        description:
          "On your turn, click any empty square to place your symbol."
      },
      {
        title: "Get three in a row",
        description:
          "Try to place three of your symbols in a horizontal, vertical, or diagonal line."
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
          "Players take turns dropping their discs onto the board."
      },
      {
        title: "Choose a column",
        description:
          "On your turn, click a column to drop your disc. The disc falls to the lowest available position."
      },
      {
        title: "Plan your moves",
        description:
          "Try to create your own line while blocking your opponent from making one."
      },
      {
        title: "Connect four",
        description:
          "Connect four of your discs in a horizontal, vertical, or diagonal line to win."
      },
      {
        title: "Win or draw",
        description:
          "The first player to connect four wins. If the board fills up without a winner, the game ends in a draw."
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
          "Your choice stays hidden until both players have made their choice."
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
          "If both players choose the same option, the round ends in a draw."
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
        title: "Choose your Poison Heart",
        description:
          "Both players secretly choose one heart on the board as their Poison Heart."
      },
      {
        title: "Start the round",
        description:
          "Once both players have chosen their Poison Heart, the round begins."
      },
      {
        title: "Take turns",
        description:
          "Players take turns choosing a heart from the board."
      },
      {
        title: "Avoid the Poison Heart",
        description:
          "Try to avoid the Poison Heart chosen by your opponent."
      },
      {
        title: "Hit the Poison Heart",
        description:
          "If you pick your opponent's Poison Heart, you lose the round."
      },
      {
        title: "Draw",
        description:
          "If all hearts are picked without anyone hitting a Poison Heart, the round ends in a draw."
      },
      {
        title: "Keep it secret",
        description:
          "Your Poison Heart stays hidden from your opponent throughout the round."
      },
      {
        title: "Play again",
        description:
          "After the round ends, choose Play Again to start a new round."
      }
    ]
  },


  // GUESS THE NUMBER
  {
    id: 5,
    gameId: "guessTheNumber",
    name: "Guess the Number",
    path: "/game/guess-the-number",
    description: "Guess your opponent's secret number.",
    image: "/images/guess-the-number.png",

    instructions: [
      {
        title: "Choose the number length",
        description:
          "Both players will play with either a 3-digit, 4-digit, or 5-digit number. Either player can choose the length, and the first valid choice is used."
      },
      {
        title: "Choose your secret number",
        description:
          "Both players secretly choose a number with the selected number of digits. Your number must have no repeated digits and cannot start with 0."
      },
      {
        title: "Keep your number secret",
        description:
          "Your secret number is hidden from your opponent. You must use the clues from their guesses to figure out your own strategy."
      },
      {
        title: "Take turns guessing",
        description:
          "Once both players have chosen their secret numbers, players take turns guessing their opponent's number."
      },
      {
        title: "Read the feedback",
        description:
          "After each guess, you will see how many digits are correct and how many of those digits are in the correct position."
      },
      {
        title: "Use the clues",
        description:
          "Use the feedback from each guess to work out which digits are in your opponent's number and where they belong."
      },
      {
        title: "Guess the number",
        description:
          "When all digits and all positions are correct, you have successfully guessed your opponent's secret number."
      },
      {
        title: "Win the game",
        description:
          "The first player to correctly guess their opponent's entire secret number wins the game."
      }
    ]
  },

  // DOTS AND BOXES
  {
    id: 6,
    gameId: "dotsAndBoxes",
    name: "Dots and Boxes",
    path: "/game/dots-and-boxes",
    description: "Connect dots, complete boxes, and score points.",
    image: "/images/dots-and-boxes.png",
    instructions: [
      {
        title: "Take turns",
        description:
          "Players take turns drawing one line between two adjacent dots. You can draw a horizontal or vertical line."
      },
      {
        title: "Complete a box",
        description:
          "If the line you draw completes a box, you claim that box and score 1 point."
      },
      {
        title: "Get another turn",
        description:
          "Whenever you complete a box, you get another turn. Keep playing until you draw a line that does not complete a box."
      },
      {
        title: "Plan your moves",
        description:
          "Try to complete your own boxes while avoiding moves that allow your opponent to easily claim one."
      },
      {
        title: "Claim the boxes",
        description:
          "Completed boxes are marked with the color of the player who claimed them."
      },
      {
        title: "Win the game",
        description:
          "When all boxes have been completed, the player with the most boxes wins."
      },
      {
        title: "Draw",
        description:
          "If both players complete the same number of boxes, the game ends in a draw."
      }
    ]
  },

];