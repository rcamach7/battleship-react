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

  const attackHistory = [];

  // Places ship horizontally in the board. If Normal axis is true then we perform a horizontal placement
  const placeShip = (ship, x, y, normalAxis) => {
    // Before running any of the below code, we must check if it's a valid spot.
    if (playerBoard[x][y] !== null) {
      return false;
    }
    if (normalAxis) {
      for (let yLength = y; yLength < y + ship.size; yLength++) {
        if (playerBoard[x][yLength] !== null) {
          return false;
        }
      }
    } else {
      for (let xLength = x; xLength < x + ship.size; xLength++) {
        if (playerBoard[xLength][y] !== null) {
          return false;
        }
      }
    }

    // Now we can safely place the ship knowing it's not colliding with another one.
    if (normalAxis) {
      for (let yLength = y; yLength < y + ship.size; yLength++) {
        // Let the ship know it's coordinates then place ship in board
        ship.setCoordinates(x, y);
        playerBoard[x][yLength] = ship;
      }
      return true;
    } else {
      // Opposite Axis Placement
      for (let xLength = x; xLength < x + ship.size; xLength++) {
        // Let the ship know it's coordinates then place ship in board
        ship.setCoordinates(x, y);
        playerBoard[xLength][y] = ship;
      }
      return true;
    }
  };

  const receiveAttack = (coordinate) => {
    let x = coordinate[0];
    let y = coordinate[1];
    // Record attack history
    attackHistory.push(coordinate);

    // no ship is present in this location so we will mark this as shot at (-1)
    if (playerBoard[x][y] === null || playerBoard[x][y] === -1) {
      playerBoard[x][y] = -1;
      return -1;
    } else {
      // Ship exists and now we will send hit coordinates for ship to analyze hit location.
      const currentShip = playerBoard[x][y];
      currentShip.hit(x, y);
      return 0;
    }
  };

  const isRepeatedAttack = (coordinate) => {
    for (let i = 0; i < attackHistory.length; i++) {
      if (
        attackHistory[i][0] === coordinate[0] &&
        attackHistory[i][1] === coordinate[1]
      ) {
        return true;
      }
    }
    return false;
  };

  const areShipsSunk = () => {
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
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

  return {
    playerBoard,
    placeShip,
    areShipsSunk,
    receiveAttack,
    isRepeatedAttack,
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

  const isHitHere = (x_attack, y_attack) => {
    let hitLocation = y_attack - y_coordinate;
    if (status[hitLocation] === 1) {
      return false;
    } else {
      return true;
    }
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
    isHitHere,
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

const ComputerAI = () => {
  const myBoard = BattleShip();

  const moveHistory = [];

  // Will return a coordinate for attack into the enemy board
  const generateAttack = () => {
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

export { BattleShip, Ship, Player, ComputerAI };
