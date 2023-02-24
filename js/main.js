const gameBoard = (() => {
  // creates empty array to hold game squares
  let gameBoard = [];
  let playerPiece = "X";
    // create O button
  const oButton = document.createElement("button");
  oButton.classList.add('playerPieceButton');
  oButton.addEventListener('click', () => {
    playerPiece = "O";
  });
  oButton.innerText = "O";
  // create X button
  const xButton = document.createElement('button');
  xButton.classList.add('playerPieceButton');
  xButton.addEventListener('click', () => {
    playerPiece = "X";
  });
  xButton.innerText = "X";
  // add both buttons to the page
  document.querySelector(".symbolButtonContainer").append(oButton, xButton)  
  // pushes empty string to create game board tiles
  for (let index = 0; index < 9; index++) {
    gameBoard.push(" ");
  }

  // create DOM elements to match array
  let i = 0;
  gameBoard.forEach((element) => {
    let tile = document.createElement("div");
    tile.classList.add("boardTile");
    tile.dataset.count = i;
    i++;
    tile.addEventListener("click", function playPiece () {
      tile.innerText = playerPiece;
      gameBoard[tile.dataset.count] = playerPiece;
      console.log(gameBoard);
      //   checkWin();
      tile.removeEventListener("click", playPiece); // to prevent playing the same square
    });
    document.querySelector(".gameBoardContainer").appendChild(tile);
    return { tile, gameBoard, playerPiece }; // return these for use in gamePlay Obj
  });

  return { gameBoard };
})();



console.log(gameBoard.gameBoard);
