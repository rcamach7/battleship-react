import React from "react";
import { BattleShip, Ship, Player, ComputerAI } from "../logic/Gameboard";
import "../styles/gameBoard.css";

class BattleGround extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			boardData: [[]],
		};
	}

	// Loading a test board (simulates a user placing ships into his board)
	componentDidMount() {
		const titoPlayer = Player("tito");
		const yorkTown = Ship("Carrier", 6);
		const ussr = Ship("Battleship", 3);

		titoPlayer.myBoard.placeShip(yorkTown, 9, 0);
		titoPlayer.myBoard.placeShip(ussr, 4, 6);

		titoPlayer.myBoard.receiveAttack([9, 0]);
		titoPlayer.myBoard.receiveAttack([0, 1]);
		titoPlayer.myBoard.receiveAttack([9, 3]);

		const testBoard = titoPlayer.myBoard.playerBoard;
		this.setState({
			boardData: testBoard,
		});
	}

	determineSymbol(x, y) {
		const { boardData } = this.state;
		if (boardData[x][y] === null) {
			return "null";
		} else if (boardData[x][y] === -1) {
			return "miss";
		} else if (boardData[x][y].isHitHere(x, y)) {
			return "ship hit";
		} else {
			return "ship";
		}
	}

	handleNewAttack(x, y) {
		alert(`You have clicked on box ${x} and ${y}`);
	}

	generateBoard() {
		const board = (
			<div id="boardRow">
				{this.state.boardData.map((row, rowKey) => {
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
