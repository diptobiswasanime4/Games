import "./style.css";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const GRAVITY = 0.1;

class Player {
  constructor() {
    this.x = 50;
    this.y = 50;
    this.vx = 0;
    this.vy = 0;
    this.width = 100;
    this.height = 50;
    this.fuel = 100;
  }

  draw(ctx) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update(ctx) {
    this.draw(ctx);
    if (this.y > canvas.height - this.height) {
      this.vy = 0;
    } else {
      this.y += this.vy;
      this.vy += GRAVITY;
    }
  }
}

let monkey = new Player();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  monkey.update(ctx);
  requestAnimationFrame(animate);
}

animate();

addEventListener("keydown", (e) => {
  console.log(e.key);

  switch (e.key) {
    case " ":
      monkey.fuel -= 1;
      break;
    case "d":
    case "D":
      break;
    case "a":
    case "A":
      break;
  }
});
