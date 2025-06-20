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
  updateScore(); // ← GỌI TẠI ĐÂY để cập nhật điểm khi gộp số
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
    0: "#ccc",
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e"
  };
  return colors[val] || "#3c3a32";
}

// ✅ Hàm cập nhật điểm hiển thị:
function updateScore() {
  document.getElementById("score").textContent = score;
}

// ✅ Xử lý nút Restart
document.getElementById("restart").addEventListener("click", () => {
  setup();
  updateBoard();
  generate();
  generate();
});
