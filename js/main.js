// player factory function
const playerFactory = (char, playerNum) => {
  const playerPiece = char;
  return { playerPiece, playerNum };
};
let playerOne;
let computer;

const play = (() => {
  let fc = 0;
  const winningPatterns = [
    // Horizontal Wins
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Vertical Wins
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonal Wins
    [0, 4, 8],
    [2, 4, 6],
  ];

  const currentMoves = [];

  function legalMoves(newBoard) {
    let availableMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const movesMade = newBoard.map((x) => x.move);
    availableMoves = availableMoves.filter((x) => !movesMade.includes(x));
    console.log("avail", availableMoves);
    return availableMoves;
  }

  const difficultyInput = document.querySelector("#difficulty");
  difficultyInput.addEventListener("change", setDifficulty);

  let probability = 0;
  let decision;

  function setDifficulty() {
    const level = difficultyInput.value;
    if (level === "easy") {
      probability = 20;
    } else if (level === "medium") {
      probability = 50;
    } else if (level === "hard") {
      probability = 80;
    } else {
      probability = 100;
    }
  }

  function computerPick() {
    let decider = Math.round(Math.random() * 100);
    if (decider > probability) {
      console.log("random");
      decision = "random";
    } else {
      console.log("best");
      decision = "best";
    }
  }

  function randomMove() {
    const availableMoves = legalMoves(currentMoves);
    const moveIndex = Math.round(Math.random() * (availableMoves.length - 1));
    const move = availableMoves[moveIndex];
    return move;
  }

  function bestMove() {
    const move = minimax(currentMoves, computer.playerNum);
    return move.index;
  }

  function minimax(newBoard, playerNum) {
    fc++;
    console.log({ fc });
    console.log(newBoard);
    // array of indexes
    const availableSpots = legalMoves(newBoard);
    console.log("isWin", isWinner(newBoard, playerOne, playerNum));
    // checking to make sure there is not a terminal state at this point
    if (isWinner(newBoard, playerOne.playerNum)) {
      return { score: -10 };
    }
    if (isWinner(newBoard, computer.playerNum)) {
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
      move.index = availableSpots[i];

      // sets available spot to player
      newBoard.push({ player: playerNum, move: availableSpots[i] });
      console.log("first", newBoard);

      if (playerNum === 2) {
        const result = minimax(newBoard, playerOne.playerNum);
        move.score = result.score;
      } else {
        const result = minimax(newBoard, computer.playerNum);
        move.score = result.score;
      }
      // remove the move object; return the board to original
      newBoard.splice(availableSpots[i], 1);
      console.log("second", newBoard);
      // adds that move to the array of future moves
      moves.push(move);
    }

    let ultimateMove;
    if (playerNum === computer.playerNum) {
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

  function computerMove() {
    computerPick();
    let move;
    if (decision === "best") {
      move = bestMove();
    } else {
      move = randomMove();
    }
    currentMoves.push({
      player: computer.playerNum,
      move,
    });

    tiles[move].innerText = computer.playerPiece;
    tiles[move].removeEventListener("click", playPiece);

    if (isWinner(currentMoves, computer.playerNum)) {
      board.displayWinner(computer.playerNum);
    } else if (currentMoves.length === 9) {
      board.displayWinner("tie");
    }
  }

  function isWinner(boardArray, player) {
    const filteredMoves = boardArray
      .filter((x) => x.player === player)
      .map((x) => x.move)
      .sort((a, b) => a - b);
    return filteredMoves.length < 3
      ? false
      : winningPatterns.some((x) => x.every((i) => filteredMoves.includes(i)));
  }

  function playPiece(event) {
    event.target.innerText = playerOne.playerPiece;

    const move = parseInt(event.target.dataset.count, 10);

    currentMoves.push({ player: playerOne.playerNum, move });

    isWinner(currentMoves, playerOne.playerNum);

    if (isWinner(currentMoves, playerOne.playerNum)) {
      board.displayWinner(playerOne.playerNum);
    } else if (currentMoves.length === 9) {
      board.displayWinner("tie");
    } else {
      computerMove();
    }
  }

  return {
    currentMoves,
    isWinner,
    playPiece,
    computerMove,
    legalMoves,
  };
})();

const board = (() => {
  // create O button
  const oButton = document.createElement("button");
  oButton.classList.add("playerPieceButton");
  oButton.addEventListener("click", () => {
    playerOne = playerFactory("O", 1);
    computer = playerFactory("X", 2);
  });
  oButton.innerText = "O";

  // create X button
  const xButton = document.createElement("button");
  xButton.classList.add("playerPieceButton");
  xButton.addEventListener("click", () => {
    playerOne = playerFactory("X", 1);
    computer = playerFactory("O", 2);
  });
  xButton.innerText = "X";
  document.querySelector(".symbolButtonContainer").append(oButton, xButton);

  // set player 2

  // pushes empty string to create game board tiles
  const gameBoard = [];
  for (let index = 0; index < 9; index++) {
    gameBoard.push(" ");
  }

  // creates results display
  function displayWinner(param) {
    let result;
    if (param === "tie") {
      result = "Its a Tie!!!";
    } else if (param === playerOne.playerNum) {
      result = "Player 1 the Winner!!!!!";
    } else {
      result = "Player 2 is the Winner!!!!!!";
    }
    document
      .querySelector(".resultsContainer")
      .append(document.createTextNode(result));
  }
  // create DOM elements to match array
  let i = 0;
  gameBoard.forEach(() => {
    const tile = document.createElement("div");
    tile.classList.add("boardTile");
    tile.dataset.count = i;
    i++;
    tile.addEventListener("click", play.playPiece);
    document.querySelector(".gameBoardContainer").appendChild(tile);
  });

  function showMove(move, player) {
    const tiles = Array.from(document.querySelectorAll("boardTile"));
    const tile = tiles[move];
    tile.innerText = player.playerPiece;
  }

  return {
    gameBoard,
    displayWinner,
    showMove,
  };
})();

const tiles = Array.from(document.querySelectorAll(".boardTile"));
