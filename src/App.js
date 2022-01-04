import React from "react";
import "./styles/App.css";
import BattleGround from "./components/BattleGround";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
	faWater,
	faBullseye,
	faAnchor,
	faRedo,
	faArrowsAltH,
	faArrowsAltV,
} from "@fortawesome/free-solid-svg-icons";

class App extends React.Component {
	render() {
		return (
			<div className="App">
				<header className="title-container">
					<h1>Battle Of Midway</h1>
				</header>

				<BattleGround />
			</div>
		);
	}
}

library.add(
	fab,
	faWater,
	faBullseye,
	faAnchor,
	faRedo,
	faArrowsAltH,
	faArrowsAltV
);

export default App;
