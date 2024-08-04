import { playTurn } from "./index";
// import playTurn from "./gameLogic";

//gameBoard rendering method
export default function renderGameBoard(playerNumber, gameBoard) {
  const yourGridDiv = document.querySelector(".yourGrid");
  const opponentGrid = document.querySelector(".opponentGrid");

  //clear re-rendered grid
  if (playerNumber == 1) {
    yourGridDiv.replaceChildren(); //playerOne reset board
  } else {
    opponentGrid.replaceChildren(); // playerTwo reset board
  }

  //render grid
  gameBoard.getGameBoard().forEach((rowElement, yIndex) => {
    rowElement.forEach((cellElement, xIndex) => {
      const cell = document.createElement("div");
      cell.setAttribute("data-yIndex", `${yIndex}`);
      cell.setAttribute("data-XIndex", `${xIndex}`);

      //set cell base-id
      if (cellElement == null) {
        cell.setAttribute("class", "emptyCell");
      } else if (typeof cellElement === "object" && "hit" in cellElement) {
        cell.setAttribute("class", "shipCell");
      } else if (cellElement == 1) {
        cell.setAttribute("class", "missCell");
      }

      //set cell hit-id (for ship cells that have been hit)
      if (gameBoard.getHitAttacks().has(`${yIndex},${xIndex}`)) {
        cell.classList.add("hitShip");
      }

      //add receive attack event to each cell
      cell.addEventListener("click", (event) => {
        playTurn(event, gameBoard, playerNumber);
      });

      //append to left or right board display
      if (playerNumber == 1) {
        yourGridDiv.appendChild(cell);
      } else {
        opponentGrid.appendChild(cell);
      }
    });
  });
}
