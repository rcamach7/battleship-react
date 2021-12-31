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
			<div className="BattleGround">
				<p>
					{this.state.gameStarted
						? "Attack Enemy Board"
						: "Place Ships on board..."}
				</p>
				{this.generateBoard()}
				<button
					onClick={() => console.table(this.state.player.myBoard.playerBoard)}
				>
					Print Player Board
				</button>
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

const ShipDisplay = (props) => {
	return (
		<div className="shipDisplay">
			<p>Ship Name: {props.ships[props.currentShip].type}</p>
			<p>Ship Size: {props.ships[props.currentShip].size}</p>
			<div className="sizeDisplay">
				{new Array(props.ships[props.currentShip].size)
					.fill(0)
					.map((sizeSquare, i) => {
						return <div key={i} className="sizeSquare"></div>;
					})}
			</div>
		</div>
	);
};

export default BattleGround;