'use strict';

/*
GAME
 */

var _gameState;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var POINTS_TO_WIN = 5;

var gameState = (_gameState = {
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
  cpuPoints: 0
}, _defineProperty(_gameState, 'cpuPoints', 0), _defineProperty(_gameState, 'gameBoard', []), _gameState);

function changeState(stateChange) {
  var nextState = Object.assign({}, gameState, stateChange);

  gameState = compose(nextState, [generateBoard, addWall, addCPU, addPlayer, addOverlap, checkCollision, checkWinCondition]);
}

function generateBoard(gameState) {
  var rows = gameState.rows;
  var columns = gameState.columns;

  var gameBoard = [];

  for (var row = 0; row < rows; row++) {
    gameBoard.push([]);

    for (var column = 0; column < columns; column++) {
      gameBoard[row].push(0);
    }
  }

  return Object.assign({}, gameState, { gameBoard: gameBoard });
}

function addWall(gameState) {
  var gameBoard = gameState.gameBoard;
  var wallRow = gameState.wallRow;
  var openingColumn = gameState.openingColumn;

  var nextGameBoard = gameBoard.slice();

  nextGameBoard[wallRow] = [1, 1, 1, 1, 1];
  nextGameBoard[wallRow][openingColumn] = 0;

  return Object.assign({}, gameState, { gameBoard: nextGameBoard });
}

function addPlayer(gameState) {
  var playerColumn = gameState.playerColumn;
  var playerValue = gameState.playerValue;
  var rows = gameState.rows;
  var gameBoard = gameState.gameBoard;


  gameBoard[rows - 1][playerColumn] = playerValue;

  return Object.assign({}, gameState, { gameBoard: gameBoard });
}

function addCPU(gameState) {
  var cpuColumn = gameState.cpuColumn;
  var cpuValue = gameState.cpuValue;
  var rows = gameState.rows;
  var gameBoard = gameState.gameBoard;


  gameBoard[rows - 1][cpuColumn] = cpuValue;

  return Object.assign({}, gameState, { gameBoard: gameBoard });
}

function addOverlap(gameState) {
  var cpuColumn = gameState.cpuColumn;
  var playerColumn = gameState.playerColumn;
  var playerAndCpuValue = gameState.playerAndCpuValue;
  var rows = gameState.rows;
  var gameBoard = gameState.gameBoard;


  if (cpuColumn === playerColumn) {
    gameBoard[rows - 1][playerColumn] = playerAndCpuValue;
  }

  return Object.assign({}, gameState, { gameBoard: gameBoard });
}

function checkCollision(gameState) {
  var playerColumn = gameState.playerColumn;
  var cpuColumn = gameState.cpuColumn;
  var wallRow = gameState.wallRow;
  var rows = gameState.rows;
  var openingColumn = gameState.openingColumn;
  var points = gameState.points;
  var cpuPoints = gameState.cpuPoints;

  var nextPoints = points;
  var nextCpuPoints = cpuPoints;

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
  var points = gameState.points;
  var cpuPoints = gameState.cpuPoints;

  var gameOver = false;
  var nextPoints = {};

  if (points === POINTS_TO_WIN) {
    //alert('player wins');
    gameOver = true;
  } else if (cpuPoints === POINTS_TO_WIN) {
    //alert('cpu wins');
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
  var gameBoard = nextState.gameBoard;
  var playerValue = nextState.playerValue;
  var points = nextState.points;
  var cpuPoints = nextState.cpuPoints;
  var cpuValue = nextState.cpuValue;
  var playerAndCpuValue = nextState.playerAndCpuValue;

  // Clear the table

  var el = document.getElementById('table');
  el.innerHTML = '';

  document.getElementById('points').innerHTML = points;
  document.getElementById('cpuPoints').innerHTML = cpuPoints;

  var table = document.createElement('table');

  gameBoard.forEach(function (row) {
    var tr = document.createElement('tr');

    row.forEach(function (col) {
      var td = document.createElement('td');
      var className = function () {
        switch (col) {
          case 0:
            return 'empty';
          case 1:
            return 'filled';
          case playerValue:
            return 'player';
          case cpuValue:
            return 'cpu';
          case playerAndCpuValue:
            return 'playerAndCpu';
        }
      }();
      td.className = className;

      tr.appendChild(td);
    });

    table.appendChild(tr);
  });

  el.appendChild(table);
}

function compose(gameState, transforms) {
  var nextState = gameState;

  transforms.forEach(function (transform) {
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
setInterval(function () {
  var _gameState2 = gameState;
  var wallRow = _gameState2.wallRow;
  var openingColumn = _gameState2.openingColumn;
  var rows = _gameState2.rows;
  var columns = _gameState2.columns;

  var nextOpeningColumn = openingColumn;
  var nextWallRow = wallRow + 1;
  if (nextWallRow > rows - 1) {
    nextWallRow = 0;
    nextOpeningColumn = Math.round(Math.random() * (columns - 1));
  }

  if (nextWallRow === 0) {
    onNewMaze();
  }

  changeState({ wallRow: nextWallRow, openingColumn: nextOpeningColumn });
}, 250);

window.addEventListener('keydown', handleMove);

/*
PLAYER
 */

function handleMove(e) {
  var keyCode = e.keyCode;

  switch (keyCode) {
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
  var _gameState3 = gameState;
  var playerColumn = _gameState3.playerColumn;
  var rows = _gameState3.rows;
  var wallRow = _gameState3.wallRow;

  var wallAtPlayer = gameState.wallRow === rows - 1;

  if (!wallAtPlayer) {
    var nextPlayerColumn = playerColumn ? playerColumn - 1 : 0;
    changeState({ playerColumn: nextPlayerColumn });
  }
}

function playerRight() {
  var _gameState4 = gameState;
  var playerColumn = _gameState4.playerColumn;
  var rows = _gameState4.rows;
  var columns = _gameState4.columns;
  var wallRow = _gameState4.wallRow;

  var wallAtPlayer = gameState.wallRow === rows - 1;

  if (!wallAtPlayer) {
    var nextPlayerColumn = playerColumn === columns - 1 ? columns - 1 : playerColumn + 1;
    changeState({ playerColumn: nextPlayerColumn });
  }
}

function cpuLeft() {
  var _gameState5 = gameState;
  var cpuColumn = _gameState5.cpuColumn;
  var rows = _gameState5.rows;
  var wallRow = _gameState5.wallRow;

  var wallAtPlayer = gameState.wallRow === rows - 1;

  if (!wallAtPlayer) {
    var nextCpuColumn = cpuColumn ? cpuColumn - 1 : 0;
    changeState({ cpuColumn: nextCpuColumn });
  }
}

function cpuRight() {
  var _gameState6 = gameState;
  var cpuColumn = _gameState6.cpuColumn;
  var rows = _gameState6.rows;
  var columns = _gameState6.columns;
  var wallRow = _gameState6.wallRow;

  var wallAtPlayer = gameState.wallRow === rows - 1;

  if (!wallAtPlayer) {
    var nextCpuColumn = cpuColumn === columns - 1 ? columns - 1 : cpuColumn + 1;
    changeState({ cpuColumn: nextCpuColumn });
  }
}

renderGame();
