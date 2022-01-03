import React from "react";
import { MainPlayer, ComputerAi } from "./playerGrids";
import { Player, ComputerAI } from "../logic/Gameboard";
import "../styles/gameBoard.css";

class BattleGround extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: Player("tito"),
			gameStarted: false,
			computerAi: ComputerAI(),
		};
		this.handleGameStatus = this.handleGameStatus.bind(this);
	}

	handleGameStatus() {
		this.setState({
			gameStarted: true,
		});
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
					<MainPlayer
						player={this.state.player}
						gameStarted={this.state.gameStarted}
						handleGameStatus={() => this.handleGameStatus()}
					/>
					<ComputerAi
						computerAi={this.state.computerAi}
						gameStarted={this.state.gameStarted}
					/>
				</div>
			</div>
		);
	}
}

export default BattleGround;
