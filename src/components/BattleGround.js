import React from "react";
import { BattleShip, Ship, Player, ComputerAI } from "../logic/Gameboard";
import "../styles/gameBoard.css";

class BattleGround extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: Player("tito"),
			ships: [Ship("Yorktown", 6), Ship("Midway", 4), Ship("Tang", 2)],
			shipsPlaced: 0,
			gameStarted: false,
			computerAi: ComputerAI(),
		};
	}

	render() {
		return (
			<div className="BattleGround">
				<p>
					{this.state.gameStarted
						? "Attack Enemy Board"
						: "Place Ships on board..."}
				</p>
				<div className="battleGround-battleBoard">
					<div className="playerContainer">
						<MainPlayer
							player={this.state.player}
							ships={this.state.ships}
							shipsPlaced={this.state.shipsPlaced}
							gameStarted={this.state.gameStarted}
						/>

						{this.state.gameStarted ? null : (
							<ShipDisplay
								ships={this.state.ships}
								currentShip={this.state.shipsPlaced}
							/>
						)}
					</div>
					<div className="computerContainer">
						<ComputerAi computerAi={this.state.computerAi} />
					</div>
				</div>
			</div>
		);
	}
}

class MainPlayer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: props.player,
			ships: props.ships,
			shipsPlaced: props.shipsPlaced,
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
			// If it's a successful hit, we will ask the gameboard if all ships are sunk.
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
			</div>
		);
	}
}

const ComputerAi = (props) => {
	const determineSymbol = (x, y) => {
		const boardData = props.computerAi.myBoard.playerBoard;
		if (boardData[x][y] === null) {
			return "--";
		} else if (boardData[x][y] === -1) {
			return "miss";
		} else if (boardData[x][y].isHitHere(x, y)) {
			return "ship hit";
		} else {
			return "ship";
		}
	};

	const generateBoard = () => {
		const boardData = props.computerAi.myBoard.playerBoard;
		const board = (
			<div id="boardRow">
				{boardData.map((row, rowKey) => {
					return (
						<div key={rowKey} className="row">
							{row.map((col, colKey) => {
								return (
									<div key={colKey} className="col">
										{determineSymbol(rowKey, colKey)}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		);
		return board;
	};

	return (
		<div>
			<p>Computer AI</p>
			<div className="computerAiGrid">{generateBoard()}</div>
		</div>
	);
};

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

export default BattleGround;
