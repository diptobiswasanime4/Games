const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const SIZE = 50;
const ROWS = 10;
const COLS = 10;

class Shape {
  constructor(x, y, isActive) {
    this.x = x;
    this.y = y;
    this.isActive = isActive;
    let rand = Math.random();
    this.color =
      rand > 0.75
        ? "red"
        : rand > 0.5
        ? "blue"
        : rand > 0.25
        ? "green"
        : "yellow";
  }
  drawBox(ctx, x, y) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x * SIZE + 5, this.y * SIZE + 5, SIZE - 10, SIZE - 10);
  }
  drawMBox(ctx) {
    this.drawBox(ctx, this.x, this.y);
    this.drawBox(ctx, this.x + 1, this.y);
    this.drawBox(ctx, this.x, this.y + 1);
    this.drawBox(ctx, this.x + 1, this.y + 1);
  }
  update(ctx) {
    this.drawMBox(ctx);
  }
}

const shapes = [];

shapes.push(new Shape(1, 1, true));

setInterval(() => {
  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];
    s.update(ctx);
  }
}, 500);
