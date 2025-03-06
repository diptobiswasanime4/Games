const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const GRID_SIDE = 50;
const GRID_COLS = canvas.width / GRID_SIDE;
const GRID_ROWS = canvas.height / GRID_SIDE;

// const shapeTypes = ["mBox", "vLine", "hLine", "L", "J", "S", "Z", "T"];
const shapeTypes = ["mBox", "vLine", "hLine", "L", "J"];

class Shape {
  constructor(x, y, type, isActive) {
    this.x = x;
    this.y = y;
    this.type = type;
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
  update(ctx) {
    this.drawShape(ctx);
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
      case "S":
        break;
      case "Z":
        break;
      case "T":
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

shapes.push(new Shape(1, 1, "J", true));
// shapes.push(new Shape(5, 1, "vLine"));
// shapes.push(new Shape(1, 5, "hLine"));

// for (let i = 0; i < shapes.length; i++) {
//   let s = shapes[i];
//   s.drawShape(ctx, i, i);
// }

setInterval(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i1 = 0; i1 < shapes.length; i1++) {
    let s1 = shapes[i1];
    s1.update(ctx);
  }
}, 500);

setInterval(() => {
  let x = Math.floor(GRID_COLS / 2);
  let y = 0;
  let type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
  shapes.push(new Shape(x, y, type, true));
  console.log(shapes);
}, 5000);

addEventListener("keydown", (e) => {
  let s = shapes.find((s) => s.isActive == true);
  console.log(s);

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
});
