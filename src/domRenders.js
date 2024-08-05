// import { playTurn } from "./index";
// import playTurn from "./gameLogic";
import { playGame } from "./index";

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
