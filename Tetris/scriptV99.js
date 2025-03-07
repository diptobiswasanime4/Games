const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const SIDE = 50;
const COLS = 10;
const ROWS = 10;

const COLORS = [
  "cyan", // I
  "blue", // J
  "orange", // L
  "yellow", // O
  "green", // S
  "purple", // T
  "red", // Z
];

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
    [0, 1],
    [1, 1],
    [2, 1],
    [2, 0],
  ], // L
  [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ], // O
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

let board = Array(ROWS)
  .fill()
  .map(() => Array(COLS).fill(null));

let currentPiece = null;
let gameOver = false;
let score = 0;

console.log(board);

function newPiece() {
  const type = Math.floor(Math.random() * SHAPES.length);
  return {
    shape: SHAPES[type],
    color: COLORS[type],
    x: Math.floor(COLS / 2) - 1,
    y: 0,
  };
}

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
}

function merge() {
  currentPiece.shape.forEach(([dx, dy]) => {
    const x = currentPiece.x + dx;
    const y = currentPiece.y + dy;
    if (y >= 0) board[y][x] = currentPiece.color;
  });
  clearLines();
  currentPiece = newPiece();
  if (!canMove()) gameOver = true;
  console.log(board);
}

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

function rotate() {
  const rotated = currentPiece.shape.map(([x, y]) => [-y, x]);
  if (canMove(0, 0, rotated)) {
    currentPiece.shape = rotated;
  }
}

function canMove(dx = 0, dy = 0, shape = currentPiece.shape) {
  return shape.every(([px, py]) => {
    const x = currentPiece.x + px + dx;
    const y = currentPiece.y + py + dy;
    return (
      x >= 0 && x < COLS && y < ROWS && (y < 0 || !board[y] || !board[y][x])
    );
  });
}

function update() {
  if (!currentPiece) currentPiece = newPiece();

  if (canMove(0, 1)) {
    currentPiece.y++;
  } else {
    merge();
  }

  draw();
  setTimeout(update, 500);
}

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

update();
