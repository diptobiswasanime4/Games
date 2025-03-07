const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const SIDE = 50;
const COLS = 10;
const ROWS = 10;

const board = [];

function initBoard() {
  for (let i = 0; i < ROWS; i++) {
    board[i] = [];
    for (let j = 0; j < COLS; j++) {
      board[i][j] = 0;
    }
  }
}

initBoard();

console.log(board);

const shapes = [];

function drawBox(ctx, x, y) {
  ctx.fillStyle = "white";
  ctx.fillRect(x * SIDE + 3, y * SIDE + 3, SIDE - 6, SIDE - 6);
}

function drawMBox(ctx, x, y) {
  drawBox(ctx, x, y);
  drawBox(ctx, x + 1, y);
  drawBox(ctx, x, y + 1);
  drawBox(ctx, x + 1, y + 1);
}

shapes.push({ x: 1, y: 1, isActive: true });

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < shapes.length; i++) {
    let x = shapes[i].x;
    let y = shapes[i].y;
    drawMBox(ctx, x, y);
  }
  let s = shapes[shapes.length - 1];
  let sx = s.x;
  let sy = s.y;
  if (sy < ROWS - 2 && board[sx][sy + 2] == 0 && board[sx + 1][sy + 2] == 0) {
    s.y += 1;
  } else {
    board[sx][sy] = 1;
    board[sx + 1][sy] = 1;
    board[sx][sy + 1] = 1;
    board[sx + 1][sy + 1] = 1;
    s.isActive = false;
    calculatePoints();
  }
  //   console.log(board);
}, 500);

addEventListener("keydown", (e) => {
  let s = shapes[shapes.length - 1];
  switch (e.key) {
    case "A":
    case "a":
      if (
        s.isActive == true &&
        board[s.x - 1][s.y] == 0 &&
        board[s.x - 1][s.y + 1] == 0
      ) {
        s.x -= 1;
      }
      break;
    case "D":
    case "d":
      if (
        s.isActive == true &&
        board[s.x - 1][s.y] == 0 &&
        board[s.x - 1][s.y + 1] == 0
      ) {
        s.x += 1;
      }
      break;
  }
  console.log(s);
});

setInterval(() => {
  let x = Math.floor(ROWS / 2);
  let y = 0;
  shapes.push({ x, y, isActive: true });
}, 5000);

function calculatePoints() {
  let sum = 0;
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      sum += board[i][j];
    }
    if (sum == 10) {
      console.log("Victory");
      for (let j = 0; j < COLS; j++) {
        board[i][j] = 0;
      }
      break;
    }
  }
  console.log(board);
}
