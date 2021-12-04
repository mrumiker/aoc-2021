//Import Data

const fs = require('fs');

const myArr = fs.readFileSync('day04data.txt').toString().split("\n");

//Process Data

const numArr = myArr[0].split(',');

const boardsRaw = myArr.slice(1);

const boardsArr = [];

for (let i = 0; i < boardsRaw.length; i++) {
  if (!boardsRaw[i]) {
    boardsArr.push([]);
  } else {
    boardsArr[boardsArr.length - 1].push(boardsRaw[i].split(' ').filter(x => x !== ''));
  } 
}

//Solve Problem A
let winner = [];
let winningNum = 0;

for (const num of numArr) {

  markBoards(boardsArr, num);

  for (i in boardsArr) {
    const board = boardsArr[i];
    if (rowWin(board) || columnWin(board)) {
      winner = boardsArr.splice(i, 1)[0];
      winningNum = +num;
      break;
    }
  }
  if (winner.length) {
    break;
  }
}

calcAnswer(winner); //Problem A answer

//Solve Problem B
for (let i = numArr.indexOf(winningNum + '') + 1; i < numArr.length; i++) {

  const num = numArr[i];

  markBoards(boardsArr, num);

  for (let j in boardsArr) {
    const board = boardsArr[j];
    if (rowWin(board) || columnWin(board)) {
      winner = boardsArr.splice(j, 1)[0];
      winningNum = +num;
      j--;
    }
  }

  if (!boardsArr.length) break;
  
}

calcAnswer(winner); //Problem B answer


//Helper Functions

function rowWin(board) {
  return board.some(row => row.every(space => space === 'X'));
} //detects whether a row is complete

function columnWin(board) {
  for (let i = 0; i < 5; i++) {
    if (board.every(row => row[i] === 'X')) return true;
  }
  return false;
} //detects whether a column is complete

function markBoards(boards, num) {
  for (const board of boards) {
    let numFound = false;
    for (const row of board) {
      for (let i = 0; i < 5; i++) {
        if (num === row[i]) {
          row[i] = 'X';
          winningNum = +num;
          numFound = true;
          break;
        }
      }
    if (numFound) break;
    }
  }
} //when a number is called, the function marks the space on each board with an X  

function calcAnswer(winner) {
  for (let i = 0; i < 5; i++) {
    winner[i] = winner[i].filter(space => space !== 'X').map(numStr => +numStr);
  }

  console.log(winner.flat().reduce((a, b) => a + b) * winningNum);

} //takes the winning board, adds up the unused squares and multiplies by the winning number
