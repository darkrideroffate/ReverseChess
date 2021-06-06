SIZE = 400;

// class Board {
//   static boardFromBoard(_board) {
//     board = _.cloneDeep(_board.board);
//     lastBoardNumber = _board.lastBoardNumber + 1;
//     return new Board(board, lastBoardNumber);
//   }
//   constructor(board, lastBoardNumber) {
//     this.board = _.cloneDeep(board);
//     this.lastBoardNumber = lastBoardNumber;
//   }
// }
class Piece {
  constructor(name) {
    this.img = loadImage("pieces/" + name + ".svg");
    this.imgR = loadImage("pieces/" + name + "r" + ".svg");
    this.name = name;
    this.pressed = false;
  }
}
class BoardSquare {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.piece = null;
    this.color = (this.x + this.y) % 2 == 0 ? 225 : 75;
  }
  drawSquare() {
    if (pressedSquare === this) {
      fill(10);
    } else {
      fill(this.color);
    }
    square(this.x * (SIZE / 8), this.y * (SIZE / 8), SIZE / 8);
  }
  drawPiece() {
    if (!turn) {
      image(
        this.piece.imgR,
        this.x * (SIZE / 8) + (SIZE / 8 - 45) / 2,
        this.y * (SIZE / 8) + (SIZE / 8 - 45) / 2
      );
    } else {
      image(
        this.piece.img,
        this.x * (SIZE / 8) + (SIZE / 8 - 45) / 2,
        this.y * (SIZE / 8) + (SIZE / 8 - 45) / 2
      );
    }
  }
  contains(x, y) {
    if (
      x >= this.x &&
      x <= this.x + SIZE / 8 &&
      y >= this.y &&
      y <= this.y + SIZE / 8
    ) {
      return true;
    }
    return false;
  }
}

let names = [
  ["plt", "rlt", "nlt", "blt", "klt", "qlt"],
  ["pdt", "rdt", "ndt", "bdt", "kdt", "qdt"],
];
let board = [];
let boards = [];
let turn = true; //white
let pressedSquare = null;
function preload() {
  for (let y = 0; y < 8; y++) {
    board.push(new Array());
    for (let x = 0; x < 8; x++) {
      board[y].push(new BoardSquare(x, y));
    }
  }

  for (let index = 0; index < 8; index++) {
    board[6][index].piece = new Piece(names[0][0]);
    board[1][index].piece = new Piece(names[1][0]);
  }
  //White
  board[7][0].piece = new Piece(names[0][1]);
  board[7][7].piece = new Piece(names[0][1]);
  board[7][1].piece = new Piece(names[0][2]);
  board[7][6].piece = new Piece(names[0][2]);
  board[7][2].piece = new Piece(names[0][3]);
  board[7][5].piece = new Piece(names[0][3]);
  board[7][4].piece = new Piece(names[0][4]);
  board[7][3].piece = new Piece(names[0][5]);
  //BLACK
  board[0][0].piece = new Piece(names[1][1]);
  board[0][7].piece = new Piece(names[1][1]);
  board[0][1].piece = new Piece(names[1][2]);
  board[0][6].piece = new Piece(names[1][2]);
  board[0][2].piece = new Piece(names[1][3]);
  board[0][5].piece = new Piece(names[1][3]);
  board[0][4].piece = new Piece(names[1][4]);
  board[0][3].piece = new Piece(names[1][5]);
  // boards.push(new Board(board, 0));
}
function setup() {
  createCanvas(SIZE, SIZE);
  angleMode(DEGREES);
}

function draw() {
  background(220);
  if (!turn) {
    translate(SIZE, SIZE);

    rotate(180);
  }
  drawBoard();
}
function mousePressed() {
  let squarey = floor(mouseY / (SIZE / 8)),
    squarex = floor(mouseX / (SIZE / 8));
  if (!turn) {
    squarex = 7 - squarex;
    squarey = 7 - squarey;
  }
  const selected = board[squarey][squarex];

  if (pressedSquare === null) {
    pressedSquare = selected;
  } else if (pressedSquare === selected) {
    pressedSquare = null;
  } else {
    if (
      pressedSquare.piece !== null &&
      (selected.piece === null || selected.piece.name.charAt(0) !== "k")
    ) {
      switch (pressedSquare.piece.name.charAt(0)) {
        case "p": //Pawn
          if (pressedSquare.piece.name.charAt(1) === "l") {
            //white
            if (
              (selected.x === pressedSquare.x &&
                selected.y === pressedSquare.y - 1) ||
              (pressedSquare.y == 6 &&
                selected.x === pressedSquare.x &&
                selected.y === pressedSquare.y - 2)
            ) {
              if (
                selected.piece === null &&
                board[pressedSquare.y - 1][pressedSquare.x].piece === null
              ) {
                nextTurn(selected);
              }
            } else if (
              selected.piece !== null &&
              selected.x - pressedSquare.x == 1 &&
              selected.y === pressedSquare.y - 1
            ) {
              nextTurn(selected);
            } else if (
              selected.piece !== null &&
              selected.x - pressedSquare.x == -1 &&
              selected.y === pressedSquare.y - 1
            ) {
              nextTurn(selected);
            }
          } else if (pressedSquare.piece.name.charAt(1) === "d") {
            if (
              (selected.x === pressedSquare.x &&
                selected.y === pressedSquare.y + 1) ||
              (pressedSquare.y == 1 &&
                selected.x === pressedSquare.x &&
                selected.y === pressedSquare.y + 2)
            ) {
              if (
                selected.piece === null &&
                board[pressedSquare.y + 1][pressedSquare.x].piece === null
              ) {
                nextTurn(selected);
              }
            } else if (
              selected.piece !== null &&
              selected.x - pressedSquare.x == -1 &&
              selected.y === pressedSquare.y + 1
            ) {
              nextTurn(selected);
            } else if (
              selected.piece !== null &&
              selected.x - pressedSquare.x == +1 &&
              selected.y === pressedSquare.y + 1
            ) {
              nextTurn(selected);
            }
          }
          break;
        case "r":
          if (
            (selected.x === pressedSquare.x ||
              selected.y === pressedSquare.y) &&
            findInPath(pressedSquare, selected)
          ) {
            nextTurn(selected);
          }
          break;
        case "n":
          if (
            (Math.abs(selected.x - pressedSquare.x) == 2 &&
              Math.abs(selected.y - pressedSquare.y) == 1) ||
            (Math.abs(selected.x - pressedSquare.x) == 1 &&
              Math.abs(selected.y - pressedSquare.y) == 2)
          ) {
            nextTurn(selected);

            // boards.push(Board.boardFromBoard(boards[boards.length - 1]));
          }
          break;
        case "b":
          if (
            Math.abs(selected.x - pressedSquare.x) ===
              Math.abs(selected.y - pressedSquare.y) &&
            findInPath(pressedSquare, selected)
          ) {
            nextTurn(selected);
          }
          break;
        case "q":
          if (
            (Math.abs(selected.x - pressedSquare.x) ===
              Math.abs(selected.y - pressedSquare.y) ||
              selected.x === pressedSquare.x ||
              selected.y === pressedSquare.y) &&
            findInPath(pressedSquare, selected)
          ) {
            nextTurn(selected);
          }
          break;
        case "k":
          if (
            (Math.abs(selected.x - pressedSquare.x) == 1 &&
              selected.y === pressedSquare.y) ||
            (Math.abs(selected.y - pressedSquare.y) == 1 &&
              selected.x === pressedSquare.x) ||
            (Math.abs(selected.x - pressedSquare.x) == 1 &&
              Math.abs(selected.y - pressedSquare.y) == 1)
          ) {
            nextTurn(selected);
          }
          break;
        default:
          break;
      }
      //   pressedSquare.piece = null;
    }
    pressedSquare = null;
  }
}

function drawBoard() {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      board[y][x].drawSquare();
    }
  }
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (board[y][x].piece !== null) {
        board[y][x].drawPiece();
      }
    }
  }
}
function findInPath(square0, selectedSquare) {
  if (square0.x === selectedSquare.x || square0.y === selectedSquare.y) {
    //veritcal and horizontal
    if (square0.x === selectedSquare.x) {
      //vertical y
      if (square0.y > selectedSquare.y) {
        //up
        for (let index = square0.y - 1; index > selectedSquare.y; index--) {
          if (board[index][square0.x].piece !== null) {
            return false;
          }
        }
        return true;
      } else {
        //down
        for (let index = square0.y + 1; index < selectedSquare.y; index++) {
          if (board[index][square0.x].piece !== null) {
            return false;
          }
        }
        return true;
      }
    } else {
      //horizontal x
      if (square0.x > selectedSquare.x) {
        //left
        for (let index = square0.x - 1; index > selectedSquare.x; index--) {
          if (board[square0.y][index].piece !== null) {
            return false;
          }
        }
        return true;
      } else {
        //right
        for (let index = square0.x + 1; index < selectedSquare.x; index++) {
          if (board[square0.y][index].piece !== null) {
            return false;
          }
        }
        return true;
      }
    }
  } else {
    //diagonal
    if (selectedSquare.x > square0.x && selectedSquare.y < square0.y) {
      //up right
      for (
        let x = square0.x + 1, y = square0.y - 1;
        x < selectedSquare.x && y > selectedSquare.y;
        x++, y--
      ) {
        if (board[y][x].piece !== null) {
          return false;
        }
      }
      return true;
    } else if (selectedSquare.x < square0.x && selectedSquare.y < square0.y) {
      //up left
      for (
        let x = square0.x - 1, y = square0.y - 1;
        x > selectedSquare.x && y > selectedSquare.y;
        x--, y--
      ) {
        if (board[y][x].piece !== null) {
          return false;
        }
      }
      return true;
    } else if (selectedSquare.x > square0.x && selectedSquare.y > square0.y) {
      //down right
      for (
        let x = square0.x + 1, y = square0.y + 1;
        x < selectedSquare.x && y < selectedSquare.y;
        x++, y++
      ) {
        if (board[y][x].piece !== null) {
          return false;
        }
      }
      return true;
    } else {
      //down left
      for (
        let x = square0.x - 1, y = square0.y + 1;
        x > selectedSquare.x && y < selectedSquare.y;
        x--, y++
      ) {
        if (board[y][x].piece !== null) {
          return false;
        }
      }
      return true;
    }
  }
}

function nextTurn(selected) {
  if (pressedSquare.piece.name.charAt("1") === "l" && turn) {
    selected.piece = pressedSquare.piece;
    pressedSquare.piece = null;
    turn = turn ? false : true;
  } else if (pressedSquare.piece.name.charAt("1") === "d" && !turn) {
    selected.piece = pressedSquare.piece;
    pressedSquare.piece = null;
    turn = turn ? false : true;
  }
  console.log(turn);
  document.getElementById("turn").innerText =
    (turn ? "white" : "black") + " plays";
}
