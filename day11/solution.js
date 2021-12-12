function dumboOct(inputArr) {

  const arr = inputArr.map(innerArr => [...innerArr]);
  let count = 0,
      step = 0;

  while (true) {
    step++;
    arr.forEach((innerArr, i) => { //set off flashing 🐙🐙🐙
      innerArr.forEach((octo, j) => {
        if (innerArr[j]++ === 9) flash(arr, i, j);
      });
    });

    arr.forEach(innerArr => { //reset all flashed 🐙🐙🐙 to 0
      innerArr.forEach((octo, j) => {
        if (octo > 9) {
          innerArr[j] = 0;
          count++;
        }
      });
    });

    if (step === 100) console.log("Problem A answer is", count);

    if (arr.every(innerArr => innerArr.every(octo => !octo))) {
      console.log("Problem B answer is", step);
      break;
    }
  }
  return;
}

function flash(arr, i, j) { // recursively flash 🐙🐙🐙 around a given 🐙
  for (let m = i - 1; m <= i + 1; m++) {
    const row = arr[m];
    if (row) {
      for (let n = j - 1; n <= j + 1; n++) {
        const current = row[n];
        if ((i !== m || j !== n) && current !== undefined && row[n]++ === 9) {
          flash(arr, m, n);
        }
      }
    }
  }
  return;
}

//Import Data

const fs = require('fs');

//Process data
const dataArr = fs.readFileSync('day11data.txt').toString().split("\n").map(num => num.split('')).map(arr => arr.map(numStr => +numStr));

dumboOct(dataArr);
