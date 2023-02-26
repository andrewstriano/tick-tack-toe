const playerFactory = (symbol, playerNum) => ({ symbol, playerNum });

const humanPlayer = playerFactory("X", 1);
const aiPlayer = playerFactory("O", 2);

const gameController = (() => {
  const currentBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  function legalMoves(board) {
    const availSpots = board.filter((x) => x !== "X").filter((x) => x !== "O");
    return availSpots;
  }

  function showMove(tile, player) {
    tile.innerText = player;
  }
  function humanMove(event) {
    showMove(event.target, humanPlayer.symbol);
    currentBoard[event.target.id] = humanPlayer.symbol;
    if (isWinner(currentBoard, humanPlayer.symbol)) {
      boardController.displayWinner(humanPlayer);
    } else if (legalMoves(currentBoard).length === 0) {
      boardController.displayWinner("tie");
    } else {
      computerMove();
    }
  }

  let decision;
  function computerMove() {
    computerPick();
    let move;
    if (decision === "best") {
      move = bestMove();
    } else {
      move = randomMove();
    }
    boardController.tiles[move].innerText = aiPlayer.symbol;
    currentBoard[move] = aiPlayer.symbol;

    if (isWinner(currentBoard, aiPlayer.symbol)) {
      boardController.displaywinner(aiPlayer);
    } else if (legalMoves(currentBoard).length === 0) {
      boardController.displaywinner("tie");
    }
  }
  function bestMove() {
    const move = minimax(currentBoard, aiPlayer);
    return move.index;
  }
  function randomMove() {
    const availableMoves = legalMoves(currentBoard);
    const moveIndex = Math.round(Math.random() * (availableMoves.length - 1));
    const move = availableMoves[moveIndex];
    return move;
  }
  // set prob to easy automatically
  let probability = 20;
  const difficultyInput = document.querySelector("#difficulty");

  function setDifficulty() {
    const level = difficultyInput.value;
    if (level === "easy") {
      probability = 20;
    } else if (level === "medium") {
      probability = 50;
    } else if (level === "hard") {
      probability = 85;
    } else {
      probability = 100;
    }
  }
  // links input to difficulty
  difficultyInput.addEventListener("change", setDifficulty);

  function computerPick() {
    const decider = Math.round(Math.random() * 100);
    if (decider > probability) {
      console.log("random");
      decision = "random";
    } else {
      console.log("best");
      decision = "best";
    }
  }
  let fc = 0;
  function minimax(newBoard, player) {
    fc++;
    console.log({ fc });
    // array of indexes
    const availableSpots = legalMoves(newBoard);

    // checking to make sure there is not a terminal state at this point
    if (isWinner(newBoard, humanPlayer.symbol)) {
      return { score: -10 };
    }
    if (isWinner(newBoard, aiPlayer.symbol)) {
      return { score: 10 };
    }
    if (availableSpots.length === 0) {
      return { score: 0 };
    }
    // collects all the future moves objects
    const moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
      // creates a move objects for each empty spot
      const move = {};
      move.index = newBoard[availableSpots[i]];

      // sets available spot to player
      newBoard[availableSpots[i]] = player.symbol;

      if (player === aiPlayer) {
        const result = minimax(newBoard, humanPlayer);
        move.score = result.score;
      } else {
        const result = minimax(newBoard, aiPlayer);
        move.score = result.score;
      }
      // remove the move object; return the board to original
      newBoard[availableSpots[i]] = move.index;

      console.log("second", newBoard);
      // adds that move to the array of future moves
      moves.push(move);
    }

    let ultimateMove;
    if (player === aiPlayer) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          ultimateMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          ultimateMove = i;
        }
      }
    }
    return moves[ultimateMove];
  }

  function isWinner(board, player) {
    if (
      (board[0] == player && board[1] == player && board[2] == player) ||
      (board[3] == player && board[4] == player && board[5] == player) ||
      (board[6] == player && board[7] == player && board[8] == player) ||
      (board[0] == player && board[3] == player && board[6] == player) ||
      (board[1] == player && board[4] == player && board[7] == player) ||
      (board[2] == player && board[5] == player && board[8] == player) ||
      (board[0] == player && board[4] == player && board[8] == player) ||
      (board[2] == player && board[4] == player && board[6] == player)
    ) {
      return true;
    } else {
      return false;
    }
  }
  return {
    legalMoves,
    showMove,
    humanMove,
    currentBoard,
  };
})();

const boardController = (() => {
  // creates the ability to choose symbol and changes players based on that
  const xButton = document.querySelector("#xButton");
  const oButton = document.querySelector("#oButton");

  function chooseSymbol(event) {
    humanPlayer.symbol = event.target.innerText;
    if (humanPlayer.symbol === "X") {
      aiPlayer.symbol = "O";
    } else {
      aiPlayer.symbol = "X";
    }
    console.log(humanPlayer);
    console.log(aiPlayer);
  }

  xButton.addEventListener("click", chooseSymbol);
  oButton.addEventListener("click", chooseSymbol);

  // creates board tiles
  const tiles = [];
  for (let index = 0; index < 9; index++) {
    const tile = document.createElement("div");
    tile.id = index;
    tile.classList.add("boardTile");
    tiles.push(tile);
    tile.addEventListener("click", gameController.humanMove);
    document.querySelector(".gameBoardContainer").appendChild(tile);
  }
  function displayWinner(player) {
    if (player === humanPlayer) {
      alert("you win");
    } else if (player === aiPlayer) {
      alert("you lose");
    } else if (player === "tie") {
      alert("ITS A TIE");
    }
  }
  return {
    tiles,
    displayWinner,
  };
})();
