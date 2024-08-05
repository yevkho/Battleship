import createPlayer from "./playerFactory";
import renderGameBoard from "./domRenders";
import setRandomShipsGenerator from "./domRenders";
import "./styles.css";

//1) create players & boards
//create playerOne & board/ships
let playerOne = createPlayer("real", "Yev");
setShipsRandom(playerOne.getGameBoard());

//configure "Random Ships" button
const placeShipsButton = document.querySelector(".randomShips");
placeShipsButton.addEventListener("click", () => {
  playerOne.getGameBoard().gameBoardReset();
  setShipsRandom(playerOne.getGameBoard());
  //   placeShipsPlayerOne();
  playerTwo.getGameBoard().gameBoardReset();
  secondPlayerNPC();
  //   secondPlayerReal()
  //   placeShipsPlayerTwo();

  attackingPlayer = playerOne;
  defendingPlayer = playerTwo;
  renderGameBoard(attackingPlayer, defendingPlayer);
});

//random ships setter - a button to cycle through random placements.
export function setShipsRandom(gameBoard) {
  //4 ships and their sizes
  const shipSizes = [1, 2, 3, 4];

  ////check for no overlapping & adjacent ships
  //[ [ y, x ], [ y+1, x ] ]
  function canPlaceShip(coordinates) {
    return coordinates.every(([y, x]) => {
      // check for overlapping ship and exist if so
      if (gameBoard.getGameBoard()[y][x] !== null) {
        return false;
      }

      //check for adjacent cells not to have ships
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const newY = y + dy; // y-1 // y+0 // y+1
          const newX = x + dx; // x-1 // x+0 // x+1
          if (newY >= 0 && newY < 10 && newX >= 0 && newX < 10) {
            if (gameBoard.getGameBoard()[newY][newX] !== null) {
              return false;
            }
          }
        }
      }

      //if all checks passed than clear to add
      return true;
    });
  }

  //loop though the ships array and place them (after checking)
  shipSizes.forEach((sizeItem) => {
    let placed = false;

    while (!placed) {
      const isHorizontal = Math.random() < 0.5; //random nr less than 1

      const startX = Math.floor(
        Math.random() * (isHorizontal ? 10 - sizeItem : 10)
      ); //1 extra
      const startY = Math.floor(
        Math.random() * (isHorizontal ? 10 : 10 - sizeItem)
      ); //1 extra

      const coordinates = [];

      for (let i = 0; i < sizeItem; i++) {
        if (isHorizontal) {
          coordinates.push([startY, startX + i]);
        } else {
          coordinates.push([startY + i, startX]);
        }
      }

      //check for clearance and then add
      if (canPlaceShip(coordinates)) {
        gameBoard.placeShip(coordinates);
        placed = true;
      }
    }
  });
}

//manual ships setter
// placeShipsPlayerOne();
function placeShipsPlayerOne() {
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
}

//create playerTwo & board/ships
let playerTwo;
// secondPlayerReal();
secondPlayerNPC();

//NPC second player
function secondPlayerNPC() {
  playerTwo = createPlayer("computer", "NPC");

  placeShipsPlayerTwo();
  function placeShipsPlayerTwo() {
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
  }
}

//real 2nd player
function secondPlayerReal() {
  playerTwo = createPlayer("real", "Gabi");
  placeShipsPlayerTwo();
  function placeShipsPlayerTwo() {
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
  }
}

function resetGame() {
  playerOne.getGameBoard().gameBoardReset();
  setShipsRandom(playerOne.getGameBoard());
  //   placeShipsPlayerOne();
  playerTwo.getGameBoard().gameBoardReset();
  secondPlayerNPC();
  //   secondPlayerReal()
  //   placeShipsPlayerTwo();

  attackingPlayer = playerOne;
  defendingPlayer = playerTwo;
}

//2)set attacking player & defending player
let attackingPlayer = playerOne; //Yev
let defendingPlayer = playerTwo; //NPC

function switchPlayers() {
  if (attackingPlayer == playerOne) {
    attackingPlayer = playerTwo;
    defendingPlayer = playerOne;
  } else {
    attackingPlayer = playerOne;
    defendingPlayer = playerTwo;
  }
}

//3) render attacking and defending player gameBoards
renderGameBoard(attackingPlayer, defendingPlayer);

//4) set game logic: playTurn & playGame

//playTurn
export function playTurn(event, gameBoard) {
  //play turn with given cell coordinates
  const yIndex = event.target.dataset.yindex;
  const xIndex = event.target.dataset.xindex;

  if (
    gameBoard.getMissedAttacks().has(`${yIndex},${xIndex}`) ||
    gameBoard.getHitAttacks().has(`${yIndex},${xIndex}`)
  ) {
    alert("already hit, try new target");
    return false;
  }
  //check for misses and hits and if repeat-hit return and ask again
  gameBoard.receiveAttack(yIndex, xIndex, console.log); //outgoing command message
  return true;
}

//playGame
export function playGame(event, gameBoard) {
  //play turn with given cell coordinates (if already hit, then return and redo)
  if (!playTurn(event, gameBoard)) {
    return;
  }

  //update board with newest hit
  renderGameBoard(attackingPlayer, defendingPlayer);

  //check end-game status
  if (gameBoard.checkAllShipsSunk()) {
    //outgoing command message
    console.log(`Game Over: ${attackingPlayer.playerName} won!`);
    resetGame();
    renderGameBoard(attackingPlayer, defendingPlayer);
    return;
  }

  // switch attacking -- defending
  switchPlayers();
  console.log(`${attackingPlayer.playerName}'s turn`);

  //re-render board
  renderGameBoard(attackingPlayer, defendingPlayer);

  //check if NPC to make move
  if (attackingPlayer.playerType == "computer") {
    playNpcTurn(defendingPlayer.getGameBoard());
    switchPlayers();
    console.log(`${attackingPlayer.playerName}'s turn`);
    renderGameBoard(attackingPlayer, defendingPlayer);
  }
}

//NPC-play
export function playNpcTurn(defendingGameBoard) {
  let y;
  let x;

  do {
    y = Math.floor(Math.random() * 10);
    x = Math.floor(Math.random() * 10);
  } while (
    // out query mess
    defendingGameBoard.getMissedAttacks().has(`${y},${x}`) ||
    defendingGameBoard.getHitAttacks().has(`${y},${x}`)
  );
  // out command mess
  defendingGameBoard.receiveAttack(y, x, console.log);
}
