import createShip from "./shipFactory";

export default function createGameBoard() {
  //utilities
  const gameBoard = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));
  const missedAttacks = [];
  const placedShips = [];
  const hitsAttacks = new Set(); //to track hits for rendering as hit (red)

  function getGameBoard() {
    return gameBoard;
  }

  function getMissedAttacks() {
    return missedAttacks;
  }

  function getHitAttacks() {
    return hitsAttacks;
  }

  //1 place ships at specific coordinates by calling the ship factory (public)
  function placeShip(coordArr) {
    if (coordArr.length === 0) return;
    // outgoing command or rather incoming query (that is tested on createShip object side)
    const ship = createShip(coordArr.length);
    placedShips.push(ship);
    // incoming command message
    coordArr.forEach((coord) => {
      const [x, y] = coord;
      gameBoard[x][y] = ship;
    });
  }

  //2 takes coordinates and determines hit or not, and
  //sends the ‘hit’ function to the correct ship, or records coordinates of missed shot.
  function receiveAttack(x, y, mockCall) {
    if (gameBoard[x][y] == 1) {
      //incoming query
      return null;
    } else if (gameBoard[x][y]) {
      //outgoing command (producing public side-effect)
      gameBoard[x][y].hit(); // this message MUST get sent
      //mock to test if message gets sent (TBD if this is how it's done)
      mockCall();
      hitsAttacks.add(`${x},${y}`);
    } else {
      // incoming command (if hit an empty spot - record with a Set?)
      gameBoard[x][y] = 1;
      missedAttacks.push([x, y]);
    }
  }

  //incoming query message
  function checkAllShipsSunk() {
    return placedShips.every((ship) => ship.checkIfSunk());
  }

  return {
    getGameBoard,
    placeShip,
    receiveAttack,
    getMissedAttacks,
    getHitAttacks,
    checkAllShipsSunk,
  };
}
