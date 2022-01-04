import React from "react";
import { Ship } from "../logic/Gameboard";
import "../styles/playerGrids.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class MainPlayer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: props.player,
			ships: [Ship("Yorktown", 6), Ship("Midway", 4), Ship("Tang", 2)],
			shipsPlaced: 0,
		};
	}

	handleNewMove(x, y) {
		if (!this.state.gameStarted) {
			this.placeShip(x, y);
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
		this.props.handleCurrentShip(this.state.shipsPlaced + 1);
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
		const boardData = this.state.player.myBoard.playerBoard;
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
	constructor(props) {
		super(props);
		this.state = {
			computer: props.computerAi,
			player: props.player,
		};
	}

	componentDidMount() {
		const computerAISetup = this.state.computer;

		const ships = [Ship("Akagi", 6), Ship("Mikuma", 4), Ship("Yamato", 2)];
		computerAISetup.myBoard.placeShip(ships[0], 0, 0);
		computerAISetup.myBoard.placeShip(ships[1], 5, 3);
		computerAISetup.myBoard.placeShip(ships[2], 7, 4);

		this.setState({
			computer: computerAISetup,
		});
	}

	determineSymbol(x, y) {
		const boardData = this.state.computer.myBoard.playerBoard;
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

	handleNewAttack(x, y) {
		// Will not allow an attack unless game has been started.
		if (!this.props.gameStarted) {
			return;
		}
		// Before sending an attack - make sure we aren't (as a player) attacking an area already struck.
		const curComputer = this.state.computer;
		if (curComputer.myBoard.isRepeatedAttack([x, y])) {
			return;
		}

		// Sends attack AND records if it hit a ship. Then, If it's a successful hit, we will ask the game board if all ships are sunk.
		let attemptAttack = curComputer.myBoard.receiveAttack([x, y]);
		if (attemptAttack === 0) {
			if (curComputer.myBoard.areShipsSunk()) {
				alert("Victory! All Japanese ships sunk!");
			}
		}
		this.setState({
			computer: curComputer,
		});

		// Now that we have received an attack, it's our turn to send out an attack.
		const curPlayer = this.state.player;
		const generateAttack = this.state.computer.generateAttack();
		curPlayer.myBoard.receiveAttack(generateAttack);

		this.setState({
			player: curPlayer,
		});
		this.props.handleAutoAttack(curPlayer);
		// Alert if computer has won
		if (curPlayer.myBoard.areShipsSunk()) {
			alert("Defeat! All American ships sunk");
		}
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
										className="col computer-col"
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
				<p className="playerNames">Japanese Empire Navy</p>
				<div className="computerAiGrid">{this.generateBoard()}</div>
			</div>
		);
	}
}

export { ComputerAi, MainPlayer };
