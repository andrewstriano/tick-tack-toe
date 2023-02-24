const gameBoard = ( () => {
    // creates empty array to hold game squares
    let gameBoard = [];
    let playerPiece = "X";
    // pushes empty string to create game board tiles
    for (let index = 0; index < 9; index++) {
        gameBoard.push(" ");
    };

    // create DOM elements to match array
    gameBoard.forEach(element => {
        let tile = document.createElement("div");
        tile.classList.add("boardTile");
        tile.addEventListener("click", () => {
            tile.innerText = playerPiece;
        });
        document.querySelector(".gameBoardContainer").appendChild(tile);
        return {tile}
    });

    
    return {gameBoard};
})();

console.log(gameBoard.gameBoard);