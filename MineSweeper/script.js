const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// canvas.width = 400;
// canvas.height = 400;

// Game settings
let GRID_SIZE = 10;
let CELL_SIZE = 40;
let MINE_COUNT = 15;

const minesCountDOM = document.getElementById("minesCount");
const difficulty = document.getElementById("difficulty");

console.log(difficulty.value);

let board = [];
let revealed = [];
let flagged = [];
let gameOver = false;

function setDifficulty() {
  switch (difficulty.value) {
    case "easy":
      GRID_SIZE = 8;
      MINE_COUNT = 8;
      canvas.width = 320;
      canvas.height = 320;
      CELL_SIZE = 40;
      break;
    case "medium":
      GRID_SIZE = 10;
      MINE_COUNT = 15;
      canvas.width = 400;
      canvas.height = 400;
      CELL_SIZE = 40;
      break;
    case "hard":
      GRID_SIZE = 12;
      MINE_COUNT = 30;
      canvas.width = 480;
      canvas.height = 480;
      CELL_SIZE = 40;
      break;
  }
}

// Initialize game
function initGame() {
  board = []; // Reset arrays
  revealed = [];
  flagged = [];

  for (let i = 0; i < GRID_SIZE; i++) {
    board[i] = [];
    revealed[i] = [];
    flagged[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      board[i][j] = 0;
      revealed[i][j] = false;
      flagged[i][j] = false;
    }
  }

  let minesPlaced = 0;
  while (minesPlaced < MINE_COUNT) {
    let x = Math.floor(Math.random() * GRID_SIZE);
    let y = Math.floor(Math.random() * GRID_SIZE);
    if (board[x][y] !== "M") {
      board[x][y] = "M";
      minesPlaced++;
    }
  }

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[i][j] !== "M") {
        board[i][j] = countMines(i, j);
      }
    }
  }
  updateMinesCount();
}

function countMines(x, y) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let newX = x + i;
      let newY = y + j;
      if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
        if (board[newX][newY] === "M") count++;
      }
    }
  }
  return count;
}

function updateMinesCount() {
  let flagCount = 0;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (flagged[i][j]) flagCount++;
    }
  }
  const remainingMines = MINE_COUNT - flagCount;
  minesCountDOM.textContent = `Mines remaining: ${remainingMines}`;
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      ctx.strokeStyle = "black";
      ctx.strokeRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      if (revealed[i][j]) {
        if (board[i][j] === "M") {
          ctx.fillStyle = "red";
          ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else if (board[i][j] > 0) {
          ctx.fillStyle = "black";
          ctx.font = `${Math.floor(CELL_SIZE * 0.5)}px Arial`; // Scale font with cell size
          ctx.textAlign = "center";
          ctx.fillText(
            board[i][j],
            i * CELL_SIZE + CELL_SIZE / 2,
            j * CELL_SIZE + CELL_SIZE / 2 + CELL_SIZE * 0.2
          );
        }
      } else if (flagged[i][j]) {
        ctx.fillStyle = "blue";
        ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.fillStyle = "white";
        ctx.font = `${Math.floor(CELL_SIZE * 0.5)}px Arial`;
        ctx.textAlign = "center";
        ctx.fillText(
          "M",
          i * CELL_SIZE + CELL_SIZE / 2,
          j * CELL_SIZE + CELL_SIZE / 2 + CELL_SIZE * 0.2
        );
      } else {
        ctx.fillStyle = "lightblue";
        ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function reveal(x, y) {
  if (
    x < 0 ||
    x >= GRID_SIZE ||
    y < 0 ||
    y >= GRID_SIZE ||
    revealed[x][y] ||
    gameOver ||
    flagged[x][y]
  )
    return;

  revealed[x][y] = true;

  if (board[x][y] === "M") {
    gameOver = true;
    alert("Game Over! You hit a mine!");
    revealAll();
  } else if (board[x][y] === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        reveal(x + i, y + j);
      }
    }
  }
  drawBoard();
  checkWin();
}

function revealAll() {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      revealed[i][j] = true;
    }
  }
  drawBoard();
}

function checkWin() {
  let unrevealedCount = 0;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (!revealed[i][j] && board[i][j] !== "M") {
        unrevealedCount++;
      }
    }
  }
  if (unrevealedCount === 0) {
    gameOver = true;
    alert("Congratulations! You won!");
  }
}

canvas.addEventListener("click", function (e) {
  if (gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
  const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

  reveal(x, y);
});

canvas.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  if (gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
  const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);

  if (!revealed[x][y]) {
    flagged[x][y] = !flagged[x][y];
    drawBoard();
    updateMinesCount();
  }
});

function startGame() {
  gameOver = false;
  setDifficulty(); // Set canvas size and game parameters
  initGame();
  drawBoard();
  updateMinesCount();
}

// Initial game start with default medium settings
startGame();
