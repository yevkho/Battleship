import createPlayer from "./playerFactory";
import renderGameBoard from "./domRenders";

// GAME LOGIC

let playerOne;
let playerTwo;
let attackingPlayer;
let defendingPlayer;

export function setGame() {
  //1) create 2 players & boards
  //A. create playerOne & gameBoard
  playerOne = createPlayer("real", "Yev");
  //set ships randomly
  setShipsRandom(playerOne.getGameBoard());

  //B. create playerTwo & gameBoard
  playerTwo = createPlayer("computer", "NPC"); //NPC
  //let playerTwo = createPlayer("real", "Gabi"); //Human
  //set ships randomly
  setShipsRandom(playerTwo.getGameBoard());

  //2)set attacking player & defending player
  attackingPlayer = playerOne; //Yev
  defendingPlayer = playerTwo; //NPC

  //3) render player gameBoards on screen & START
  renderGameBoard(attackingPlayer, defendingPlayer);
}

//4) playGame
export function playGame(event, gameBoard) {
  //play turn with given cell coordinates
  if (!playTurn(event, gameBoard)) {
    return;
  }
  //update board with newest hit
  renderGameBoard(attackingPlayer, defendingPlayer); //outgoing command message
  //check end-game status (outgoing command message)
  if (gameBoard.checkAllShipsSunk()) {
    console.log(`Game Over: ${attackingPlayer.playerName} won!`);
    resetGame();
    // renderGameBoard(attackingPlayer, defendingPlayer);
    return;
  }
  console.log("loader start");
  //wait 2 seconds and switch players
  setTimeout(() => {
    // switch attack-defend
    console.log("loader end");
    switchPlayers();
    console.log(`${attackingPlayer.playerName}'s turn`);
    //re-render board
    renderGameBoard(attackingPlayer, defendingPlayer);

    //check if NPC to make auto-move
    if (attackingPlayer.playerType == "computer") {
      //wait 2 seconds and execute NPC move
      setTimeout(() => playNpcTurn(defendingPlayer.getGameBoard()), 2000);
    }
  }, 2000);
}

//UTILITIES

//1. random ships setter
export function setShipsRandom(gameBoard) {
  //4 ships and their sizes
  const shipSizes = [1, 2, 3, 4];
  ////check for no overlapping & adjacent ships
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
      //set valid shipStart
      const startX = Math.floor(
        Math.random() * (isHorizontal ? 10 - sizeItem : 10)
      );
      const startY = Math.floor(
        Math.random() * (isHorizontal ? 10 : 10 - sizeItem)
      );

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

//2. reset players' gameBoards
export function resetGame() {
  playerOne.getGameBoard().gameBoardReset();
  setShipsRandom(playerOne.getGameBoard());
  playerTwo.getGameBoard().gameBoardReset();
  setShipsRandom(playerTwo.getGameBoard());

  attackingPlayer = playerOne;
  defendingPlayer = playerTwo;

  renderGameBoard(attackingPlayer, defendingPlayer);
}

//3. toggle between two players
function switchPlayers() {
  if (attackingPlayer == playerOne) {
    attackingPlayer = playerTwo;
    defendingPlayer = playerOne;
  } else {
    attackingPlayer = playerOne;
    defendingPlayer = playerTwo;
  }
}

//4. playTurn
export function playTurn(event, gameBoard) {
  const yIndex = event.target.dataset.yindex;
  const xIndex = event.target.dataset.xindex;
  //check for misses and hits and if repeat-hit return
  if (
    gameBoard.getMissedAttacks().has(`${yIndex},${xIndex}`) ||
    gameBoard.getHitAttacks().has(`${yIndex},${xIndex}`)
  ) {
    alert("already hit, try new target");
    return false;
  }
  //execute hit on a given coordinates
  gameBoard.receiveAttack(yIndex, xIndex, console.log); //outgoing command message
  return true;
}

//5. NPC-play
export function playNpcTurn(defendingGameBoard) {
  console.log(defendingPlayer);
  let y;
  let x;
  do {
    y = Math.floor(Math.random() * 10);
    x = Math.floor(Math.random() * 10);
  } while (
    // out query message
    defendingGameBoard.getMissedAttacks().has(`${y},${x}`) ||
    defendingGameBoard.getHitAttacks().has(`${y},${x}`)
  );
  defendingGameBoard.receiveAttack(y, x, console.log); //out command message
  renderGameBoard(attackingPlayer, defendingPlayer);

  //check win condition for NPC
  if (defendingPlayer.getGameBoard().checkAllShipsSunk()) {
    console.log(`Game Over: ${attackingPlayer.playerName} won!`);
    resetGame();
    return;
  }

  setTimeout(() => {
    switchPlayers();
    console.log(`${attackingPlayer.playerName}'s turn`);
    renderGameBoard(attackingPlayer, defendingPlayer);
  }, 2000);
}

//6. set dragged ship on playerOne gameBoard
export function setDraggedShip(shipSize, [startY, startX], horizontal) {
  let coordinates = [];

  for (let i = 0; i < shipSize; i++) {
    if (horizontal) {
      coordinates.push([startY, startX + i]);
    } else {
      coordinates.push([startY + i, startX]);
    }
  }

  playerOne.getGameBoard().placeShip(coordinates);
  renderGameBoard(attackingPlayer, defendingPlayer);
}
