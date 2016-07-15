'use strict';

let gameState = {
  rows: 5,
  columns: 5,
  playerColumn: 2,
  wallRow: 0,
  openingColumn: 0,
  playerValue: 2,
  points: 0,
  gameBoard: [],
  resolvedGameBoard: []
}
gameState.gameBoard = generateBoard(gameState);
gameState.resolvedGameBoard = gameState.gameBoard.slice();

function changeState(stateChange) {
  const nextState = Object.assign({}, gameState, stateChange);

  const composedState = compose(nextState, [
    addWall,
    addPlayer,
    checkCollision
  ]);

  const { wallRow, openingColumn, points, playerColumn, gameBoard } = composedState;
  gameState = Object.assign({}, gameState, { resolvedGameBoard: gameBoard, points, playerColumn, wallRow, openingColumn });
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

  return gameBoard;
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

  const nextGameBoard = gameBoard.slice();

  //nextGameBoard[rows - 1] = [0, 0, 0, 0, 0];
  nextGameBoard[rows - 1][playerColumn]= playerValue;

  return Object.assign({}, gameState, { gameBoard: nextGameBoard });
}

function checkCollision(gameState) {
  const { playerColumn, wallRow, rows, openingColumn, points } = gameState;
  let nextPoints = points;

  if (wallRow === rows - 1) {
    nextPoints = playerColumn === openingColumn ? points + 1 : 0;
  }

  return Object.assign({}, gameState, { points: nextPoints });
}

function render(nextState) {
  // Clear the table
  const el = document.getElementById('table');
  el.innerHTML = '';

  const { resolvedGameBoard, playerValue, points } = nextState;
  const table = document.createElement('table');

  resolvedGameBoard.forEach((row) => {
    const tr = document.createElement('tr');

    row.forEach((col) => {
      const td = document.createElement('td');
      const className = (function() {
        switch(col) {
            case 0: return 'empty'
            case 1: return 'filled'
            case playerValue: return 'player'
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

// Master render loop
setInterval(function() {
  render(gameState);
}, 22);

// Move the wall down
setInterval(function() {
  const { wallRow, openingColumn, rows, columns } = gameState;
  let nextOpeningColumn = openingColumn;
  let nextWallRow = wallRow + 1;
  if (nextWallRow > rows - 1) {
    nextWallRow = 0;
    nextOpeningColumn = Math.round(Math.random() * (columns - 1));
  }

  changeState({ wallRow: nextWallRow, openingColumn: nextOpeningColumn });
}, 500);

window.addEventListener('keydown', handleMove);

function handleMove(e) {
  const keyCode = e.keyCode;

  switch(keyCode) {
    case 37:
        playerLeft();
        break;
    case 39:
        playerRight();
        break;
  }
}

function playerLeft() {
  const { playerColumn } = gameState;
  const nextPlayerColumn = playerColumn ? playerColumn - 1 : 0;

  changeState({ playerColumn: nextPlayerColumn });
}

function playerRight() {
  const { playerColumn, columns } = gameState;
  const nextPlayerColumn = playerColumn === columns - 1 ? columns - 1 : playerColumn + 1;

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
