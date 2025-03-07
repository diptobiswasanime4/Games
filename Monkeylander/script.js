const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const fuelDisplay = document.getElementById("fuel");
const altitudeDisplay = document.getElementById("altitude");
const speedDisplay = document.getElementById("speed");
const gameOverScreen = document.getElementById("gameOver");
const gameOverMessage = document.getElementById("gameOverMessage");
const gameOverDetails = document.getElementById("gameOverDetails");
const restartButton = document.getElementById("restartButton");

// Game state
let lander = {
  x: canvas.width / 2,
  y: 100,
  width: 40,
  height: 50,
  rotation: 0,
  velocityX: 0,
  velocityY: 0,
  thrust: 0.05,
  rotationSpeed: 0.1,
  fuel: 1000,
  crashed: false,
  landed: false,
};

// Landing pad
const landingPad = {
  x: canvas.width / 2 - 75,
  y: canvas.height - 30,
  width: 150,
  height: 10,
};

// Terrain
const terrainPoints = [];

// Generate random terrain with a flat landing pad area
function generateTerrain() {
  terrainPoints.length = 0;
  const segments = 30;
  const segmentWidth = canvas.width / segments;

  for (let i = 0; i <= segments; i++) {
    const x = i * segmentWidth;
    let y;

    // Create a flat landing pad in the middle
    if (x >= landingPad.x && x <= landingPad.x + landingPad.width) {
      y = landingPad.y;
    } else {
      // Random height for other parts of terrain
      const randomHeight = Math.random() * 100 + 50;
      y = canvas.height - randomHeight;

      // Ensure a smoother transition near landing pad
      if (x < landingPad.x && x > landingPad.x - segmentWidth * 2) {
        const distanceToLandingPad = landingPad.x - x;
        const transitionFactor = distanceToLandingPad / (segmentWidth * 2);
        y =
          canvas.height -
          randomHeight * transitionFactor -
          (1 - transitionFactor) * (canvas.height - landingPad.y);
      }
      if (
        x > landingPad.x + landingPad.width &&
        x < landingPad.x + landingPad.width + segmentWidth * 2
      ) {
        const distanceFromLandingPad = x - (landingPad.x + landingPad.width);
        const transitionFactor = distanceFromLandingPad / (segmentWidth * 2);
        y =
          canvas.height -
          randomHeight * transitionFactor -
          (1 - transitionFactor) * (canvas.height - landingPad.y);
      }
    }

    terrainPoints.push({ x, y });
  }
}

// Keys state
const keys = {
  ArrowUp: false,
  ArrowLeft: false,
  ArrowRight: false,
};

// Event listeners
window.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

restartButton.addEventListener("click", resetGame);

// Reset game
function resetGame() {
  lander = {
    x: canvas.width / 2,
    y: 100,
    width: 40,
    height: 50,
    rotation: 0,
    velocityX: 0,
    velocityY: 0,
    thrust: 0.05,
    rotationSpeed: 0.1,
    fuel: 1000,
    crashed: false,
    landed: false,
  };
  generateTerrain();
  gameOverScreen.style.display = "none";
  requestAnimationFrame(gameLoop);
}

// Draw the lander
function drawLander() {
  ctx.save();
  ctx.translate(lander.x, lander.y);
  ctx.rotate(lander.rotation);

  // Draw the monkey lander
  // Body
  ctx.fillStyle = "#A0522D";
  ctx.fillRect(
    -lander.width / 2,
    -lander.height / 2,
    lander.width,
    lander.height
  );

  // Window/Cockpit
  ctx.fillStyle = "#87CEEB";
  ctx.beginPath();
  ctx.arc(-5, -lander.height / 4, 12, 0, Math.PI * 2);
  ctx.fill();

  // Monkey face
  ctx.fillStyle = "#8B4513";
  ctx.beginPath();
  ctx.arc(-5, -lander.height / 4, 8, 0, Math.PI * 2);
  ctx.fill();

  // Monkey eyes
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(-8, -lander.height / 4 - 2, 3, 0, Math.PI * 2);
  ctx.arc(-2, -lander.height / 4 - 2, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-8, -lander.height / 4 - 2, 1.5, 0, Math.PI * 2);
  ctx.arc(-2, -lander.height / 4 - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Monkey mouth
  ctx.beginPath();
  ctx.arc(-5, -lander.height / 4 + 3, 3, 0, Math.PI);
  ctx.stroke();

  // Landing gear
  ctx.fillStyle = "#555";
  ctx.fillRect(-lander.width / 2 - 5, lander.height / 2 - 5, 10, 10);
  ctx.fillRect(lander.width / 2 - 5, lander.height / 2 - 5, 10, 10);

  // Draw flames if thrusting
  if (keys.ArrowUp && lander.fuel > 0) {
    ctx.fillStyle = "#FF4500";
    ctx.beginPath();
    ctx.moveTo(-10, lander.height / 2);
    ctx.lineTo(10, lander.height / 2);
    ctx.lineTo(0, lander.height / 2 + 20 + Math.random() * 10);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

// Draw the terrain
function drawTerrain() {
  ctx.fillStyle = "#663300";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);

  for (const point of terrainPoints) {
    ctx.lineTo(point.x, point.y);
  }

  ctx.lineTo(canvas.width, canvas.height);
  ctx.closePath();
  ctx.fill();

  // Draw landing pad
  ctx.fillStyle = "#FFFF00";
  ctx.fillRect(landingPad.x, landingPad.y, landingPad.width, landingPad.height);
}

// Check collision with terrain
function checkCollision() {
  // Create simplified lander hitbox
  const landerBottom = lander.y + lander.height / 2;
  const landerLeft = lander.x - lander.width / 2;
  const landerRight = lander.x + lander.width / 2;

  // Check if lander is touching the landing pad
  if (
    landerBottom >= landingPad.y &&
    landerRight >= landingPad.x &&
    landerLeft <= landingPad.x + landingPad.width
  ) {
    // Check if landing is safe
    if (
      Math.abs(lander.velocityY) < 1.0 &&
      Math.abs(lander.velocityX) < 0.5 &&
      Math.abs(lander.rotation) < 0.1
    ) {
      lander.landed = true;
      return true;
    } else {
      lander.crashed = true;
      return true;
    }
  }

  // Check for collision with terrain
  for (let i = 0; i < terrainPoints.length - 1; i++) {
    const p1 = terrainPoints[i];
    const p2 = terrainPoints[i + 1];

    // Skip landing pad area
    if (p1.x >= landingPad.x && p1.x <= landingPad.x + landingPad.width) {
      continue;
    }

    // Simple line collision detection
    if (landerBottom >= p1.y && landerRight >= p1.x && landerLeft <= p2.x) {
      // Interpolate terrain height at lander position
      const terrainHeightAtLander =
        p1.y + ((p2.y - p1.y) * (lander.x - p1.x)) / (p2.x - p1.x);

      if (landerBottom >= terrainHeightAtLander) {
        lander.crashed = true;
        return true;
      }
    }
  }

  return false;
}

// Update game state
function update() {
  // Apply gravity
  lander.velocityY += 0.01;

  // Apply thrust if up arrow is pressed and fuel is available
  if (keys.ArrowUp && lander.fuel > 0) {
    const thrustX = -Math.sin(lander.rotation) * lander.thrust;
    const thrustY = -Math.cos(lander.rotation) * lander.thrust;

    lander.velocityX += thrustX;
    lander.velocityY += thrustY;

    lander.fuel -= 1;
  }

  // Rotate if left/right arrows are pressed
  if (keys.ArrowLeft) {
    lander.rotation -= lander.rotationSpeed;
  }
  if (keys.ArrowRight) {
    lander.rotation += lander.rotationSpeed;
  }

  // Update position based on velocity
  lander.x += lander.velocityX;
  lander.y += lander.velocityY;

  // Wrap around horizontal edges
  if (lander.x < 0) lander.x = canvas.width;
  if (lander.x > canvas.width) lander.x = 0;

  // Check for collision with terrain
  if (checkCollision()) {
    if (lander.landed) {
      gameOverMessage.textContent = "Successful Landing!";
      gameOverDetails.textContent = `Final Speed: ${Math.sqrt(
        lander.velocityX * lander.velocityX +
          lander.velocityY * lander.velocityY
      ).toFixed(2)} | Remaining Fuel: ${lander.fuel}`;
    } else {
      gameOverMessage.textContent = "Crash!";
      gameOverDetails.textContent = "The monkey didn't make it. Try again!";
    }
    gameOverScreen.style.display = "block";
    return false;
  }

  // Update displays
  fuelDisplay.textContent = lander.fuel;
  altitudeDisplay.textContent = Math.round(
    canvas.height - lander.y - lander.height / 2 - landingPad.y
  );
  const speed = Math.sqrt(
    lander.velocityX * lander.velocityX + lander.velocityY * lander.velocityY
  );
  speedDisplay.textContent = speed.toFixed(2);

  return true;
}

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw terrain
  drawTerrain();

  // Draw lander
  drawLander();

  // Update game state
  if (update()) {
    requestAnimationFrame(gameLoop);
  }
}

// Start the game
generateTerrain();
gameLoop();
