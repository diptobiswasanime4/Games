import "./style.css";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 5;

let spBrick;
let bonusFired;
let bonusTypes = [
  {
    name: "increase paddle size by 1.1x",
    code: 0,
  },
  {
    name: "decrease paddle size by 0.9x",
    code: 1,
  },
  {
    name: "increase ball speed by 2x",
    code: 2,
  },
  {
    name: "decrease ball speed by 0.5x",
    code: 3,
  },
];
let bonus = [];

let keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

class Paddle {
  constructor() {
    this.x = canvas.width / 2;
    this.y = 360;
    this.vx = 2;
    this.vy = 0;
    this.width = 80;
    this.height = 20;
  }

  draw(ctx) {
    ctx.fillStyle = "darkblue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(ctx) {
    this.draw(ctx);
    if (keys.right.pressed && this.x < canvas.width - BRICK_GAP - this.width) {
      this.x += this.vx;
    }
    if (keys.left.pressed && this.x > BRICK_GAP) {
      this.x -= this.vx;
    }
    bonus.forEach((b, index) => {
      if (
        b.y + b.side == paddle.y &&
        b.x > paddle.x &&
        b.x + b.side < paddle.x + paddle.width
      ) {
        switch (b.type) {
          case 0:
            paddle.width *= 1.1;
            break;
          case 1:
            paddle.width *= 0.9;
            break;
          case 2:
            ball.vx *= 2;
            ball.vy *= 2;
            break;
          case 3:
            ball.vx *= 0.5;
            ball.vy *= 0.5;
            break;
        }
        bonus.splice(index, 1);
      }
    });
  }
}

class Brick {
  constructor(x, y, isSpecial) {
    this.gap = BRICK_GAP;
    this.width = BRICK_WIDTH;
    this.height = BRICK_HEIGHT;
    this.x = x * this.width;
    this.y = y * this.height;
    this.isSpecial = isSpecial;
    this.color = y < 2 ? "orangered" : y < 4 ? "orange" : "gold";
  }

  draw(ctx) {
    if (this.isSpecial) {
      ctx.fillStyle = "darkviolet";
    } else {
      ctx.fillStyle = this.color;
    }
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
    // collision with brick
    bricks.forEach((brick, index) => {
      if (
        this.y - this.radius <
          brick.y + brick.height + brick.width / 2 - brick.gap &&
        this.x < brick.x + brick.width &&
        this.x > brick.x
      ) {
        this.vy = -this.vy;
        bonusFired = true;
        // if (brick.isSpecial) {
        bonus.push(new Bonus(brick.x, brick.y, true));
        // }
        bricks.splice(index, 1);
      }
    });
    // collision with paddle
    if (
      this.y + this.radius == paddle.y &&
      this.x > paddle.x &&
      this.x < paddle.x + paddle.width
    ) {
      this.vy = -this.vy;
    }
    // collision with wall
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

class Bonus {
  constructor(x, y, activate) {
    this.x = x;
    this.y = y;
    this.side = 20;
    this.activate = activate;
    this.type = Math.floor(Math.random() * 4);
    this.color = "black";
  }
  draw(ctx) {
    this.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.side, this.side);
  }
  update(ctx) {
    this.draw(ctx);
    this.y += 2;
  }
}

let paddle = new Paddle();
let ball = new Ball();
let bricks = [];

for (let i = 0; i < Math.floor(canvas.width / BRICK_WIDTH); i++) {
  for (let j = 0; j < 5; j++) {
    bricks.push(new Brick(i, j, false));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);
  ball.update(ctx);
  paddle.update(ctx);
  bricks.forEach((brick, index) => {
    if (index == spBrick) {
      brick.isSpecial = true;
    } else {
      brick.isSpecial = false;
    }
    brick.update(ctx);
  });
  bonus.forEach((b) => {
    b.update(ctx);
  });
}

animate();

addEventListener("keydown", (e) => {
  switch (e.key) {
    case "d":
    case "D":
      keys.right.pressed = true;
      break;
    case "a":
    case "A":
      keys.left.pressed = true;
      break;
  }
});

addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
    case "D":
      keys.right.pressed = false;
      break;
    case "a":
    case "A":
      keys.left.pressed = false;
      break;
  }
});

function pickSpecial() {
  return Math.floor(Math.random() * bricks.length);
}

setInterval(() => {
  spBrick = pickSpecial();
  console.log(spBrick);
}, 5000);
