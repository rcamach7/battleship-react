import BattleShip from "./logic/Gameboard";
import React from "react";

class App extends React.Component {
	componentDidMount() {
		BattleShip.testShips();
	}

	render() {
		return <div>Hello World</div>;
	}
}

export default App;
