import { playGame } from "./gameLogic";
import { resetGame } from "./gameLogic";
import { setDraggedShip } from "./gameLogic";

//gameBoard rendering method
export default function renderGameBoard(attackingPlayer, defendingPlayer) {
  const attackingGrid = document.querySelector(".yourGrid");
  const defendingGrid = document.querySelector(".opponentGrid");

  //clear re-rendered grid
  attackingGrid.replaceChildren(); //playerOne reset board
  defendingGrid.replaceChildren(); // playerTwo reset board

  const attackingPlayerBoard = attackingPlayer.getGameBoard();
  const defendingPlayerBoard = defendingPlayer.getGameBoard();
  const playerArray = [attackingPlayerBoard, defendingPlayerBoard];

  //render grid
  playerArray.forEach((playerBoard, playerIndex) => {
    playerBoard.getGameBoard().forEach((rowElement, yIndex) => {
      rowElement.forEach((cellElement, xIndex) => {
        const cell = document.createElement("div");
        cell.setAttribute("data-yIndex", `${yIndex}`);
        cell.setAttribute("data-XIndex", `${xIndex}`);

        //set cell base-id
        if (cellElement == null) {
          cell.setAttribute("class", "emptyCell");
        } else if (typeof cellElement === "object" && "hit" in cellElement) {
          if (playerIndex == 0) {
            cell.setAttribute("class", "shipCell");
          } else {
            cell.setAttribute("class", "emptyCell");
          }
        } else if (cellElement == 1) {
          cell.setAttribute("class", "missCell");
        }

        //set cell hit-id (for ship cells that have been hit)
        if (playerBoard.getHitAttacks().has(`${yIndex},${xIndex}`)) {
          cell.classList.add("hitShip");
        }

        //add receive attack event to each cell
        cell.addEventListener("click", (event) => {
          playGame(event, playerBoard);
        });

        //add dragover and drop event listeners to each cell
        cell.addEventListener("dragover", dragOver);
        cell.addEventListener("drop", dropShip);

        //append to left or right board display
        if (playerIndex == 0) {
          attackingGrid.appendChild(cell);
        } else {
          defendingGrid.appendChild(cell);
        }
      });
    });
  });
}

//A. configure "Random Ships" button
const placeShipsButton = document.querySelector(".randomShips");
placeShipsButton.addEventListener("click", () => {
  resetGame();
});

//B. configure "FLIP" button
const flipButton = document.querySelector(".flipButton");
const optionContainer = document.querySelector(".shipOptions");

let angle = 0;
function flip() {
  const optionShips = Array.from(optionContainer.children);
  angle = angle === 0 ? 90 : 0;
  optionShips.forEach((ship) => (ship.style.transform = `rotate(${angle}deg)`));
}

flipButton.addEventListener("click", flip);

//C. drag ships functionality
//store targetDiv to associate with shipsObjectArray
let draggedShipDiv;

//add drag event handler to shipDivs
const optionShips = Array.from(optionContainer.children);
function dragStart(e) {
  draggedShipDiv = e.target;
}

optionShips.forEach((ship) => ship.addEventListener("dragstart", dragStart));

//dragOver and dropShips event handlers for boardCells

function dropShip(e) {
  const startCoordinates = [
    Number(e.target.dataset.yindex),
    Number(e.target.dataset.xindex),
  ];

  const shipSize = Number(draggedShipDiv.id);

  let horizontal = angle === 0;

  setDraggedShip(shipSize, startCoordinates, horizontal);
}

function dragOver(e) {
  e.preventDefault();

  let startY = Number(e.target.dataset.yindex);
  let startX = Number(e.target.dataset.xindex);

  const shipSize = Number(draggedShipDiv.id);
  let horizontal = angle === 0;

  let coordinates = [];
  for (let i = 0; i < shipSize; i++) {
    if (horizontal) {
      coordinates.push([startY, startX + i]);
    } else {
      coordinates.push([startY + i, startX]);
    }
  }

  coordinates.forEach(([y, x]) => {
    const cell = document.querySelector(
      `div[data-yindex="${y}"][data-xindex="${x}"]`
    );
    cell.classList.add("hover");
    setTimeout(() => cell.classList.remove("hover"), 300);
  });
}
