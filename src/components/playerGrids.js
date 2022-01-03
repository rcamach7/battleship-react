import React, { useState } from "react";
import { Ship } from "../logic/Gameboard";
import "../styles/playerGrids.css";

class MainPlayer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: props.player,
			ships: [Ship("Yorktown", 6), Ship("Midway", 4), Ship("Tang", 2)],
			shipsPlaced: 0,
			gameStarted: props.gameStarted,
		};
	}

	handleNewMove(x, y) {
		if (!this.state.gameStarted) {
			this.placeShip(x, y);
		} else {
			const curPlayer = this.state.player;
			// Sends attack AND records if it hit a ship.
			let result = curPlayer.myBoard.receiveAttack([x, y]);
			// If it's a successful hit, we will ask the game board if all ships are sunk.
			if (result === 0) {
				if (this.state.player.myBoard.areShipsSunk()) {
					alert("All enemy ships have been sunk");
				}
			}
			this.setState({
				player: curPlayer,
			});
		}
	}

	placeShip(x, y) {
		const curPlayer = this.state.player;
		const placedShip = curPlayer.myBoard.placeShip(
			this.state.ships[this.state.shipsPlaced],
			x,
			y
		);

		if (!placedShip) {
			alert("Ship does not fit here");
			return;
		}

		this.setState({
			player: curPlayer,
			shipsPlaced: this.state.shipsPlaced + 1,
		});
		// Start game once we set all of our ships.
		if (this.state.shipsPlaced === 2) {
			this.setState({
				gameStarted: true,
				shipsPlaced: 2,
			});
			this.props.handleGameStatus();
		}
	}

	generateBoard() {
		const boardData = this.state.player.myBoard.playerBoard;
		const board = (
			<div id="boardRow">
				{boardData.map((row, rowKey) => {
					return (
						<div key={rowKey} className="row">
							{row.map((col, colKey) => {
								return (
									<div
										key={colKey}
										className="col"
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
		const boardData = this.state.player.myBoard.playerBoard;
		if (boardData[x][y] === null) {
			return "--";
		} else if (boardData[x][y] === -1) {
			return "miss";
		} else if (boardData[x][y].isHitHere(x, y)) {
			return "ship hit";
		} else {
			return "ship";
		}
	}

	render() {
		return (
			<div className="mainPlayer">
				<p>Player Board</p>
				{this.generateBoard()}
				{this.state.gameStarted ? null : (
					<ShipDisplay
						ships={this.state.ships}
						currentShip={this.state.shipsPlaced}
					/>
				)}
			</div>
		);
	}
}

class ComputerAi extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			computer: props.computerAi,
		};
	}

	componentDidMount() {
		const computerAISetup = this.state.computer;

		const ships = [Ship("Akagi", 6), Ship("Mikuma", 4), Ship("Yamato", 2)];
		computerAISetup.myBoard.placeShip(ships[0], 0, 0);
		computerAISetup.myBoard.placeShip(ships[1], 1, 0);
		computerAISetup.myBoard.placeShip(ships[2], 2, 4);

		this.setState({
			computer: computerAISetup,
		});
	}

	determineSymbol(x, y) {
		const boardData = this.state.computer.myBoard.playerBoard;
		if (boardData[x][y] === null) {
			return "--";
		} else if (boardData[x][y] === -1) {
			return "miss";
		} else if (boardData[x][y].isHitHere(x, y)) {
			return "ship hit";
		} else {
			return "--";
		}
	}

	handleNewAttack(x, y) {
		// Will not allow an attack unless game has been started.
		if (!this.props.gameStarted) {
			return;
		}
		const curComputer = this.state.computer;
		// Sends attack AND records if it hit a ship. Then, If it's a successful hit, we will ask the game board if all ships are sunk.
		let attemptAttack = curComputer.myBoard.receiveAttack([x, y]);
		console.log(attemptAttack);
		if (attemptAttack === 0) {
			if (curComputer.myBoard.areShipsSunk()) {
				alert("All enemy ships sunk");
			}
		}
		this.setState({
			computer: curComputer,
		});
	}

	generateBoard() {
		const boardData = this.state.computer.myBoard.playerBoard;
		const board = (
			<div id="boardRow">
				{boardData.map((row, rowKey) => {
					return (
						<div key={rowKey} className="row">
							{row.map((col, colKey) => {
								return (
									<div
										key={colKey}
										className="col"
										onClick={() => this.handleNewAttack(rowKey, colKey)}
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

	render() {
		return (
			<div>
				<p>Computer AI</p>
				<div className="computerAiGrid">{this.generateBoard()}</div>
			</div>
		);
	}
}

// Displays the ship currently being placed on board of player.
const ShipDisplay = (props) => {
	return (
		<div className="shipDisplay">
			<p>Ship Name: {props.ships[props.currentShip].type}</p>
			<p>Ship Size: {props.ships[props.currentShip].size}</p>
			<div className="shipDisplay-sizeDisplay">
				{new Array(props.ships[props.currentShip].size)
					.fill(0)
					.map((sizeSquare, i) => {
						return (
							<div key={i} className="shipDisplay-sizeDisplay-sizeSquare"></div>
						);
					})}
			</div>
		</div>
	);
};

export { ComputerAi, MainPlayer };
