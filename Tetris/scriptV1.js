const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const GRID_SIDE = 50;
const GRID_COLS = canvas.width / GRID_SIDE;
const GRID_ROWS = canvas.height / GRID_SIDE;

const shapeTypes = ["mBox", "vLine", "hLine", "L", "J"];

class Shape {
  constructor(x, y, type, isActive) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.isActive = isActive;
    this.height = this.getHeight(type);
    this.constraints = this.calculateConstraints();
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
  update(ctx) {
    this.drawShape(ctx);
    this.constraints = this.calculateConstraints();
    let height = this.getHeight(this.type);

    if (this.y < GRID_ROWS - height) {
      this.y += 1;
    } else {
      this.isActive = false;
    }
  }
  getHeight(type) {
    switch (type) {
      case "mBox":
        return 2;
      case "vLine":
        return 4;
      case "hLine":
        return 1;
      case "L":
        return 3;
      case "J":
        return 3;
      case "S":
        return 2;
      case "Z":
        return 2;
      case "T":
        return 2;
    }
  }
  calculateConstraints() {
    let top = this.y;
    let left = this.x;
    let bottom, right;
    switch (this.type) {
      case "mBox":
        bottom = this.y + 2;
        right = this.x + 2;
        break;
      case "vLine":
        bottom = this.y + 4;
        right = this.x + 1;
        break;
      case "hLine":
        bottom = this.y + 1;
        right = this.x + 4;
        break;
      case "L":
        bottom = this.y + 3;
        right = this.x + 2;
        break;
      case "J":
        bottom = this.y + 3;
        right = this.x + 2;
        break;
    }
    console.log(top, bottom, left, right);

    return {
      top,
      bottom,
      left,
      right,
    };
  }
  drawShape(ctx) {
    switch (this.type) {
      case "mBox":
        this.drawMBox(ctx, this.x, this.y);
        break;
      case "vLine":
        this.drawVLine(ctx, this.x, this.y);
        break;
      case "hLine":
        this.drawHLine(ctx, this.x, this.y);
        break;
      case "L":
        this.drawL(ctx, this.x, this.y);
        break;
      case "J":
        this.drawJ(ctx, this.x, this.y);
        break;
    }
  }
  drawBox(ctx, x, y) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(
      x * GRID_SIDE + 3,
      y * GRID_SIDE + 3,
      GRID_SIDE - 6,
      GRID_SIDE - 6
    );
    ctx.closePath();
  }
  drawMBox(ctx, x, y) {
    this.drawBox(ctx, x, y);
    this.drawBox(ctx, x + 1, y);
    this.drawBox(ctx, x, y + 1);
    this.drawBox(ctx, x + 1, y + 1);
  }
  drawVLine(ctx, x, y) {
    this.drawBox(ctx, x, y);
    this.drawBox(ctx, x, y + 1);
    this.drawBox(ctx, x, y + 2);
    this.drawBox(ctx, x, y + 3);
  }
  drawHLine(ctx, x, y) {
    this.drawBox(ctx, x, y);
    this.drawBox(ctx, x + 1, y);
    this.drawBox(ctx, x + 2, y);
    this.drawBox(ctx, x + 3, y);
  }
  drawL(ctx, x, y) {
    this.drawBox(ctx, x, y);
    this.drawBox(ctx, x, y + 1);
    this.drawBox(ctx, x, y + 2);
    this.drawBox(ctx, x + 1, y + 2);
  }
  drawJ(ctx, x, y) {
    this.drawBox(ctx, x, y + 2);
    this.drawBox(ctx, x + 1, y);
    this.drawBox(ctx, x + 1, y + 1);
    this.drawBox(ctx, x + 1, y + 2);
  }
}

const shapes = [];

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i1 = 0; i1 < shapes.length; i1++) {
    let s1 = shapes[i1];
    s1.update(ctx);
  }
}, 500);

shapes.push(new Shape(4, 0, "mBox", true));

setInterval(() => {
  let x = Math.floor(GRID_COLS / 2);
  let y = 0;
  let type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
  shapes.push(new Shape(x, y, type, true));
}, 5000);

addEventListener("keydown", (e) => {
  let s = shapes[shapes.length - 1];
  console.log(s);
  if (s.isActive) {
    switch (e.key) {
      case "A":
      case "a":
        s.x -= 1;
        break;
      case "D":
      case "d":
        s.x += 1;
        break;
    }
    s.constraints = s.calculateConstraints();
  }
});
