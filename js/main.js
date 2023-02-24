const gameBoard = (() => {
  // creates empty array to hold game squares
  let gameBoard = [];
  let playerPiece = "X";
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
    tile.addEventListener("click", () => {
      tile.innerText = playerPiece;
      gameBoard[tile.dataset.count] = playerPiece;
      console.log(gameBoard);
      //   checkWin();
    });
    document.querySelector(".gameBoardContainer").appendChild(tile);
    return { tile, gameBoard, playerPiece }; // return these for use in gamePlay Obj
  });

  return { gameBoard };
})();

console.log(gameBoard.gameBoard);
