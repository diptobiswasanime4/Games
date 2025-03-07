const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const SIDE = 50;
const COLS = 10;
const ROWS = 10;

// Player properties
const player = {
  x: canvas.width / 2,
  width: 40,
  height: 20,
  speed: 5,
  color: "orange",
};

// Bubble class
class Bubble {
  constructor(x, y, radius, dx, dy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.color = "red";
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    // Bounce off walls
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvas.height) {
      this.dy = -Math.abs(this.dy);
    }
    // Gravity
    this.dy += 0.1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

// Harpoon class
class Harpoon {
  constructor(x) {
    this.x = x;
    this.y = canvas.height - player.height;
    this.width = 2;
    this.height = 20;
    this.speed = 7;
    this.active = true;
  }

  update() {
    this.y -= this.speed;
    if (this.y < 0) this.active = false;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Game state
let bubbles = [];
let harpoons = [];
let score = 0;
let gameOver = false;

// Initialize game
function init() {
  bubbles.push(new Bubble(canvas.width / 2, 50, 30, 2, 1));
}

// Draw player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x - player.width / 2,
    canvas.height - player.height,
    player.width,
    player.height
  );
}

// Handle collisions and splitting
function handleCollisions() {
  for (let i = harpoons.length - 1; i >= 0; i--) {
    const harpoon = harpoons[i];
    for (let j = bubbles.length - 1; j >= 0; j--) {
      const bubble = bubbles[j];
      if (
        harpoon.active &&
        harpoon.x > bubble.x - bubble.radius &&
        harpoon.x < bubble.x + bubble.radius &&
        harpoon.y < bubble.y + bubble.radius
      ) {
        harpoons.splice(i, 1);
        if (bubble.radius > 15) {
          bubbles.push(
            new Bubble(bubble.x, bubble.y, bubble.radius / 2, -2, -2)
          );
          bubbles.push(
            new Bubble(bubble.x, bubble.y, bubble.radius / 2, 2, -2)
          );
        }
        bubbles.splice(j, 1);
        score += 10;
        break;
      }
    }
  }
}

// Check game over
function checkGameOver() {
  bubbles.forEach((bubble) => {
    if (
      bubble.y + bubble.radius > canvas.height - player.height &&
      bubble.x > player.x - player.width / 2 &&
      bubble.x < player.x + player.width / 2
    ) {
      gameOver = true;
    }
  });
}

// Game loop
function update() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 150, 250);
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 210, 300);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw player
  drawPlayer();

  // Update and draw bubbles
  bubbles.forEach((bubble) => {
    bubble.update();
    bubble.draw();
  });

  // Update and draw harpoons
  harpoons.forEach((harpoon, index) => {
    harpoon.update();
    harpoon.draw();
    if (!harpoon.active) harpoons.splice(index, 1);
  });

  // Handle collisions and game state
  handleCollisions();
  checkGameOver();

  // Draw score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);

  requestAnimationFrame(update);
}

// Keyboard controls
let leftPressed = false;
let rightPressed = false;
let shoot = false;

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      leftPressed = true;
      break;
    case "ArrowRight":
      rightPressed = true;
      break;
    case " ":
      if (!shoot) {
        harpoons.push(new Harpoon(player.x));
        shoot = true;
      }
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      leftPressed = false;
      break;
    case "ArrowRight":
      rightPressed = false;
      break;
    case " ":
      shoot = false;
      break;
  }
});

// Player movement
function movePlayer() {
  if (leftPressed && player.x - player.width / 2 > 0) {
    player.x -= player.speed;
  }
  if (rightPressed && player.x + player.width / 2 < canvas.width) {
    player.x += player.speed;
  }
}

// Start game
init();
function gameLoop() {
  movePlayer();
  update();
}
requestAnimationFrame(gameLoop);
