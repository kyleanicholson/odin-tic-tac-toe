// Reset button
const resetButton = document.querySelector(".restart");

// Reset event listener
resetButton.addEventListener("click", () => {
  gameController.resetGame();
});

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setBoard = (index, value) => (board[index] = value);

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { getBoard, setBoard, resetBoard };
})();

// Create a player factory function
function createPlayer(name, marker) {
  const getName = () => name;
  const getMarker = () => marker;

  return { getName, getMarker };
}

// Create a game controller module
const gameController = (() => {
  const player1 = createPlayer("Player 1", "X");
  const player2 = createPlayer("Player 2", "O");

  let currentPlayer = player1;

  const getCurrentPlayer = () => currentPlayer;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    statusController.updateStatus(`${currentPlayer.getMarker()}'s turn`);
  };

  const playTurn = (cell) => {
    const board = gameBoard.getBoard();
    const cellIndex = cell.id;
    if (board[cellIndex] === "") {
      gameBoard.setBoard(cellIndex, currentPlayer.getMarker());
      cell.textContent = currentPlayer.getMarker();
      const winner = checkWinner();
      const draw = checkDraw();
      if (winner) {
        console.log(winner);
      } else {
        switchPlayer();
      }

      if (draw) {
        console.log("draw");
      }
    }
  };

  const resetGame = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.textContent = "";
    });
    // Switch to the player who did not start the previous game
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    statusController.updateStatus(`${currentPlayer.getMarker()}'s turn`);
    gameBoard.resetBoard();
  };

  const checkDraw = () => {
    const board = gameBoard.getBoard();
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        return false;
      }
    }
    statusController.updateStatus("Draw!");
    return true;
  };

  const checkWinner = () => {
    const board = gameBoard.getBoard();
    const winningCombos = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Top left to bottom right
      [2, 4, 6], // Top right to bottom left
    ];
    for (let i = 0; i < winningCombos.length; i++) {
      const [a, b, c] = winningCombos[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        statusController.updateStatus(`${board[a]} wins!`);
        return board[a];
      }
    }
    return null;
  };

  return { getCurrentPlayer, playTurn, resetGame, checkWinner };
})();

// Create a display controller module
const displayController = (() => {
  // Status display
  const cells = document.querySelectorAll(".cell");

  // Event listeners
  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      gameController.playTurn(cell);
    });
  });
})();

// Create a status controller
const statusController = (() => {
  const statusDisplay = document.querySelector(".status");

  const updateStatus = (status) => {
    statusDisplay.textContent = status;
  };

  return { updateStatus };
})();
