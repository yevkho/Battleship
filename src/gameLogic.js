import renderGameBoard from "./domRenders";

export default function playTurn(event, gameBoard, playerNumber) {
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
