import createShip from "./shipFactory";
import createGameBoard from "./gameBoardFactory";
import createPlayer from "./playerFactory";
import { playTurn } from "./gameLogic";
import { playGame } from "./gameLogic";
import { playNpcTurn } from "./gameLogic";
import { setShipsRandom } from "./gameLogic";
import { setGame } from "./gameLogic";
import renderGameBoard from "./domRenders";
// import "./styles.css";

//A Ship Class
describe("ship class tests", () => {
  //presets
  let fourShip; //construct new ship object (before each test)
  beforeEach(() => {
    fourShip = createShip(4);
  });

  //1 public property: ~incoming query
  test("ship length (4)", () => {
    // const fourShip = createShip(4);
    expect(fourShip.shipLength).toBe(4);
  });

  //2 public method: incoming command (private?)
  test("one ship hit (1)", () => {
    fourShip.hit();
    expect(fourShip.getHitsCount()).toBe(1);
  });

  //3
  test("three ship hits (3)", () => {
    fourShip.hit();
    fourShip.hit();
    fourShip.hit();
    expect(fourShip.getHitsCount()).toBe(3);
  });

  //4 public method: incoming command
  test("sunkStatus after one ship hit (false)", () => {
    fourShip.hit();
    expect(fourShip.checkIfSunk()).toBe(false);
  });

  //5
  test("sunkStatus after three ship hits (false)", () => {
    fourShip.hit();
    fourShip.hit();
    fourShip.hit();
    expect(fourShip.checkIfSunk()).toBe(false);
  });

  //6
  test("sunkStatus after four ship hits (true)", () => {
    fourShip.hit();
    fourShip.hit();
    fourShip.hit();
    fourShip.hit();
    expect(fourShip.checkIfSunk()).toBe(true);
  });
});

//gameBoard class
describe("gameBoard class tests", () => {
  //1 public property: incoming command
  test("set oneShip at: x = 1 &  y = 1", () => {
    const gameBoard1 = createGameBoard();
    const expectedObject = {
      shipLength: 1,
      hit: expect.any(Function), //jest struggles comparing in-object methods
      getHitsCount: expect.any(Function), //just means 'a (any) function'
      checkIfSunk: expect.any(Function),
    };
    gameBoard1.placeShip([[1, 1]]);

    expect(gameBoard1.getGameBoard()[1][1]).toEqual(expectedObject);
    expect(gameBoard1.getGameBoard()[1][1].shipLength).toBe(1); // better perhaps because we really just testing length property anyway
  });
  //1 public property: incoming command
  test("set fourShip at: x = 5 &  y = 8; x = 6, y = 8, x = 7, y = 8; x = 8, y = 8 ", () => {
    const gameBoard1 = createGameBoard();
    gameBoard1.placeShip([
      [5, 8],
      [6, 8],
      [7, 8],
      [8, 8],
    ]);

    expect(gameBoard1.getGameBoard()[5][8].shipLength).toBe(4);
    expect(gameBoard1.getGameBoard()[6][8].shipLength).toBe(4);
    expect(gameBoard1.getGameBoard()[7][8].shipLength).toBe(4);
    expect(gameBoard1.getGameBoard()[8][8].shipLength).toBe(4);
  });

  //1
  test("gameBoard reset test", () => {
    const gameBoard1 = createGameBoard();
    const gameBoardTest = createGameBoard().getGameBoard();

    gameBoard1.placeShip([[1, 1]]);
    gameBoard1.placeShip([
      [5, 8],
      [6, 8],
      [7, 8],
      [8, 8],
    ]);

    gameBoard1.gameBoardReset();
    expect(gameBoard1.getGameBoard()).toEqual(gameBoardTest);
  });

  //2 incoming command
  test("check hit miss record on the gameBoard (1)", () => {
    const gameBoard1 = createGameBoard();
    gameBoard1.placeShip([
      [5, 8],
      [6, 8],
      [7, 8],
      [8, 8],
    ]);
    gameBoard1.receiveAttack(0, 0);
    expect(gameBoard1.getGameBoard()[0][0]).toBe(1);
  });

  test("track missed attacks in missedAttacks array", () => {
    const gameBoard1 = createGameBoard();
    gameBoard1.receiveAttack(2, 3);
    gameBoard1.receiveAttack(4, 5);

    expect(gameBoard1.getMissedAttacks().has("2,3")).toBeTruthy();
  });

  test("track hit attacks in hitAttacks Set", () => {
    const gameBoard1 = createGameBoard();
    gameBoard1.placeShip([
      [1, 1],
      [2, 1],
    ]);
    const mockCall = jest.fn();
    gameBoard1.receiveAttack(2, 1, mockCall);

    expect(gameBoard1.getHitAttacks().has("2,1")).toBeTruthy();
  });

  //2 incoming query
  test("check hit same spot (null)", () => {
    const gameBoard1 = createGameBoard();
    gameBoard1.placeShip([
      [5, 8],
      [6, 8],
      [7, 8],
      [8, 8],
    ]);
    gameBoard1.receiveAttack(0, 0); //1st hit in new spot

    expect(gameBoard1.receiveAttack(0, 0)).toBeNull();
  });

  //2 incoming query (mock version) - tracks if 'a' call is made
  test("check hit ship (outgoing message) - mock version", () => {
    const gameBoard1 = createGameBoard();
    gameBoard1.placeShip([
      [5, 8],
      [6, 8],
      [7, 8],
      [8, 8],
    ]);
    const mockCall = jest.fn();
    gameBoard1.receiveAttack(5, 8, mockCall);

    expect(mockCall).toHaveBeenCalled();
  });

  //2 incoming query (spyOn version) - tracks if ;the' call of the right function is made
  test("check hit ship (outgoing message) - spyOn version", () => {
    const gameBoard1 = createGameBoard();
    gameBoard1.placeShip([
      [5, 8],
      [6, 8],
      [7, 8],
      [8, 8],
    ]);

    const mockCall = jest.fn(); // no need for mockCall with spyOn method
    const spy = jest.spyOn(gameBoard1.getGameBoard()[5][8], "hit"); //replaces the shipObjects hit method with a spy method (that gets called instead)
    gameBoard1.receiveAttack(5, 8, mockCall);

    expect(spy).toHaveBeenCalled();
    spy.mockRestore(); //restores the original hit method
  });

  //2 incoming query - checks the end outcome of the call
  test("check hit ship (hitCount +1)", () => {
    const gameBoard1 = createGameBoard();
    gameBoard1.placeShip([
      [5, 8],
      [6, 8],
      [7, 8],
      [8, 8],
    ]);
    const mockCall = jest.fn();
    gameBoard1.receiveAttack(5, 8, mockCall);
    // ultimate side affect test ((unnecessary)integration testing)
    expect(gameBoard1.getGameBoard()[5][8].getHitsCount()).toBe(1);
  });

  //3 incoming query
  test("check if all ships are sunk (false)", () => {
    const gameBoard1 = createGameBoard();
    gameBoard1.placeShip([
      [5, 8],
      [6, 8],
      [7, 8],
      [8, 8],
    ]);
    const mockCall = jest.fn();
    gameBoard1.receiveAttack(5, 8, mockCall);
    gameBoard1.receiveAttack(6, 8, mockCall);

    expect(gameBoard1.checkAllShipsSunk()).toBe(false);
  });

  test("check if all ships are sunk (true)", () => {
    const gameBoard1 = createGameBoard();
    gameBoard1.placeShip([
      [5, 8],
      [6, 8],
      [7, 8],
      [8, 8],
    ]);
    const mockCall = jest.fn();
    gameBoard1.receiveAttack(5, 8, mockCall);
    gameBoard1.receiveAttack(6, 8, mockCall);
    gameBoard1.receiveAttack(7, 8, mockCall);
    gameBoard1.receiveAttack(8, 8, mockCall);

    expect(gameBoard1.checkAllShipsSunk()).toBe(true);
  });
});

//C
describe("Player class tests", () => {
  test("set playerOne (real)", () => {
    const playerOne = createPlayer("real");
    const expectedObject = {
      playerType: "real",
      getGameBoard: expect.any(Function),
      makeMove: expect.any(Function),
    };
    expect(playerOne.playerType).toBe("real");
    expect(playerOne.getGameBoard()).toBeDefined();
    expect(playerOne).toEqual(expectedObject);
  });

  test("playerOne(real) & playerTwo(computer) makeMove message sending test", () => {
    const playerOne = createPlayer("real");
    const playerTwo = createPlayer("computer");
    //plyerOne(real) move
    const spy1 = jest.spyOn(playerTwo.getGameBoard(), "receiveAttack");
    playerOne.makeMove(1, 2, playerTwo.getGameBoard());
    expect(spy1).toHaveBeenCalledWith(1, 2);
    spy1.mockRestore();
    //playerTwo(computer) move
    const spy2 = jest.spyOn(playerOne.getGameBoard(), "receiveAttack");
    playerTwo.makeMove(null, null, playerOne.getGameBoard());
    expect(spy2).toHaveBeenCalled();
    spy2.mockRestore();
  });
});

//D Game Logic testing

//mock the domRenders as a module and have it call "jest.fn()" instead of
//"renderGameBoard" for the test globally
// jest.mock("./styles.css", () => jest.fn());
jest.mock("./domRenders", () => jest.fn());

describe("Game logic tests", () => {
  //1 (private method, not seen by rest of the app (also tested below))
  test("plyTurn outgoing message test", () => {
    const playerOne = createPlayer("real");
    const gameBoard = playerOne.getGameBoard();

    // mock event
    const event = {
      target: {
        dataset: {
          yindex: 3,
          xindex: 1,
        },
      },
    };

    //mock gameBoard function
    const spy1 = jest.spyOn(gameBoard, "receiveAttack");

    playTurn(event, gameBoard);

    //check the outgoing command message
    expect(spy1).toHaveBeenCalledWith(3, 1, console.log);
    spy1.mockRestore();
  });

  //2
  test("plyGame outgoing messages(2) test", () => {
    const playerOne = createPlayer("real");
    const gameBoard = playerOne.getGameBoard();

    // mock event
    const event = {
      target: {
        dataset: {
          yindex: 3,
          xindex: 1,
        },
      },
    };

    //mock gameBoard functions
    const spy1 = jest.spyOn(gameBoard, "receiveAttack");
    const spy2 = jest.spyOn(gameBoard, "checkAllShipsSunk");
    const spy3 = jest.spyOn(gameBoard, "getMissedAttacks");

    setGame();
    playGame(event, gameBoard);

    //check two outgoing command messages
    expect(spy1).toHaveBeenCalledWith(3, 1, console.log); //checks one layer deep (connected to the passed gameBoard)
    spy1.mockRestore();
    expect(spy2).toHaveBeenCalled();
    spy2.mockRestore();
    expect(spy3).toHaveBeenCalled();
    spy3.mockRestore();

    expect(renderGameBoard).toHaveBeenCalled();
  });

  //3
  test("NPC play: call outgoing messages(3)", (done) => {
    // Create a mock implementation for the game board
    const defendingGameBoardMock = {
      getMissedAttacks: jest.fn().mockReturnValue(new Set()),
      getHitAttacks: jest.fn().mockReturnValue(new Set()),
      receiveAttack: jest.fn(),
    };

    setGame();

    // Call the function to test
    playNpcTurn(defendingGameBoardMock);

    // Check that receiveAttack was called
    setTimeout(() => {
      expect(defendingGameBoardMock.getMissedAttacks).toHaveBeenCalled();
      expect(defendingGameBoardMock.getHitAttacks).toHaveBeenCalled();
      expect(defendingGameBoardMock.receiveAttack).toHaveBeenCalled();
      done(); // signal that the test is complete
    }, 2100); // a little longer than the delay in playNpcTurn
  });

  //4
  test("set random ships: outgoing messages(2)", () => {
    const gameBoard1 = createGameBoard();

    const spy1 = jest.spyOn(gameBoard1, "getGameBoard");
    const spy2 = jest.spyOn(gameBoard1, "placeShip");
    // Call the function to test
    setShipsRandom(gameBoard1);

    // Check that receiveAttack was called
    expect(spy1).toHaveBeenCalled();
    spy1.mockRestore();
    expect(spy2).toHaveBeenCalled();
    spy2.mockRestore();
  });
});
