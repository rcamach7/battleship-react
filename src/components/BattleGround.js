import React from "react";
import { MainPlayer, ComputerAi } from "./playerGrids";
import { Player, ComputerAI, Ship } from "../logic/Gameboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/BattleGround.css";

class BattleGround extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			player: Player("tito"),
			computerAi: ComputerAI(),
			gameStarted: false,
			ships: [Ship("Yorktown", 6), Ship("Midway", 4), Ship("Tang", 2)],
			currentShip: 0,
			normalAxis: true,
			gameStatus: [
				"Place Ships on board...",
				"Attack Enemy Board!",
				"Victory! WW2 shifts in our favor!",
				"Defeated by the Japanese!",
			],
			gameStatusCode: 0,
		};
		this.handleGameStatus = this.handleGameStatus.bind(this);
		this.handleAutoAttack = this.handleAutoAttack.bind(this);
		this.handleCurrentShip = this.handleCurrentShip.bind(this);
		this.toggleAxis = this.toggleAxis.bind(this);
		this.handleGameStatusCode = this.handleGameStatusCode.bind(this);
	}

	handleGameStatusCode(statusCodeIn) {
		this.setState({
			gameStatusCode: statusCodeIn,
		});
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

	toggleAxis() {
		if (this.state.normalAxis === true) {
			this.setState({
				normalAxis: false,
			});
		} else {
			this.setState({
				normalAxis: true,
			});
		}
	}

	render() {
		return (
			<div className="BattleGround">
				<p className="gameStatus">
					{this.state.gameStatus[this.state.gameStatusCode]}
				</p>
				{this.state.gameStarted ? null : (
					<ShipDisplay
						ships={this.state.ships}
						currentShip={this.state.currentShip}
						normalAxis={this.state.normalAxis}
						toggleAxis={() => this.toggleAxis()}
					/>
				)}
				<div className="battleGround-battleBoard">
					<MainPlayer
						player={this.state.player}
						gameStarted={this.state.gameStarted}
						handleGameStatus={() => this.handleGameStatus()}
						handleCurrentShip={this.handleCurrentShip}
						normalAxis={this.state.normalAxis}
						handleGameStatusCode={this.handleGameStatusCode}
					/>
					<ComputerAi
						computerAi={this.state.computerAi}
						gameStarted={this.state.gameStarted}
						player={this.state.player}
						handleAutoAttack={() => this.handleAutoAttack()}
						handleGameStatusCode={this.handleGameStatusCode}
					/>
				</div>
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
			<p className="shipDisplay-description axis">
				Axis:
				{props.normalAxis ? (
					<button onClick={() => props.toggleAxis()}>
						<FontAwesomeIcon icon="arrows-alt-h" size="1x" />
					</button>
				) : (
					<button onClick={() => props.toggleAxis()}>
						<FontAwesomeIcon icon="arrows-alt-v" size="1x" />
					</button>
				)}
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
