const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const SIDE = 25;
const COLS = 20;
const ROWS = 20;

// Colors for different pieces
const COLORS = [
  "cyan", // I
  "blue", // J
  "yellow", // O
  "orange", // L
  "green", // S
  "purple", // T
  "red", // Z
];

// Tetromino shapes (relative coordinates)
const SHAPES = [
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ], // I
  [
    [0, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ], // J
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ], // O
  [
    [0, 1],
    [1, 1],
    [2, 1],
    [2, 0],
  ], // L
  [
    [0, 1],
    [1, 1],
    [1, 0],
    [2, 0],
  ], // S
  [
    [0, 1],
    [1, 1],
    [1, 0],
    [2, 1],
  ], // T
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
  ], // Z
];

// Game state
let board = Array(ROWS)
  .fill()
  .map(() => Array(COLS).fill(null));
let currentPiece = null;
let gameOver = false;
let score = 0;

// Create new piece
function newPiece() {
  const type = Math.floor(Math.random() * SHAPES.length);
  return {
    shape: SHAPES[type],
    color: COLORS[type],
    x: Math.floor(COLS / 2) - 1,
    y: 0,
  };
}

// Draw the board and pieces
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = "#333";
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      ctx.strokeRect(x * SIDE, y * SIDE, SIDE, SIDE);
      if (board[y][x]) {
        ctx.fillStyle = board[y][x];
        ctx.fillRect(x * SIDE, y * SIDE, SIDE - 1, SIDE - 1);
      }
    }
  }

  // Draw current piece
  if (currentPiece) {
    ctx.fillStyle = currentPiece.color;
    currentPiece.shape.forEach(([dx, dy]) => {
      const x = currentPiece.x + dx;
      const y = currentPiece.y + dy;
      ctx.fillRect(x * SIDE, y * SIDE, SIDE - 1, SIDE - 1);
    });
  }

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Check if piece can move to position
function canMove(dx = 0, dy = 0, shape = currentPiece.shape) {
  return shape.every(([px, py]) => {
    const x = currentPiece.x + px + dx;
    const y = currentPiece.y + py + dy;
    return (
      x >= 0 && x < COLS && y < ROWS && (y < 0 || !board[y] || !board[y][x])
    );
  });
}

// Merge piece into board
function merge() {
  currentPiece.shape.forEach(([dx, dy]) => {
    const x = currentPiece.x + dx;
    const y = currentPiece.y + dy;
    if (y >= 0) board[y][x] = currentPiece.color;
  });
  clearLines();
  currentPiece = newPiece();
  if (!canMove()) gameOver = true;
}

// Clear completed lines
function clearLines() {
  for (let y = ROWS - 1; y >= 0; y--) {
    if (board[y].every((cell) => cell)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(null));
      score += 100;
      y++;
    }
  }
}

// Rotate piece
function rotate() {
  const rotated = currentPiece.shape.map(([x, y]) => [-y, x]);
  if (canMove(0, 0, rotated)) {
    currentPiece.shape = rotated;
  }
}

// Game loop
function update() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 150, 250);
    return;
  }

  if (!currentPiece) currentPiece = newPiece();

  if (canMove(0, 1)) {
    currentPiece.y++;
  } else {
    merge();
  }

  draw();
  setTimeout(update, 500);
}

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  switch (e.key) {
    case "a":
      if (canMove(-1, 0)) currentPiece.x--;
      break;
    case "d":
      if (canMove(1, 0)) currentPiece.x++;
      break;
    case "s":
      if (canMove(0, 1)) currentPiece.y++;
      break;
    case "w":
      rotate();
      break;
  }
  draw();
});

// Start game
update();
