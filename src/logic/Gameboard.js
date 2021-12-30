const BattleShip = (() => {
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

	const receiveAttack = (x, y) => {
		// no ship is present in this location so we will mark this as shot at (-1)
		if (playerBoard[x][y] === null) {
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

	const printPlayerBoard = () => console.table(playerBoard);

	// Tester Function
	const testShips = () => {
		// Create ship and place in specific spot and print board
		const carrier = Ship("Carrier", 6);
		placeShip(carrier, 0, 4);

		// Shoot at an empty spot in the board and print board
		receiveAttack(0, 0);
		receiveAttack(2, 5);

		// Shoot directly at ship and print board (right at beginning of ship)
		receiveAttack(0, 4);
		receiveAttack(0, 5);
		receiveAttack(0, 6);
		receiveAttack(0, 7);
		receiveAttack(0, 8);
		receiveAttack(0, 9);

		console.log(areShipsSunk());
	};

	return {
		placeShip,
		testShips,
		printPlayerBoard,
		areShipsSunk,
	};
})();

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

export default BattleShip;
