import React from "react";
import { MainPlayer, ComputerAi } from "./playerGrids";
import { Player, ComputerAI, Ship } from "../logic/Gameboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/gameBoard.css";

class BattleGround extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: Player("tito"),
			computerAi: ComputerAI(),
			gameStarted: false,
			ships: [Ship("Yorktown", 6), Ship("Midway", 4), Ship("Tang", 2)],
			currentShip: 0,
		};
		this.handleGameStatus = this.handleGameStatus.bind(this);
		this.handleAutoAttack = this.handleAutoAttack.bind(this);
		this.handleCurrentShip = this.handleCurrentShip.bind(this);
	}

	handleCurrentShip(currentShipIn) {
		this.setState({
			currentShip: currentShipIn,
		});
	}

	handleGameStatus() {
		this.setState({
			gameStarted: true,
		});
	}

	handleAutoAttack(playerIn) {
		this.setState({
			player: playerIn,
		});
	}

	render() {
		return (
			<div className="BattleGround">
				<div className="battleGround-battleBoard">
					<MainPlayer
						player={this.state.player}
						gameStarted={this.state.gameStarted}
						handleGameStatus={() => this.handleGameStatus()}
						handleCurrentShip={this.handleCurrentShip}
					/>
					<ComputerAi
						computerAi={this.state.computerAi}
						gameStarted={this.state.gameStarted}
						player={this.state.player}
						handleAutoAttack={() => this.handleAutoAttack()}
					/>
				</div>
				<p className="gameStatus">
					{this.state.gameStarted
						? "Attack Enemy Board!"
						: "Place Ships on board..."}
				</p>
				{this.state.gameStarted ? null : (
					<ShipDisplay
						ships={this.state.ships}
						currentShip={this.state.currentShip}
					/>
				)}
			</div>
		);
	}
}

const ShipDisplay = (props) => {
	return (
		<div className="shipDisplay">
			<p className="shipDisplay-status">Current Ship:</p>
			<p className="shipDisplay-description">
				Name: {props.ships[props.currentShip].type}
			</p>
			<p className="shipDisplay-description">
				Size: {props.ships[props.currentShip].size}
			</p>
			<div className="shipDisplay-sizeDisplay">
				{new Array(props.ships[props.currentShip].size)
					.fill(0)
					.map((sizeSquare, i) => {
						return (
							<div key={i} className="shipDisplay-sizeDisplay-sizeSquare">
								<FontAwesomeIcon icon="anchor" size="1x" />
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default BattleGround;
