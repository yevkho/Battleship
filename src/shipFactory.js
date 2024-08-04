export default function createShip(shipLength) {
  let hitsCount = 0;
  let isSunk = false;

  //public method: incoming command
  function hit() {
    hitsCount++;
  }

  function getHitsCount() {
    return hitsCount;
  }

  // public method: incoming command (can be query)
  function checkIfSunk() {
    if (hitsCount >= shipLength) {
      isSunk = true;
    }
    return isSunk;
  }

  return { shipLength, getHitsCount, hit, checkIfSunk };
}
