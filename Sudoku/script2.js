const canvas = document.getElementById("sudokuCanvas");
const ctx = canvas.getContext("2d");
const cellSize = 50;
let solutionRevealed = false;

// Function to generate a random Sudoku solution
function generateSudoku() {
  const grid = Array(9)
    .fill()
    .map(() => Array(9).fill(0));

  function isValid(grid, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }
    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }
    // Check 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }
    return true;
  }

  function solve(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          // Shuffle numbers
          for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
          }
          for (let num of numbers) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              if (solve(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve(grid);
  return grid;
}

// Generate initial solution
let solution = generateSudoku();

// Create puzzle by hiding some cells
let puzzle = JSON.parse(JSON.stringify(solution));
const cellsToHide = 40;
for (let i = 0; i < cellsToHide; i++) {
  const row = Math.floor(Math.random() * 9);
  const col = Math.floor(Math.random() * 9);
  puzzle[row][col] = 0;
}

// Working grid for player input
let grid = JSON.parse(JSON.stringify(puzzle));

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw cell backgrounds when solution is revealed
  if (solutionRevealed) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          ctx.fillStyle = "orange"; // Empty cells
        } else if (grid[row][col] === solution[row][col]) {
          ctx.fillStyle = "green"; // Correct numbers
        } else {
          ctx.fillStyle = "red"; // Incorrect numbers
        }
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }

  // Draw grid lines
  ctx.lineWidth = 1;
  for (let i = 0; i <= 9; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }

  // Draw thicker lines for 3x3 boxes
  ctx.lineWidth = 3;
  for (let i = 0; i <= 9; i += 3) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(canvas.width, i * cellSize);
    ctx.stroke();
  }

  // Draw numbers
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (!solutionRevealed) {
        if (grid[row][col] !== 0) {
          ctx.fillStyle = puzzle[row][col] !== 0 ? "black" : "blue";
          ctx.fillText(
            grid[row][col],
            col * cellSize + cellSize / 2,
            row * cellSize + cellSize / 2
          );
        }
      } else {
        ctx.fillStyle = puzzle[row][col] !== 0 ? "black" : "blue";
        ctx.fillText(
          solution[row][col],
          col * cellSize + cellSize / 2,
          row * cellSize + cellSize / 2
        );
      }
    }
  }
}

function handleClick(event) {
  if (solutionRevealed) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  if (puzzle[row][col] === 0) {
    let currentValue = grid[row][col];
    if (currentValue === 0) {
      grid[row][col] = 1;
    } else if (currentValue === 9) {
      grid[row][col] = 0;
    } else {
      grid[row][col]++;
    }
    drawGrid();
  }
}

function revealSolution() {
  solutionRevealed = true;
  drawGrid();
}

function newGame() {
  solutionRevealed = false;
  solution = generateSudoku();
  puzzle = JSON.parse(JSON.stringify(solution));
  for (let i = 0; i < cellsToHide; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    puzzle[row][col] = 0;
  }
  grid = JSON.parse(JSON.stringify(puzzle));
  drawGrid();
}

// Event listener
canvas.addEventListener("click", handleClick);

// Initial draw
drawGrid();
