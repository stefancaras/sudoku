import { easy } from "./games.js";

const $ = (query) => document.querySelector(query);
const boxes = document.querySelectorAll(".box");
let board, solved;
let i = 0;

$("#table").addEventListener("keydown", (event) => {
  const array = event.target.dataset.id.split("");
  if (typeof board[array[0]][array[1]] === "number") {
    if (event.key.match(/[1-9]/)) {
      event.target.textContent = event.key;
      board[array[0]][array[1]] = Number(event.key);
      if (board[array[0]][array[1]] === solved[array[0]][array[1]]) {
        event.target.style.color = "green";
      } else event.target.style.color = "red";
    } else if (event.key === "Backspace" || event.key === "Delete") {
      event.target.textContent = "";
      board[array[0]][array[1]] = 0;
    }
    if (board.join("") === solved.join("")) {
      $(".msg").style.display = "block";
    }
  }
});

$("#buttons").addEventListener("click", (event) => {
  $(".msg").style.display = "none";
  if (event.target.id === "new") {
    newGame();
  } else if (event.target.id === "solve") {
    if (!solve(board)) errorMsg();
    else fillBoxes();
  } else if (event.target.id === "clear") {
    board = board.map((el) => el.fill(0));
    fillBoxes();
    solved = solved.map((el) => el.fill(0));
  }
});

const fillBoxes = () => {
  boxes.forEach((el) => {
    const array = el.dataset.id.split("");
    if (board[array[0]][array[1]] === 0) {
      el.textContent = "";
    } else {
      el.textContent = board[array[0]][array[1]];
      el.style.color = "black";
    }
  });
};

const solve = (board) => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        for (let n = 1; n < 10; n++) {
          if (possible(i, j, n, board)) {
            board[i][j] = n;
            if (solve(board)) return true;
            board[i][j] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const possible = (y, x, n, board) => {
  let x0 = Math.floor(x / 3) * 3;
  let y0 = Math.floor(y / 3) * 3;
  for (let i = 0; i < 9; i++) {
    if (i === 3 || i === 6) {
      x0 -= 3;
      y0++;
    }
    if (board[y][i] == n || board[i][x] == n || board[y0][x0] == n) {
      return false;
    }
    x0++;
  }
  return true;
};

const errorMsg = () => {
  $(".error").style.display = "block";
  setTimeout(() => {
    $(".error").style.display = "none";
  }, 2000);
};

const newGame = () => {
  board = [];
  easy[i].forEach((el) => board.push([...el]));
  fillBoxes();
  solved = [];
  board.forEach((el) => solved.push([...el]));
  solve(solved);
  i++;
  if (i === 5) i = 0;
};
newGame();
