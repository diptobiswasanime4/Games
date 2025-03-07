const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const SIZE = 50;
const ROWS = 10;
const COLS = 10;

const shapeTypes = ["mBox"];

function drawBox(ctx, x, y) {
  ctx.fillRect(x * SIZE - 3, y * SIZE - 3, SIZE - 6, SIZE - 6);
}

function drawMBox(ctx, x, y) {
  let rand = Math.random();
  ctx.fillStyle = "yellow";
  drawBox(ctx, x, y);
  drawBox(ctx, x + 1, y);
  drawBox(ctx, x, y + 1);
  drawBox(ctx, x + 1, y + 1);
}

const shapes = [];
const board = [];

function initBoard() {
  for (let i = 0; i < COLS; i++) {
    board[i] = [];
    for (let j = 0; j < ROWS; j++) {
      board[i][j] = 0;
    }
  }
}

initBoard();

shapes.push({ x: 1, y: 1 });

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    let sx = s.x;
    let sy = s.y;
    drawMBox(ctx, sx, sy);
    if (
      s.y < COLS - 2 &&
      board[sx][sy + 2] == 0 &&
      board[sx + 1][sy + 2] == 0
    ) {
      s.y += 1;
    } else {
      board[sx][sy] = 1;
      board[sx + 1][sy] = 1;
      board[sx][sy + 1] = 1;
      board[sx + 1][sy + 1] = 1;
    }
  }
  console.log(board);
}, 500);

setInterval(() => {
  let x = Math.floor(ROWS / 2);
  let y = 0;
  shapes.push({ x, y });
}, 5000);

addEventListener("keydown", (e) => {
  switch (e.key) {
    case "A":
    case "a":
      break;
    case "D":
    case "d":
      break;
  }
});
