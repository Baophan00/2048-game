let board = [];
let score = 0;

document.addEventListener("DOMContentLoaded", () => {
  setup();
  updateBoard();
  generate();
  generate();
  updateScore();
});

function setup() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  score = 0;
  updateScore();
}

function updateBoard() {
  const grid = document.getElementById("grid-container");
  grid.innerHTML = "";
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.textContent = board[r][c] === 0 ? "" : board[r][c];
      tile.style.background = getTileColor(board[r][c]);
      grid.appendChild(tile);
    }
  }
}

function generate() {
  let empty = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
  updateBoard();
}

document.addEventListener("keydown", handleInput);

function handleInput(e) {
  let played = false;
  if (e.key === "ArrowLeft") played = moveLeft();
  else if (e.key === "ArrowRight") played = moveRight();
  else if (e.key === "ArrowUp") played = moveUp();
  else if (e.key === "ArrowDown") played = moveDown();

  if (played) {
    generate();
    if (isGameOver()) {
      showGameOver();
    }
  }
}

function slide(row) {
  row = row.filter(val => val);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  updateScore();
  return row.filter(val => val).concat(Array(4 - row.filter(val => val).length).fill(0));
}

function moveLeft() {
  let moved = false;
  for (let r = 0; r < 4; r++) {
    const original = [...board[r]];
    board[r] = slide(board[r]);
    if (!moved && board[r].toString() !== original.toString()) moved = true;
  }
  updateBoard();
  return moved;
}

function moveRight() {
  let moved = false;
  for (let r = 0; r < 4; r++) {
    const original = [...board[r]];
    board[r] = slide(board[r].reverse()).reverse();
    if (!moved && board[r].toString() !== original.toString()) moved = true;
  }
  updateBoard();
  return moved;
}

function moveUp() {
  let moved = false;
  for (let c = 0; c < 4; c++) {
    let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const original = [...col];
    col = slide(col);
    for (let r = 0; r < 4; r++) board[r][c] = col[r];
    if (!moved && col.toString() !== original.toString()) moved = true;
  }
  updateBoard();
  return moved;
}

function moveDown() {
  let moved = false;
  for (let c = 0; c < 4; c++) {
    let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const original = [...col];
    col = slide(col.reverse()).reverse();
    for (let r = 0; r < 4; r++) board[r][c] = col[r];
    if (!moved && col.toString() !== original.toString()) moved = true;
  }
  updateBoard();
  return moved;
}

function getTileColor(val) {
  const colors = {
    0: "#22293d",
    2: "#e0f7fa",
    4: "#b2ebf2",
    8: "#4dd0e1",
    16: "#26c6da",
    32: "#00bcd4",
    64: "#00acc1",
    128: "#0097a7",
    256: "#00838f",
    512: "#006064",
    1024: "#004d40",
    2048: "#00363a"
  };
  return colors[val] || "#222";
}

function updateScore() {
  document.getElementById("score").textContent = score;
}

// 🟥 Game Over functions
function isGameOver() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) return false;
      if (c < 3 && board[r][c] === board[r][c + 1]) return false;
      if (r < 3 && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
}

function showGameOver() {
  document.getElementById("game-over").style.display = "block";
}

// 🔁 Restart button
document.getElementById("restart").addEventListener("click", () => {
  document.getElementById("game-over").style.display = "none";
  setup();
  updateBoard();
  generate();
  generate();
});
