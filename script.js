const grid = document.getElementById("grid-container");
let tiles = [];

function createBoard() {
  for (let i = 0; i < 16; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = "";
    grid.appendChild(tile);
    tiles.push(tile);
  }
  generate();
  generate();
}

function generate() {
  let empty = tiles.filter(t => t.textContent === "");
  if (empty.length === 0) return;
  let rand = empty[Math.floor(Math.random() * empty.length)];
  rand.textContent = Math.random() > 0.5 ? "2" : "4";
}

document.addEventListener("DOMContentLoaded", createBoard);
