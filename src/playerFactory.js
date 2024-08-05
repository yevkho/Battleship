import createGameBoard from "./gameBoardFactory";

export default function createPlayer(playerType, playerName) {
  if (playerType !== "computer" && playerType !== "real") {
    throw new Error('Invalid player type - "computer" or "real"');
  }

  const gameBoard = createGameBoard();
  function getGameBoard() {
    return gameBoard;
  }

  function makeMove(x, y, opponentGameBoard) {
    if (playerType === "computer") {
      //~incoming query
      x = Math.floor(Math.random() * 10); //random 0-9
      y = Math.floor(Math.random() * 10); //random 0-9
    }
    // outgoing command message
    return opponentGameBoard.receiveAttack(x, y);
  }

  return { playerType, playerName, getGameBoard, makeMove };
}
