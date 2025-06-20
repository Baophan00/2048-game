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
      tile.style.color = board[r][c] > 64 ? "#000" : "#ffffff"; // màu chữ tùy độ sáng
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
    0: "#1c1b27",     // Nền ô trống (màu nền tối)
    2: "#004c42",     // Xanh đậm
    4: "#006a5b",     // Xanh rêu
    8: "#008c72",     // Xanh ngọc nhạt
    16: "#00bfa5",    // Xanh ngọc sáng
    32: "#00e6b8",    // Xanh mint
    64: "#00ffcc",    // Xanh ngọc rực
    128: "#3af2d2",   // Sáng hơn
    256: "#77f5df",
    512: "#a8f8ec",
    1024: "#d2fbf5",
    2048: "#ffffff"   // Trắng sáng chói
  };
  return colors[val] || "#ffffff";
}

function updateScore() {
  document.getElementById("score").textContent = score;
}

// 🟥 Game Over logic
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

document.getElementById("restart").addEventListener("click", () => {
  document.getElementById("game-over").style.display = "none";
  setup();
  updateBoard();
  generate();
  generate();
});
