import React from "react";
import "./styles/App.css";
import BattleGround from "./components/BattleGround";

class App extends React.Component {
	render() {
		return (
			<div className="App">
				<header className="title-container">
					<h1>WW2 BattleShip Game</h1>
				</header>

				<BattleGround />
			</div>
		);
	}
}

export default App;
