'use strict';

var gameState = {
  rows: 5,
  columns: 5,
  playerColumn: 2,
  wallRow: 0,
  openingColumn: 0,
  playerValue: 2,
  points: 0,
  gameBoard: [],
  resolvedGameBoard: []
};
gameState.gameBoard = generateBoard(gameState);
gameState.resolvedGameBoard = gameState.gameBoard.slice();

function changeState(stateChange) {
  var nextState = Object.assign({}, gameState, stateChange);

  var composedState = compose(nextState, [addWall, addPlayer, checkCollision]);

  var wallRow = composedState.wallRow;
  var openingColumn = composedState.openingColumn;
  var points = composedState.points;
  var playerColumn = composedState.playerColumn;
  var gameBoard = composedState.gameBoard;

  gameState = Object.assign({}, gameState, { resolvedGameBoard: gameBoard, points: points, playerColumn: playerColumn, wallRow: wallRow, openingColumn: openingColumn });
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

  return gameBoard;
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

  var nextGameBoard = gameBoard.slice();

  nextGameBoard[rows - 1] = [0, 0, 0, 0, 0];
  nextGameBoard[rows - 1][playerColumn] = playerValue;

  return Object.assign({}, gameState, { gameBoard: nextGameBoard });
}

function checkCollision(gameState) {
  var playerColumn = gameState.playerColumn;
  var wallRow = gameState.wallRow;
  var rows = gameState.rows;
  var openingColumn = gameState.openingColumn;
  var points = gameState.points;

  var nextPoints = points;

  if (wallRow === rows - 1) {
    nextPoints = playerColumn === openingColumn ? points + 1 : 0;
  }

  return Object.assign({}, gameState, { points: nextPoints });
}

function render(nextState) {
  // Clear the table
  var el = document.getElementById('table');
  el.innerHTML = '';

  var resolvedGameBoard = nextState.resolvedGameBoard;
  var playerValue = nextState.playerValue;
  var points = nextState.points;

  var table = document.createElement('table');

  resolvedGameBoard.forEach(function (row) {
    var tr = document.createElement('tr');

    row.forEach(function (col) {
      var td = document.createElement('td');
      var className = (function () {
        switch (col) {
          case 0:
            return 'empty';
          case 1:
            return 'filled';
          case playerValue:
            return 'player';
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
  var nextState = gameState;

  transforms.forEach(function (transform) {
    nextState = transform(nextState);
  });

  return nextState;
}

// Master render loop
setInterval(function () {
  render(gameState);
}, 22);

// Move the wall down
setInterval(function () {
  var _gameState = gameState;
  var wallRow = _gameState.wallRow;
  var openingColumn = _gameState.openingColumn;
  var rows = _gameState.rows;
  var columns = _gameState.columns;

  var nextOpeningColumn = openingColumn;
  var nextWallRow = wallRow + 1;
  if (nextWallRow > rows - 1) {
    nextWallRow = 0;
    nextOpeningColumn = Math.round(Math.random() * (columns - 1));
  }

  changeState({ wallRow: nextWallRow, openingColumn: nextOpeningColumn });
}, 500);

window.addEventListener('keydown', handleMove);

function handleMove(e) {
  var keyCode = e.keyCode;

  switch (keyCode) {
    case 37:
      playerLeft();
      break;
    case 39:
      playerRight();
      break;
  }
}

function playerLeft() {
  var _gameState2 = gameState;
  var playerColumn = _gameState2.playerColumn;

  var nextPlayerColumn = playerColumn ? playerColumn - 1 : 0;

  changeState({ playerColumn: nextPlayerColumn });
}

function playerRight() {
  var _gameState3 = gameState;
  var playerColumn = _gameState3.playerColumn;
  var columns = _gameState3.columns;

  var nextPlayerColumn = playerColumn === columns - 1 ? columns - 1 : playerColumn + 1;

  changeState({ playerColumn: nextPlayerColumn });
}

// const Game = function () {
//     const PLAYER = 2;
//
//     function game() {
//         this.currentRow = 0;
//         this.points = 0;
//         this.playerIndex = PLAYER;
//
//         this.table = [
//             [0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0]
//         ];
//
//         this.handleMove = this.handleMove.bind(this);
//     }
//
//     game.prototype = {
//         render() {
//             const table = document.getElementById('table');
//             table.innerHTML = '';
//
//             const copy = this.table.slice();
//             copy[4] = this.table[4].slice();
//             copy[4][this.playerIndex] = PLAYER;
//
//             copy.forEach((row) => {
//                 const tr = document.createElement('tr');
//                 const fragment = document.createDocumentFragment();
//
//                 row.forEach((col) => {
//                     const td = document.createElement('td');
//                     const className = (function() {
//                         switch(col) {
//                             case 0: return 'empty'
//                             case 1: return 'filled'
//                             case PLAYER: return 'player'
//                         }
//                     })();
//                     td.className = className;
//
//                     fragment.appendChild(td);
//                 });
//
//                 tr.appendChild(fragment);
//                 table.appendChild(tr);
//             });
//
//             if (this.checkCollision()) {
//                 this.points = 0;
//                 window.removeEventListener('keydown', this.handleMove);
//             } else if (this.currentRow === this.table.length - 1) {
//                 this.points += 1;
//             }
//
//             document.getElementById('points').textContent = this.points;
//         },
//
//         handleMove(e) {
//             const keyCode = e.keyCode;
//
//             switch(keyCode) {
//                 case 37:
//                     this.playerLeft();
//                     break;
//                 case 39:
//                     this.playerRight();
//                     break;
//             }
//         },
//
//         start() {
//             setInterval(() => {
//                 this.tick();
//             }, 145);
//         },
//
//         tick() {
//             const currentRow = this.currentRow;
//
//             if (!this.points) {
//                 window.addEventListener('keydown', this.handleMove);
//             }
//
//             if (currentRow < this.table.length - 1) {
//                 this.table[currentRow + 1] = this.table[currentRow].slice();
//                 this.table[currentRow] = this.generateBlankRow();
//                 this.currentRow++;
//             } else {
//                 this.table[currentRow] = this.generateBlankRow();
//                 this.table[0] = this.generateRow();
//                 this.currentRow = 0;
//             }
//
//             this.render();
//         },
//
//         checkCollision() {
//             return this.table[4][this.playerIndex] === 1 ? true : false;
//         },
//
//         generateBlankRow() {
//             return [0, 0, 0, 0, 0];
//         },
//
//         generateRow() {
//             const insertionPoint = Math.round(Math.random() * 4);
//             let row = [1,1,1,1,1];
//
//             row[insertionPoint] = 0;
//
//             return row;
//         },
//
//         playerLeft() {
//             const currentPos = this.playerIndex;
//             this.playerIndex = currentPos ? currentPos - 1 : 0;
//
//             this.render();
//         },
//
//         playerRight() {
//             const currentPos = this.playerIndex;
//             this.playerIndex = currentPos === 4 ? 4 : currentPos + 1;
//
//             this.render();
//         }
//     };
//
//     return game;
// }();

// const game = new Game();
// game.table[0] = game.generateRow();
// game.start();
