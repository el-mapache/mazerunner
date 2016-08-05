'use strict';

/*
GAME
 */
const POINTS_TO_WIN = 5;

let gameState = {
  rows: 5,
  columns: 5,
  playerColumn: 2,
  cpuColumn: 1,
  wallRow: 0,
  openingColumn: 0,
  playerValue: 2,
  cpuValue: 3,
  playerAndCpuValue: 4,
  points: 0,
  cpuPoints: 0,
  cpuPoints: 0,
  gameBoard: []
};

function changeState(stateChange) {
  const nextState = Object.assign({}, gameState, stateChange);

  gameState = compose(nextState, [
    generateBoard,
    addWall,
    addCPU,
    addPlayer,
    addOverlap,
    checkCollision,
    checkWinCondition
  ]);
}

function generateBoard(gameState) {
  const { rows, columns } = gameState;
  const gameBoard = [];

  for (var row = 0; row < rows; row++) {
    gameBoard.push([]);

    for (var column = 0; column < columns; column++) {
      gameBoard[row].push(0);
    }
  }

  return Object.assign({}, gameState, { gameBoard });
}

function addWall(gameState) {
  const { gameBoard, wallRow, openingColumn } = gameState;
  const nextGameBoard = gameBoard.slice();

  nextGameBoard[wallRow] = [1, 1, 1, 1, 1];
  nextGameBoard[wallRow][openingColumn] = 0;

  return Object.assign({}, gameState, { gameBoard: nextGameBoard });
}

function addPlayer(gameState) {
  const { playerColumn, playerValue } = gameState;
  const { rows, gameBoard } = gameState;

  gameBoard[rows - 1][playerColumn] = playerValue;

  return Object.assign({}, gameState, { gameBoard });
}

function addCPU(gameState) {
  const { cpuColumn, cpuValue } = gameState;
  const { rows, gameBoard } = gameState;

  gameBoard[rows - 1][cpuColumn] = cpuValue;

  return Object.assign({}, gameState, { gameBoard });
}

function addOverlap(gameState) {
  const { cpuColumn, playerColumn, playerAndCpuValue } = gameState;
  const { rows, gameBoard } = gameState;

  if (cpuColumn === playerColumn) {
    gameBoard[rows - 1][playerColumn] = playerAndCpuValue;
  }

  return Object.assign({}, gameState, { gameBoard });
}

function checkCollision(gameState) {
  const { playerColumn, cpuColumn, wallRow, rows, openingColumn, points, cpuPoints } = gameState;
  let nextPoints = points;
  let nextCpuPoints = cpuPoints;

  if (wallRow === rows - 1) {
    nextPoints = playerColumn === openingColumn ? points + 1 : 0;
    nextCpuPoints = cpuColumn === openingColumn ? cpuPoints + 1 : 0;
  }

  if (cpuPoints !== 0 && nextCpuPoints === 0) {
    onCpuDead();
  }

  return Object.assign({}, gameState, { points: nextPoints, cpuPoints: nextCpuPoints });
}

function checkWinCondition(gameState) {
  const { points, cpuPoints } = gameState;
  let gameOver = false;
  let nextPoints = {};

  if (points === POINTS_TO_WIN) {
    alert('player wins');
    gameOver = true;
  } else if (cpuPoints === POINTS_TO_WIN) {
    alert('cpu wins');
    gameOver = true;
  }

  if (gameOver) {
    nextPoints = {
      points: 0,
      cpuPoints: 0
    };
  }

  return Object.assign({}, gameState, nextPoints);
}

function render(nextState) {
  const { gameBoard, playerValue, points, cpuPoints, cpuValue, playerAndCpuValue } = nextState;

  // Clear the table
  const el = document.getElementById('table');
  el.innerHTML = ''

  document.getElementById('points').innerHTML = points;
  document.getElementById('cpuPoints').innerHTML = cpuPoints;

  const table = document.createElement('table');

  gameBoard.forEach((row) => {
    const tr = document.createElement('tr');

    row.forEach((col) => {
      const td = document.createElement('td');
      const className = (function() {
        switch(col) {
            case 0: return 'empty';
            case 1: return 'filled';
            case playerValue: return 'player';
            case cpuValue: return 'cpu';
            case playerAndCpuValue: return 'playerAndCpu';
        }
      })();
      td.className = className;

      tr.appendChild(td);
    });

    table.appendChild(tr);
  });

  el.appendChild(table);
}

function compose(gameState, transforms) {
  let nextState = gameState;

  transforms.forEach(function(transform) {
    nextState = transform(nextState);
  });

  return nextState;
}

function renderGame() {
  render(gameState);

  window.requestAnimationFrame(renderGame);
}

function onNewMaze() {
  console.log("New Maze");
}

function onCpuDead() {
  console.log("Cpu Dead");
}

// Move the wall down
setInterval(function() {
  const { wallRow, openingColumn, rows, columns } = gameState;
  let nextOpeningColumn = openingColumn;
  let nextWallRow = wallRow + 1;
  if (nextWallRow > rows - 1) {
    nextWallRow = 0;
    nextOpeningColumn = Math.round(Math.random() * (columns - 1));
  }

  if (nextWallRow === 0) {
    onNewMaze();
  }

  changeState({ wallRow: nextWallRow, openingColumn: nextOpeningColumn });
}, 250);

window.addEventListener('keydown', handleMove)

/*
PLAYER
 */

function handleMove(e) {
  const keyCode = e.keyCode;

  switch(keyCode) {
    case 37:
        playerLeft();
        break;
    case 39:
        playerRight();
        break;
      case 65:
        cpuLeft();
        break;
      case 83:
        cpuRight();
        break;
  }
}

function playerLeft() {
  const { playerColumn, rows, wallRow } = gameState;
  const wallAtPlayer = gameState.wallRow === rows - 1;

  if (!wallAtPlayer) {
    const nextPlayerColumn = playerColumn ? playerColumn - 1 : 0;
    changeState({ playerColumn: nextPlayerColumn });
  }
}

function playerRight() {
  const { playerColumn, rows, columns, wallRow } = gameState;
  const wallAtPlayer = gameState.wallRow === rows - 1;

  if (!wallAtPlayer) {
    const nextPlayerColumn = playerColumn === columns - 1 ? columns - 1 : playerColumn + 1;
    changeState({ playerColumn: nextPlayerColumn });
  }
}

function cpuLeft() {
  const { cpuColumn, rows, wallRow } = gameState;
  const wallAtPlayer = gameState.wallRow === rows - 1;

  if (!wallAtPlayer) {
    const nextCpuColumn = cpuColumn ? cpuColumn - 1 : 0;
    changeState({ cpuColumn: nextCpuColumn });
  }
}

function cpuRight() {
  const { cpuColumn, rows, columns, wallRow } = gameState;
  const wallAtPlayer = gameState.wallRow === rows - 1;

  if (!wallAtPlayer) {
    const nextCpuColumn = cpuColumn === columns - 1 ? columns - 1 : cpuColumn + 1;
    changeState({ cpuColumn: nextCpuColumn });
  }
}


renderGame();
