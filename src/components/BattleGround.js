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

	// Loading a test board
	componentDidMount() {
		const player = Player("tito");
		const testBoard = player.myBoard.playerBoard;

		this.setState({
			boardData: testBoard,
		});
	}

	generateBoard() {
		const board = (
			<div id="boardRow">
				{this.state.boardData.map((row, i) => {
					return (
						<div key={i} className="row">
							{row.map((col, i) => {
								return (
									<div key={i} className="col">
										X
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
