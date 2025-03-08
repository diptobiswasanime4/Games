const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const SIDE = 50;
const ROWS = 10;
const COLS = 10;

const COLORS = [
  "red", // I
  "blue", // o
  "yellow", // J
  "lightgreen", // L
  "orange", // S
  "violet", // Z
  "magenta", // T
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
    [1, 0],
    [1, 1],
  ], // o
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
    [0, 1],
    [1, 1],
    [1, 0],
    [2, 0],
  ], // S
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
  ], // Z
  [
    [0, 1],
    [1, 1],
    [1, 0],
    [2, 1],
  ], //T
];

// variables
let gameOver = false;
let board = Array(ROWS)
  .fill()
  .map(() => Array(COLS).fill(null));
let currentPiece = null;
let score = 0;

function newPiece() {
  const type = Math.floor(Math.random() * SHAPES.length);
  return {
    shape: SHAPES[type],
    color: COLORS[type],
    x: Math.floor(COLS / 2),
    y: 0,
  };
}

function canMove(dx, dy, shape = currentPiece.shape) {
  return shape.every(([ix, iy]) => {
    const x = currentPiece.x + ix + dx;
    const y = currentPiece.y + iy + dy;
    return (
      x >= 0 && x < COLS && y < ROWS && (y < 0 || !board[y] || !board[y][x])
    );
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  ctx.strokeStyle = "grey";
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      //   ctx.strokeRect(x * SIDE, y * SIDE, SIDE, SIDE);
      if (board[y][x]) {
        ctx.fillStyle = board[y][x];
        ctx.fillRect(x * SIDE + 3, y * SIDE + 3, SIDE - 6, SIDE - 6);
      }
    }
  }

  if (currentPiece) {
    ctx.fillStyle = currentPiece.color;
    currentPiece.shape.forEach(([dx, dy]) => {
      const x = currentPiece.x + dx;
      const y = currentPiece.y + dy;
      ctx.fillRect(x * SIDE + 3, y * SIDE + 3, SIDE - 6, SIDE - 6);
    });
  }

  //   // Draw score
  //   ctx.fillStyle = "white";
  //   ctx.font = "20px Arial";
  //   ctx.fillText(`Score: ${score}`, 10, 25);
}
function rotate() {
  const rotatedShape = currentPiece.shape.map(([x, y]) => [-y, x]);
  if (canMove(0, 0, rotatedShape)) {
    currentPiece.shape = rotatedShape;
  }
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

function merge() {
  currentPiece.shape.forEach(([dx, dy]) => {
    const x = currentPiece.x + dx;
    const y = currentPiece.y + dy;
    if (y >= 0) {
      board[y][x] = currentPiece.color;
    }
  });
  clearLines();
  currentPiece = newPiece();
  if (!canMove(0, 0)) {
    gameOver = true;
  }
  console.log(board);
}

function update() {
  if (gameOver) {
    ctx.fillStyle = "darkblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 150, 250);
    return;
  }
  if (!currentPiece) {
    currentPiece = newPiece();
  }

  if (canMove(0, 1)) {
    currentPiece.y++;
  } else {
    merge();
  }

  draw();
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "a":
      if (canMove(-1, 0)) {
        currentPiece.x--;
      }
      break;
    case "d":
      if (canMove(1, 0)) {
        currentPiece.x++;
      }
      break;
    case "s":
      if (canMove(0, 1)) {
        currentPiece.y++;
      }
      break;
    case "w":
      rotate();
      break;
  }
  draw();
});

setInterval(() => {
  update();
}, 500);
