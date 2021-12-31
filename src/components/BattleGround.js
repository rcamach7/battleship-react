import React from "react";
import { BattleShip, Ship, Player, ComputerAI } from "../logic/Gameboard";
import "../styles/gameBoard.css";

class BattleGround extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: Player(""),
		};
	}

	// Loading a test board (simulates a user placing ships into his board)
	componentDidMount() {
		const titoPlayer = Player("tito");

		const yorkTown = Ship("Carrier", 6);
		const ussr = Ship("Battleship", 3);

		titoPlayer.myBoard.placeShip(yorkTown, 9, 0);
		titoPlayer.myBoard.placeShip(ussr, 4, 6);

		// titoPlayer.myBoard.receiveAttack([9, 0]);
		// titoPlayer.myBoard.receiveAttack([0, 1]);
		// titoPlayer.myBoard.receiveAttack([9, 3]);

		this.setState({
			player: titoPlayer,
		});
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
			return "--";
		}
	}

	handleNewAttack(x, y) {
		const curPlayer = this.state.player;
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
			<div className="BattleGrounds">
				<h1>
					Hello World, here we will generate a player board accurately
					represented
				</h1>
				{this.generateBoard()}
			</div>
		);
	}
}

export default BattleGround;
