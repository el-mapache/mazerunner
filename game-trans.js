'use strict';

const Game = function () {
    const PLAYER = 2;

    function game() {
        this.currentRow = 0;
        this.playerIndex = PLAYER;

        this.table = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];

        this.handleMove = this.handleMove.bind(this);
    }

    game.prototype = {
        render() {
            console.log(this.playerIndex);
            const table = document.getElementById('table');
            table.innerHTML = '';

            const copy = this.table.slice();
            copy[4] = this.table[4].slice();
            copy[4][this.playerIndex] = PLAYER;

            copy.forEach(row => {
                const tr = document.createElement('tr');
                const fragment = document.createDocumentFragment();

                row.forEach(col => {
                    const td = document.createElement('td');
                    const className = function () {
                        switch (col) {
                            case 0:
                                return 'empty';
                            case 1:
                                return 'filled';
                            case PLAYER:
                                return 'player';
                        }
                    }();
                    td.className = className;

                    fragment.appendChild(td);
                });

                tr.appendChild(fragment);
                table.appendChild(tr);
            });

            if (this.checkCollision()) {
                this.points = 0;
                window.removeEventListener('keydown', this.handleMove);
            } else if (this.currentRow === this.table.length - 1) {
                this.points += 1;
            }

            document.getElementById('points').textContent = this.points;
        },

        handleMove(e) {
            const keyCode = e.keyCode;

            switch (keyCode) {
                case 37:
                    this.playerLeft();
                    break;
                case 39:
                    this.playerRight();
                    //right
                    break;
            }
        },

        start() {
            setInterval(() => {
                this.tick();
            }, 130);
        },

        tick() {
            const currentRow = this.currentRow;

            if (!this.points) {
                window.addEventListener('keydown', this.handleMove);
            }

            if (currentRow < this.table.length - 1) {
                this.table[currentRow + 1] = this.table[currentRow].slice();
                this.table[currentRow] = this.generateBlankRow();
                this.currentRow++;
            } else {
                this.table[currentRow] = this.generateBlankRow();
                this.table[0] = this.generateRow();
                this.currentRow = 0;
            }

            this.render();
        },

        checkCollision() {
            return this.table[4][this.playerIndex] === 1 ? true : false;
        },

        generateBlankRow() {
            return [0, 0, 0, 0, 0];
        },

        generateRow() {
            const insertionPoint = Math.round(Math.random() * 4);
            let row = [1, 1, 1, 1, 1];

            row[insertionPoint] = 0;

            return row;
        },

        playerLeft() {
            const currentPos = this.playerIndex;
            this.playerIndex = currentPos ? currentPos - 1 : 0;

            this.render();
        },

        playerRight() {
            const currentPos = this.playerIndex;
            this.playerIndex = currentPos === 4 ? 4 : currentPos + 1;

            this.render();
        }
    };

    return game;
}();

const game = new Game();
game.table[0] = game.generateRow();
game.start();
