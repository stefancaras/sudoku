import { easy } from "./games.js";

const $ = (query) => document.querySelector(query);
const boxes = document.querySelectorAll(".box");
let board, solved;
let iter = 0;

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
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (board[y][x] === 0) {
        for (let n = 1; n < 10; n++) {
          if (possible(y, x, n, board)) {
            board[y][x] = n;
            if (solve(board)) return true;
            board[y][x] = 0;
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
    if (
      (board[y][i] == n && i !== x) ||
      (board[i][x] == n && i !== y) ||
      (board[y0][x0] == n && y0 !== y && x0 !== x)
    ) {
      return false;
    }
    x0++;
  }
  return true;
};

const isValid = (board) => {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (board[y][x] !== 0) {
        if (!possible(y, x, board[y][x], board)) {
          return false;
        }
      }
    }
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
  easy[iter].forEach((el) => board.push([...el]));
  fillBoxes();
  solved = [];
  board.forEach((el) => solved.push([...el]));
  solve(solved);
  iter++;
  if (iter === 5) iter = 0;
};
newGame();

$("#table").addEventListener("keydown", (event) => {
  event.preventDefault();
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
  // Use keyboard arrows for navigation
  if (event.key === "ArrowRight") {
    event.target.nextElementSibling?.focus();
  } else if (event.key === "ArrowLeft") {
    event.target.previousElementSibling?.focus();
  } else if (event.key === "ArrowUp") {
    let index = event.target.cellIndex;
    event.target.parentElement.previousElementSibling?.cells[index].focus();
  } else if (event.key === "ArrowDown") {
    let index = event.target.cellIndex;
    event.target.parentElement.nextElementSibling?.cells[index].focus();
  }
});

$("#buttons").addEventListener("click", (event) => {
  $(".msg").style.display = "none";
  if (event.target.id === "new") {
    newGame();
  } else if (event.target.id === "solve") {
    if (!isValid(board) || !solve(board)) errorMsg();
    else fillBoxes();
  } else if (event.target.id === "clear") {
    board = board.map((el) => el.fill(0));
    fillBoxes();
    solved = solved.map((el) => el.fill(0));
  }
});
