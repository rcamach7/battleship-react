const BattleShip = () => {
	// null === no battleship present and hasn't been fired upon by enemy
	// -1 === shot by enemy but no battleship was hit
	const playerBoard = [
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
	];

	// Places ship horizontally in the board.
	const placeShip = (ship, x, y) => {
		if (y + ship.size > 10) {
			return;
		} else {
			for (let yLength = y; yLength < y + ship.size; yLength++) {
				// Let the ship know it's coordinates then place ship in board
				ship.setCoordinates(x, y);
				playerBoard[x][yLength] = ship;
			}
		}
	};

	const receiveAttack = (coordinate) => {
		let x = coordinate[0];
		let y = coordinate[1];
		// no ship is present in this location so we will mark this as shot at (-1)
		if (playerBoard[x][y] === null || playerBoard[x][y] === -1) {
			playerBoard[x][y] = -1;
		} else {
			// Ship exists and now we will send hit coordinates for ship to analyze hit location.
			const currentShip = playerBoard[x][y];
			currentShip.hit(x, y);
		}
	};

	const areShipsSunk = () => {
		for (let row = 0; row < 9; row++) {
			for (let col = 0; col < 9; col++) {
				// Looking for all valid ships
				if (playerBoard[row][col] !== null && playerBoard[row][col] !== -1) {
					if (!playerBoard[row][col].isSunk()) {
						return false;
					}
				}
			}
		}
		return true;
	};

	const printShipStatus = (coordinate) => {
		console.table(playerBoard[coordinate[0]][coordinate[1]].status);
	};

	const printPlayerBoard = () => console.table(playerBoard);

	return {
		placeShip,
		printPlayerBoard,
		areShipsSunk,
		receiveAttack,
		printShipStatus,
	};
};

const Ship = (type, size) => {
	// 1 indicates not hit
	// 0 indicates has been hit
	let y_coordinate = 0;
	const status = new Array(size).fill(1);

	// Analyzed given y_attack cordinate and uses its starting point (y_coordinate) to calculate which position it got hit on.
	const hit = (x_attack, y_attack) => {
		let hitLocation = y_attack - y_coordinate;
		status[hitLocation] = 0;
	};

	const isSunk = () => {
		for (let i = 0; i < status.length; i++) {
			if (status[i] === 1) {
				return false;
			}
		}
		return true;
	};

	// Once ship is placed on a specific coordinate, it takes in that information and stores it to analyze hit locations later on.
	const setCoordinates = (x, y) => {
		y_coordinate = y;
	};

	// x_attack & x for hit() and setCoordinates() to be implemented whenever we allow vertical ship positioning.
	// right now it's not needed but for consistency has been added as arguments
	return {
		size,
		type,
		status,
		y_coordinate,
		hit,
		isSunk,
		setCoordinates,
	};
};

const Player = (playerName) => {
	const myBoard = BattleShip();

	return {
		playerName,
		myBoard,
	};
};

const computerAI = () => {
	const myBoard = BattleShip();

	const moveHistory = [];

	// Will return a coordinate for attack into the enemy board
	const generateAttack = (enemyBoard) => {
		let x = Math.floor(Math.random() * 10);
		let y = Math.floor(Math.random() * 10);

		for (let i = 0; i < moveHistory.length; i++) {
			if (moveHistory[i][0] === x && moveHistory[i][1] === y) {
				x = Math.floor(Math.random() * 10);
				y = Math.floor(Math.random() * 10);

				i = 0;
			}
		}

		moveHistory.push([x, y]);
		return [x, y];
	};

	return {
		myBoard,
		moveHistory,
		generateAttack,
	};
};

// Testing Data
// const elonMusk = computerAI();
// const yoshiro = Ship("Carrier", 6);
// elonMusk.myBoard.placeShip(yoshiro, 0, 0);
// // console.table(elonMusk.myBoard.printPlayerBoard());

// const tito = Player("tito");
// const yorkTown = Ship("Carrier", 6);
// tito.myBoard.placeShip(yorkTown, 9, 0);

// tito.myBoard.receiveAttack([9, 0]);
// tito.myBoard.receiveAttack([9, 1]);
// tito.myBoard.receiveAttack([9, 2]);
// tito.myBoard.receiveAttack(elonMusk.generateAttack());
// tito.myBoard.receiveAttack(elonMusk.generateAttack());
// tito.myBoard.receiveAttack(elonMusk.generateAttack());
// tito.myBoard.receiveAttack(elonMusk.generateAttack());
// tito.myBoard.receiveAttack(elonMusk.generateAttack());
// tito.myBoard.receiveAttack(elonMusk.generateAttack());
// tito.myBoard.receiveAttack(elonMusk.generateAttack());
// tito.myBoard.receiveAttack(elonMusk.generateAttack());
// tito.myBoard.receiveAttack(elonMusk.generateAttack());
// console.log(tito.myBoard.printPlayerBoard());

// export default BattleShip;
