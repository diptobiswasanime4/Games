const canvas = document.getElementById("sudokuCanvas");
const ctx = canvas.getContext("2d");
const cellSize = 50;
let selectedCell = null;

// Initial Sudoku puzzle (0 represents empty cells)
const puzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

// Working grid that player can modify
let grid = JSON.parse(JSON.stringify(puzzle));

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      if (grid[row][col] !== 0) {
        // Original numbers in black, player-entered in blue
        ctx.fillStyle = puzzle[row][col] !== 0 ? "black" : "blue";
        ctx.fillText(
          grid[row][col],
          col * cellSize + cellSize / 2,
          row * cellSize + cellSize / 2
        );
      }
    }
  }

  // Highlight selected cell
  if (selectedCell) {
    ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
    ctx.fillRect(
      selectedCell.col * cellSize,
      selectedCell.row * cellSize,
      cellSize,
      cellSize
    );
  }
}

function handleClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  // Only allow selection of editable cells (not original numbers)
  if (puzzle[row][col] === 0) {
    selectedCell = { row, col };
    drawGrid();
  }
}

function setNumber() {
  if (selectedCell) {
    const value = parseInt(document.getElementById("numberInput").value);
    if (value >= 1 && value <= 9) {
      grid[selectedCell.row][selectedCell.col] = value;
      drawGrid();
    }
    document.getElementById("numberInput").value = "";
  }
}

function clearCell() {
  if (selectedCell && puzzle[selectedCell.row][selectedCell.col] === 0) {
    grid[selectedCell.row][selectedCell.col] = 0;
    drawGrid();
  }
}

// Event listeners
canvas.addEventListener("click", handleClick);
document.getElementById("numberInput").addEventListener("change", setNumber);

// Initial draw
drawGrid();
