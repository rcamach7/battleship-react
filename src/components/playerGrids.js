import React from "react";
import { Ship } from "../logic/Gameboard";
import "../styles/playerGrids.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class MainPlayer extends React.Component {
  handleNewMove(x, y) {
    if (!this.props.gameStarted) {
      this.placeShip(x, y);
    } else {
      alert("Time to attack the enemy sir!");
    }
  }

  placeShip(x, y) {
    const curPlayer = this.props.player;
    const placedShip = curPlayer.myBoard.placeShip(
      this.props.ships[this.props.currentShip],
      x,
      y,
      this.props.normalAxis
    );

    // Evaluate if we have succesfully placed a ship.
    if (!placedShip) {
      alert("Ship does not fit here!");
      return;
    }
    this.props.handleCurrentShip(this.props.currentShip + 1);

    // Check if set-up is finished, if so, we start game.
    if (this.props.currentShip === 2) {
      this.props.handleGameStatus();
      this.props.handleGameStatusCode(1);
    }
  }

  generateBoard() {
    const boardData = this.props.player.myBoard.playerBoard;
    const board = (
      <div id="boardRow">
        {boardData.map((row, rowKey) => {
          return (
            <div key={rowKey} className="row">
              {row.map((col, colKey) => {
                return (
                  <div
                    key={colKey}
                    className="col player-col"
                    onClick={() => this.handleNewMove(rowKey, colKey)}
                  >
                    {this.determineSymbol(rowKey, colKey)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
    return board;
  }

  determineSymbol(x, y) {
    const boardData = this.props.player.myBoard.playerBoard;
    if (boardData[x][y] === null) {
      return <FontAwesomeIcon icon="water" size="1x" />;
    } else if (boardData[x][y] === -1) {
      return "";
    } else if (boardData[x][y].isHitHere(x, y)) {
      return <FontAwesomeIcon icon="bullseye" className="hit" size="1x" />;
    } else {
      return <FontAwesomeIcon icon="anchor" size="1x" />;
    }
  }

  render() {
    return (
      <div className="mainPlayer">
        <p className="playerNames">United States Navy</p>
        {this.generateBoard()}
      </div>
    );
  }
}

class ComputerAi extends React.Component {
  componentDidMount() {
    // Set up japanese fleet
    const computerAISetup = this.props.computerAi;

    const ships = [Ship("Akagi", 6), Ship("Mikuma", 4), Ship("Yamato", 2)];
    computerAISetup.myBoard.placeShip(ships[0], 0, 0, true);
    computerAISetup.myBoard.placeShip(ships[1], 5, 3, true);
    computerAISetup.myBoard.placeShip(ships[2], 7, 4, true);

    this.props.handleComputerChange(computerAISetup);
  }

  receiveAttack(x, y) {
    // Will not allow an attack unless game has been started or if attempting to striking a location already struck.
    if (!this.props.gameStarted) {
      return;
    } else if (this.props.computerAi.myBoard.isRepeatedAttack([x, y])) {
      return;
    }

    // Sends attack AND records if it hit a ship. Then, If it's a successful hit, we will ask the game board if all ships are sunk.
    const curComputer = this.props.computerAi;
    let attemptAttack = curComputer.myBoard.receiveAttack([x, y]);
    if (attemptAttack === 0) {
      // Check if the successful attack has won the game.
      if (curComputer.myBoard.areShipsSunk()) {
        this.props.handleGameStatusCode(2);
      }
      // Since it is a successful attack by the player - we will not allow the computer to send an attack. Player can attack again.
      this.props.handleComputerChange(curComputer);
      return;
    }
    this.props.handleComputerChange(curComputer);
    if (attemptAttack === 0) {
      return;
    }
    this.returnAttack();
  }

  returnAttack() {
    // Now that we have received an attack, it's our turn to send out an attack.
    const curPlayer = this.props.player;
    const generateAttack = this.props.computerAi.generateAttack();

    // If computer strikes a ship - it will send another attack, until it misses!
    let attemptAttack = curPlayer.myBoard.receiveAttack(generateAttack);
    while (attemptAttack === 0) {
      let anotherAttack = this.props.computerAi.generateAttack();
      attemptAttack = curPlayer.myBoard.receiveAttack(anotherAttack);
    }

    this.props.handleAutoAttack(curPlayer);
    // Handle computer win
    if (curPlayer.myBoard.areShipsSunk()) {
      this.props.handleGameStatusCode(3);
    }
  }

  generateBoard() {
    const boardData = this.props.computerAi.myBoard.playerBoard;
    const board = (
      <div id="boardRow">
        {boardData.map((row, rowKey) => {
          return (
            <div key={rowKey} className="row">
              {row.map((col, colKey) => {
                return (
                  <div
                    key={colKey}
                    className="col computer-col"
                    onClick={() => this.receiveAttack(rowKey, colKey)}
                  >
                    {this.determineSymbol(rowKey, colKey)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
    return board;
  }

  determineSymbol(x, y) {
    const boardData = this.props.computerAi.myBoard.playerBoard;
    if (boardData[x][y] === null) {
      return <FontAwesomeIcon icon="water" size="1x" />;
    } else if (boardData[x][y] === -1) {
      return "";
    } else if (boardData[x][y].isHitHere(x, y)) {
      return <FontAwesomeIcon icon="bullseye" className="hit" size="1x" />;
    } else {
      return <FontAwesomeIcon icon="water" size="1x" />;
    }
  }

  render() {
    return (
      <div>
        <p className="playerNames">Japanese Empire Navy</p>
        <div className="computerAiGrid">{this.generateBoard()}</div>
      </div>
    );
  }
}

export { ComputerAi, MainPlayer };
