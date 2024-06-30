import "./style.css";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 5;

class Paddle {
  constructor() {
    this.x = canvas.width / 2;
    this.y = 360;
    this.width = 80;
    this.height = 20;
  }

  draw(ctx) {
    ctx.fillStyle = "darkblue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(ctx) {
    this.draw(ctx);
  }
}

class Brick {
  constructor(x, y) {
    this.gap = BRICK_GAP;
    this.width = BRICK_WIDTH;
    this.height = BRICK_HEIGHT;
    this.x = x * this.width;
    this.y = y * this.height;
    this.color = y < 2 ? "orangered" : y < 4 ? "orange" : "gold";
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x + this.height,
      this.y + this.width / 2,
      this.width - this.gap,
      this.height - this.gap
    );
  }
  update(ctx) {
    this.draw(ctx);
  }
}

class Ball {
  constructor() {
    this.x = canvas.width / 2 + 50;
    this.y = canvas.height / 2;
    this.vx = 1;
    this.vy = 1;
    this.radius = 10;
    this.color = "red";
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  update(ctx) {
    this.draw(ctx);
    if (this.x + this.radius == canvas.width || this.x - this.radius == 0) {
      this.vx = -this.vx;
    }
    if (this.y + this.radius == canvas.width || this.y - this.radius == 0) {
      this.vy = -this.vy;
    }
    this.x += this.vx;
    this.y += this.vy;
  }
}

let paddle = new Paddle();
let ball = new Ball();
let bricks = [];

for (let i = 0; i < Math.floor(canvas.width / BRICK_WIDTH); i++) {
  for (let j = 0; j < 5; j++) {
    bricks.push(new Brick(i, j));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);
  ball.update(ctx);
  paddle.update(ctx);
  bricks.forEach((brick) => {
    brick.update(ctx);
  });
}

animate();
