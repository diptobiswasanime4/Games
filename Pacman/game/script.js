const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

// Game settings
const cellSize = 25;
const rows = 20;
const cols = 20;
let score = 0;
let lives = 3;

// Game states
const PLAYING = 0;
const PAUSED = 1;
const GAME_OVER = 2;
let gameState = PLAYING;

// Directions
const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };

// Map representation
// 0: empty, 1: wall, 2: dot, 3: power pellet
const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 3, 1, 0, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 0, 1, 3, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Count dots for win condition
let totalDots = 0;
let dotsEaten = 0;

for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    if (map[y][x] === 2 || map[y][x] === 3) {
      totalDots++;
    }
  }
}

// Pacman
const pacman = {
  x: 10,
  y: 15,
  radius: cellSize / 2 - 2,
  direction: RIGHT,
  nextDirection: RIGHT,
  speed: 5,
  mouthOpen: 0,
  mouthDir: 1,
  powerMode: false,
  powerModeTime: 0,
};

// Ghosts
const ghostColors = ["red", "pink", "cyan", "orange"];
const ghosts = [
  {
    x: 9,
    y: 10,
    direction: LEFT,
    color: ghostColors[0],
    speed: 3,
    scared: false,
  },
  {
    x: 10,
    y: 10,
    direction: RIGHT,
    color: ghostColors[1],
    speed: 3,
    scared: false,
  },
  {
    x: 9,
    y: 11,
    direction: LEFT,
    color: ghostColors[2],
    speed: 3,
    scared: false,
  },
  {
    x: 10,
    y: 11,
    direction: RIGHT,
    color: ghostColors[3],
    speed: 3,
    scared: false,
  },
];

// Get cell position
function getCellPosition(row, col) {
  return {
    x: col * cellSize + cellSize / 2,
    y: row * cellSize + cellSize / 2,
  };
}

// Get cell indices
function getCellIndices(x, y) {
  return {
    col: Math.floor(x / cellSize),
    row: Math.floor(y / cellSize),
  };
}

// Check if a position is valid for movement
function isValidPosition(x, y) {
  const cell = getCellIndices(x, y);
  return (
    cell.col >= 0 &&
    cell.col < cols &&
    cell.row >= 0 &&
    cell.row < rows &&
    map[cell.row][cell.col] !== 1
  );
}

// Handle key presses
document.addEventListener("keydown", (e) => {
  if (gameState === GAME_OVER) {
    if (e.key === "r" || e.key === "R") {
      resetGame();
    }
    return;
  }

  if (e.key === "p" || e.key === "P") {
    gameState = gameState === PLAYING ? PAUSED : PLAYING;
    if (gameState === PLAYING) {
      requestAnimationFrame(gameLoop);
    }
    return;
  }

  switch (e.key) {
    case "ArrowUp":
      pacman.nextDirection = UP;
      break;
    case "ArrowDown":
      pacman.nextDirection = DOWN;
      break;
    case "ArrowLeft":
      pacman.nextDirection = LEFT;
      break;
    case "ArrowRight":
      pacman.nextDirection = RIGHT;
      break;
  }
});

// Reset game
function resetGame() {
  // Reset map (respawn dots)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (map[y][x] === 0 && y > 8 && y < 12 && x > 7 && x < 12) {
        continue; // Don't add dots to ghost house
      } else if (map[y][x] === 0) {
        map[y][x] = 2; // Add dots back
      }
    }
  }

  // Reset pacman
  pacman.x = 10;
  pacman.y = 15;
  pacman.direction = RIGHT;
  pacman.nextDirection = RIGHT;
  pacman.powerMode = false;
  pacman.powerModeTime = 0;

  // Reset ghosts
  ghosts[0] = {
    x: 9,
    y: 10,
    direction: LEFT,
    color: ghostColors[0],
    speed: 3,
    scared: false,
  };
  ghosts[1] = {
    x: 10,
    y: 10,
    direction: RIGHT,
    color: ghostColors[1],
    speed: 3,
    scared: false,
  };
  ghosts[2] = {
    x: 9,
    y: 11,
    direction: LEFT,
    color: ghostColors[2],
    speed: 3,
    scared: false,
  };
  ghosts[3] = {
    x: 10,
    y: 11,
    direction: RIGHT,
    color: ghostColors[3],
    speed: 3,
    scared: false,
  };

  // Reset game state
  score = 0;
  lives = 3;
  dotsEaten = 0;
  gameState = PLAYING;

  // Update score display
  scoreElement.textContent = score;

  // Start game loop
  requestAnimationFrame(gameLoop);
}

// Draw map
function drawMap() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cellValue = map[row][col];
      const { x, y } = getCellPosition(row, col);

      if (cellValue === 1) {
        // Draw wall
        ctx.fillStyle = "blue";
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      } else if (cellValue === 2) {
        // Draw dot
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (cellValue === 3) {
        // Draw power pellet
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

// Draw pacman
function drawPacman() {
  const { x, y, radius, direction, mouthOpen } = pacman;

  ctx.fillStyle = "yellow";
  ctx.beginPath();

  // Calculate mouth angles
  let startAngle, endAngle;

  if (direction === RIGHT) {
    startAngle = 0.2 * Math.PI * mouthOpen;
    endAngle = 2 * Math.PI - 0.2 * Math.PI * mouthOpen;
  } else if (direction === LEFT) {
    startAngle = Math.PI + 0.2 * Math.PI * mouthOpen;
    endAngle = Math.PI - 0.2 * Math.PI * mouthOpen;
  } else if (direction === UP) {
    startAngle = 1.5 * Math.PI + 0.2 * Math.PI * mouthOpen;
    endAngle = 1.5 * Math.PI - 0.2 * Math.PI * mouthOpen;
  } else if (direction === DOWN) {
    startAngle = 0.5 * Math.PI + 0.2 * Math.PI * mouthOpen;
    endAngle = 0.5 * Math.PI - 0.2 * Math.PI * mouthOpen;
  }

  ctx.arc(x, y, radius, startAngle, endAngle);
  ctx.lineTo(x, y);
  ctx.fill();

  // Animate mouth
  pacman.mouthOpen += 0.1 * pacman.mouthDir;
  if (pacman.mouthOpen >= 1 || pacman.mouthOpen <= 0) {
    pacman.mouthDir *= -1;
  }
}

// Draw ghosts
function drawGhosts() {
  ghosts.forEach((ghost) => {
    const { x, y, color, scared } = ghost;

    // Draw ghost body
    ctx.fillStyle = scared
      ? Math.floor(Date.now() / 200) % 2 === 0
        ? "blue"
        : "white"
      : color;
    ctx.beginPath();
    ctx.arc(x, y, pacman.radius, Math.PI, 0, false);
    ctx.lineTo(x + pacman.radius, y + pacman.radius);

    // Draw ghost "skirt"
    const waveCount = 4;
    const waveWidth = (2 * pacman.radius) / waveCount;
    for (let i = 0; i < waveCount; i++) {
      const waveX = x + pacman.radius - (i + 1) * waveWidth;
      ctx.lineTo(waveX, y + pacman.radius * 0.7);
      ctx.lineTo(waveX - waveWidth / 2, y + pacman.radius);
    }

    ctx.lineTo(x - pacman.radius, y + pacman.radius);
    ctx.lineTo(x - pacman.radius, y);
    ctx.fill();

    // Draw eyes
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(
      x - pacman.radius / 2.5,
      y - pacman.radius / 5,
      pacman.radius / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      x + pacman.radius / 2.5,
      y - pacman.radius / 5,
      pacman.radius / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw pupils
    if (!scared) {
      ctx.fillStyle = "black";

      // Move pupils based on direction
      let leftPupilX = x - pacman.radius / 2.5;
      let leftPupilY = y - pacman.radius / 5;
      let rightPupilX = x + pacman.radius / 2.5;
      let rightPupilY = y - pacman.radius / 5;

      if (ghost.direction === RIGHT) {
        leftPupilX += 2;
        rightPupilX += 2;
      } else if (ghost.direction === LEFT) {
        leftPupilX -= 2;
        rightPupilX -= 2;
      } else if (ghost.direction === UP) {
        leftPupilY -= 2;
        rightPupilY -= 2;
      } else if (ghost.direction === DOWN) {
        leftPupilY += 2;
        rightPupilY += 2;
      }

      ctx.beginPath();
      ctx.arc(leftPupilX, leftPupilY, pacman.radius / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(rightPupilX, rightPupilY, pacman.radius / 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw scared eyes
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;

      // X eyes
      ctx.beginPath();
      ctx.moveTo(x - pacman.radius / 2, y - pacman.radius / 3);
      ctx.lineTo(x - pacman.radius / 4, y);
      ctx.moveTo(x - pacman.radius / 4, y - pacman.radius / 3);
      ctx.lineTo(x - pacman.radius / 2, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + pacman.radius / 4, y - pacman.radius / 3);
      ctx.lineTo(x + pacman.radius / 2, y);
      ctx.moveTo(x + pacman.radius / 2, y - pacman.radius / 3);
      ctx.lineTo(x + pacman.radius / 4, y);
      ctx.stroke();

      // Scared mouth
      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.moveTo(x - pacman.radius / 2, y + pacman.radius / 3);
      ctx.lineTo(x - pacman.radius / 4, y + pacman.radius / 5);
      ctx.lineTo(x, y + pacman.radius / 3);
      ctx.lineTo(x + pacman.radius / 4, y + pacman.radius / 5);
      ctx.lineTo(x + pacman.radius / 2, y + pacman.radius / 3);
      ctx.stroke();
    }
  });
}

// Draw lives
function drawLives() {
  for (let i = 0; i < lives; i++) {
    const x = 30 + i * 25;
    const y = 30;

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(x, y, 8, 0.2 * Math.PI, 2 * Math.PI - 0.2 * Math.PI);
    ctx.lineTo(x, y);
    ctx.fill();
  }
}

// Update pacman
function updatePacman() {
  const { x, y, direction, nextDirection, speed } = pacman;

  // Try to change direction if next direction is set
  if (nextDirection !== direction) {
    const nextX = x + nextDirection.x * speed;
    const nextY = y + nextDirection.y * speed;

    if (isValidPosition(nextX, nextY)) {
      pacman.direction = nextDirection;
    }
  }

  // Move pacman in current direction
  const newX = x + direction.x * speed;
  const newY = y + direction.y * speed;

  if (isValidPosition(newX, newY)) {
    pacman.x = newX;
    pacman.y = newY;
  }

  // Check for dot collision
  const cell = getCellIndices(pacman.x, pacman.y);
  if (map[cell.row][cell.col] === 2) {
    map[cell.row][cell.col] = 0;
    score += 10;
    dotsEaten++;
  } else if (map[cell.row][cell.col] === 3) {
    map[cell.row][cell.col] = 0;
    score += 50;
    dotsEaten++;
    pacman.powerMode = true;
    pacman.powerModeTime = 0;

    // Make ghosts scared
    ghosts.forEach((ghost) => {
      ghost.scared = true;
    });
  }

  // Update score display
  scoreElement.textContent = score;

  // Check for win condition
  if (dotsEaten === totalDots) {
    gameState = GAME_OVER;
  }

  // Update power mode timer
  if (pacman.powerMode) {
    pacman.powerModeTime++;
    if (pacman.powerModeTime > 300) {
      // 5 seconds at 60fps
      pacman.powerMode = false;

      // Make ghosts not scared
      ghosts.forEach((ghost) => {
        ghost.scared = false;
      });
    }
  }

  // Check for ghost collision
  ghosts.forEach((ghost) => {
    const dx = ghost.x - pacman.x;
    const dy = ghost.y - pacman.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < pacman.radius + pacman.radius) {
      if (ghost.scared) {
        // Eat ghost
        ghost.x = 10 * cellSize;
        ghost.y = 10 * cellSize;
        ghost.scared = false;
        score += 200;
        scoreElement.textContent = score;
      } else {
        // Die
        lives--;
        if (lives <= 0) {
          gameState = GAME_OVER;
        } else {
          pacman.x = 10 * cellSize + cellSize / 2;
          pacman.y = 15 * cellSize + cellSize / 2;
          pacman.direction = RIGHT;
          pacman.nextDirection = RIGHT;

          // Reset ghosts
          ghosts[0] = {
            x: 9 * cellSize + cellSize / 2,
            y: 10 * cellSize + cellSize / 2,
            direction: LEFT,
            color: ghostColors[0],
            speed: 3,
            scared: false,
          };
          ghosts[1] = {
            x: 10 * cellSize + cellSize / 2,
            y: 10 * cellSize + cellSize / 2,
            direction: RIGHT,
            color: ghostColors[1],
            speed: 3,
            scared: false,
          };
          ghosts[2] = {
            x: 9 * cellSize + cellSize / 2,
            y: 11 * cellSize + cellSize / 2,
            direction: LEFT,
            color: ghostColors[2],
            speed: 3,
            scared: false,
          };
          ghosts[3] = {
            x: 10 * cellSize + cellSize / 2,
            y: 11 * cellSize + cellSize / 2,
            direction: RIGHT,
            color: ghostColors[3],
            speed: 3,
            scared: false,
          };
        }
      }
    }
  });
}

// Get possible directions at position
function getPossibleDirections(x, y) {
  const directions = [];

  if (isValidPosition(x + RIGHT.x * cellSize, y + RIGHT.y * cellSize)) {
    directions.push(RIGHT);
  }
  if (isValidPosition(x + LEFT.x * cellSize, y + LEFT.y * cellSize)) {
    directions.push(LEFT);
  }
  if (isValidPosition(x + UP.x * cellSize, y + UP.y * cellSize)) {
    directions.push(UP);
  }
  if (isValidPosition(x + DOWN.x * cellSize, y + DOWN.y * cellSize)) {
    directions.push(DOWN);
  }

  return directions;
}

// Get opposite direction
function getOppositeDirection(direction) {
  if (direction === RIGHT) return LEFT;
  if (direction === LEFT) return RIGHT;
  if (direction === UP) return DOWN;
  if (direction === DOWN) return UP;
  return direction;
}

// Update ghosts
function updateGhosts() {
  ghosts.forEach((ghost) => {
    // Adjust ghost speed based on scared state
    const speed = ghost.scared ? 2 : ghost.speed;

    // Check if ghost is at a grid cell center
    const cell = getCellIndices(ghost.x, ghost.y);
    const cellCenter = getCellPosition(cell.row, cell.col);
    const atCellCenter =
      Math.abs(ghost.x - cellCenter.x) < speed &&
      Math.abs(ghost.y - cellCenter.y) < speed;

    if (atCellCenter) {
      // Snap to center
      ghost.x = cellCenter.x;
      ghost.y = cellCenter.y;

      // Get possible directions
      let directions = getPossibleDirections(ghost.x, ghost.y);

      // Remove opposite direction (no turning back)
      const oppositeDir = getOppositeDirection(ghost.direction);
      directions = directions.filter(
        (dir) => dir.x !== oppositeDir.x || dir.y !== oppositeDir.y
      );

      // If no valid directions (dead end), allow turning back
      if (directions.length === 0) {
        directions.push(oppositeDir);
      }

      // Choose a random direction if scared
      if (ghost.scared) {
        ghost.direction =
          directions[Math.floor(Math.random() * directions.length)];
      } else {
        // Simple chase AI: Move towards pacman
        // Calculate distance to pacman for each direction
        let minDistance = Infinity;
        let bestDirection = ghost.direction;

        directions.forEach((dir) => {
          const nextX = ghost.x + dir.x * cellSize;
          const nextY = ghost.y + dir.y * cellSize;
          const dx = nextX - pacman.x;
          const dy = nextY - pacman.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < minDistance) {
            minDistance = distance;
            bestDirection = dir;
          }
        });

        ghost.direction = bestDirection;
      }
    }

    // Move ghost in current direction
    ghost.x += ghost.direction.x * speed;
    ghost.y += ghost.direction.y * speed;

    // Handle tunnel wraparound
    if (ghost.x < 0) ghost.x = canvas.width;
    if (ghost.x > canvas.width) ghost.x = 0;
  });
}

// Draw game over screen
function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "yellow";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";

  if (dotsEaten === totalDots) {
    ctx.fillText("YOU WIN!", canvas.width / 2, canvas.height / 2 - 40);
  } else {
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40);
  }

  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
  ctx.fillText(
    "Press 'R' to restart",
    canvas.width / 2,
    canvas.height / 2 + 40
  );
}

// Draw pause screen
function drawPaused() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "yellow";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);

  ctx.font = "20px Arial";
  ctx.fillText(
    "Press 'P' to continue",
    canvas.width / 2,
    canvas.height / 2 + 40
  );
}

// Game loop
function gameLoop() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw map
  drawMap();

  // Update game objects if playing
  if (gameState === PLAYING) {
    updatePacman();
    updateGhosts();
    requestAnimationFrame(gameLoop);
  }

  // Draw game objects
  drawPacman();
  drawGhosts();
  drawLives();

  // Draw game state overlays
  if (gameState === GAME_OVER) {
    drawGameOver();
  } else if (gameState === PAUSED) {
    drawPaused();
  }
}

// Initialize and start game
resetGame();
