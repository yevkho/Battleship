import createPlayer from "./playerFactory";
import renderGameBoard from "./domRenders";
import "./styles.css";

//
//create playerOne, board & ships
const playerOne = createPlayer("real");
playerOne.getGameBoard().placeShip([[1, 1]]);
playerOne.getGameBoard().placeShip([
  [3, 1],
  [3, 2],
]);
playerOne.getGameBoard().placeShip([
  [6, 4],
  [7, 4],
  [8, 4],
]);
playerOne.getGameBoard().placeShip([
  [5, 8],
  [6, 8],
  [7, 8],
  [8, 8],
]);

//create playerTwo, board & ships
const playerTwo = createPlayer("real");
playerTwo.getGameBoard().placeShip([[6, 1]]);
playerTwo.getGameBoard().placeShip([
  [1, 3],
  [2, 3],
]);
playerTwo.getGameBoard().placeShip([
  [4, 6],
  [5, 6],
  [6, 6],
]);
playerTwo.getGameBoard().placeShip([
  [1, 5],
  [1, 6],
  [1, 7],
  [1, 8],
]);

//render playerOne and playerTwo gameBoards at game start
renderGameBoard(1, playerOne.getGameBoard());
renderGameBoard(2, playerTwo.getGameBoard());

//set and toggle active player
let activePlayer = playerOne;

function switchPlayer() {
  activePlayer = activePlayer == playerOne ? playerTwo : playerOne;
}

function resetActivePlayer() {
  activePlayer = playerOne;
}

//playTurn function
export function playTurn(event, gameBoard, playerNumber) {
  //play turn with given cell coordinates
  const yIndex = event.target.dataset.yindex;
  const xIndex = event.target.dataset.xindex;
  gameBoard.receiveAttack(yIndex, xIndex, console.log); //outgoing command message

  //update board with newest hit
  renderGameBoard(playerNumber, gameBoard); //outgoing command message

  //check game status
  if (gameBoard.checkAllShipsSunk()) {
    //outgoing command message
    console.log(`Game Over: player ${playerNumber} won!`);
  }
}
