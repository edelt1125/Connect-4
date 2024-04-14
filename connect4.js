/** Connect Four
 * Two players take turns dropping pieces into columns on a board until one player gets four pieces in a row (horizontally, vertically, or diagonally) or the board is full, resulting in a tie.
 */

class Game {
    constructor(p1, p2, height = 6, width = 7) {
      this.players = [p1, p2];
      this.height = height;
      this.width = width;
      this.currPlayer = p1;
      this.makeBoard();
      this.makeHtmlBoard();
      this.gameOver = false;
    }
  
    /** Create the board as a 2D array */
    makeBoard() {
      this.board = [];
      for (let y = 0; y < this.height; y++) {
        this.board.push(Array.from({ length: this.width }));
      }
    }
  
    /** Set up the HTML board with a clickable area for column selection */
    makeHtmlBoard() {
      const board = document.getElementById('board');
      board.innerHTML = '';

      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');
  
      // bind function to handle clicks
      this.handleGameClick = this.handleClick.bind(this);
      
      top.addEventListener("click", this.handleGameClick);
  
      for (let x = 0; x < this.width; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
      }
  
      board.append(top);
  
      // Create rows and cells for the game board
      for (let y = 0; y < this.height; y++) {
        const row = document.createElement('tr');
      
        for (let x = 0; x < this.width; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          row.append(cell);
        }
      
        board.append(row);
      }
    }
  
    /** Find the next available spot in a column */
    findSpotForCol(x) {
      for (let y = this.height - 1; y >= 0; y--) {
        if (!this.board[y][x]) {
          return y;
        }
      }
      return null;
    }
  
    /** Place a piece in the board and update the HTML table */
    placeInTable(y, x) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.style.backgroundColor = this.currPlayer.color;
      piece.style.top = -50 * (y + 2);
  
      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
    }
  
    /** Announce the end of the game */
    endGame(msg) {
      alert(msg);
      const top = document.querySelector("#column-top");
      top.removeEventListener("click", this.handleGameClick);
    }
  
    /** Handle click events on the column tops to play a piece */
    handleClick(evt) {
      const x = +evt.target.id;
        const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }
  
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);
  
      // Check for a tie or win, and switch players if the game continues
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }
  
      // check for win
      if (this.checkForWin()) {
        this.gameOver = true;
        return this.endGame(`The ${this.currPlayer.color} player won!`);
      }
  
      // switch players
      this.currPlayer =
        this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }
    
    /** Check if there's a winning sequence starting from a particular cell */
    checkForWin() {
      const _win = cells =>
        cells.every(
          ([y, x]) =>
            y >= 0 &&
            y < this.height &&
            x >= 0 &&
            x < this.width &&
            this.board[y][x] === this.currPlayer
        );
  
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {

          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
            return true;
          }
        }
      }
    }
  }
  
  class Player {
    constructor(color) {
      this.color = color;
    }
  }
  
/** Initialize the game when the 'Start Game' button is clicked */
  document.getElementById('start-game').addEventListener('click', () => {
    // Ensure user inputs values for both colors
    let p1Color = document.getElementById('p1-color').value;
    let p2Color = document.getElementById('p2-color').value;
  
    // Check if either input is empty
    if (!p1Color || !p2Color) {
      alert('Both players must choose a color.');
      return; // Don't start the game
    }

    let p1 = new Player(document.getElementById('p1-color').value);
    let p2 = new Player(document.getElementById('p2-color').value);
    new Game(p1, p2);
  });