let board = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]]

const $ = query => document.querySelector(query)
const boxes = document.querySelectorAll(".box")

const fillBoxes = () => {
  boxes.forEach(el => {
    const array = el.dataset.id.split("")
    if (board[array[0]][array[1]] !== 0) {
      el.textContent = board[array[0]][array[1]]
    } else el.textContent = ""
  })
}
fillBoxes()

$("#table").addEventListener("keydown", (event) => {
  const array = event.target.dataset.id.split("")
  if (event.key.match(/[1-9]/)) {
    event.target.textContent = event.key
    board[array[0]][array[1]] = Number(event.key)
  } else if (event.key === "Backspace" || event.key === "Delete") {
    event.target.textContent = ""
    board[array[0]][array[1]] = 0
  }
  console.table(board)
})
$("#buttons").addEventListener("click", (event) => {
  if (event.target.id === "solve") {
    solve()
    fillBoxes()
  } else if (event.target.id === "clear") {
    board = board.map(el => el.fill(0))
    fillBoxes()
  }
})

const solve = () => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        for (let n = 1; n < 10; n++) {
          if (possible(i, j, n)) {
            board[i][j] = n
            if (solve()) return true
            board[i][j] = 0
          }
        }
        return
      }
    }
  }
  return true
};

const possible = (y, x, n) => {
  let x0 = Math.floor(x / 3) * 3
  let y0 = Math.floor(y / 3) * 3
  for (let i = 0; i < 9; i++) {
    if (i === 3 || i === 6) {
      x0 -= 3
      y0++
    }
    if (board[y][i] === n || board[i][x] === n || board[y0][x0] === n) {
      return false
    }
    x0++
  }
  return true
};

