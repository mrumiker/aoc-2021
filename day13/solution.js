function origami(dotsArr, foldArr) {
  const paper = [[]];
  for (let i = 0; i < dotsArr.length; i++) {//create an array of arrays of the appropriate size to represent the paper. A 0 represents each space.
    const [x, y] = dotsArr[i];
    if (!paper[y]) {
      const row = new Array(paper[0].length).fill(0);
      const L = paper.length;
      for (let j = 0; j <= y - L; j++) {
        paper.push([...row]);
      }
    }

    if (paper[y][x] === undefined) {
      const L = paper[0].length;
      for (let j = 0; j < paper.length; j++) {
        for (let k = 0; k <= x - L; k++) {
          paper[j].push(0);
        }

      }
       
    }
    
  }

  for (const pair of dotsArr) { //loop through the dot coordinates and change 0 to 1 on paper to represent each dot
    const [x, y] = pair;
    paper[y][x] = 1;
  }

  let count = 0;
  for (const fold of foldArr) { // start folding!
    
    if (fold.axis === 'y') {
      paper.splice(fold.loc, 1); //cut out the fold!
      const folded = paper.splice(fold.loc);
      folded.reverse();
      for (let i = 0; i < folded.length; i++) {
        const row = folded[i];
        for (let j = 0; j < row.length; j++) {
          if (row[j] === 1) {
            paper[fold.loc - folded.length + i][j] = 1;
          }
        }
        
      }
    }
    if (fold.axis === 'x') {
      for (let i = 0; i < paper.length; i++) {
        const row = paper[i];
        row.splice(fold.loc, 1) // cut out the fold!
        const folded = row.splice(fold.loc);
        folded.reverse();
        for (let j = 0; j < folded.length; j++) {
          if (folded[j] === 1) {
            row[fold.loc - folded.length + j] = 1;
          }
        }
      }
    }
    
  count++;
  if (count === 1) console.log(paper.flat().filter(space => space).length);//Problem A solution
  }

  console.log(paper); //Problem B solution


}


//Import Data

const fs = require('fs');

//Process data
const dataArr = fs.readFileSync('day13data.txt').toString().split("\n\n");

const dotsArr = dataArr[0].split("\n").map(line => line.split(',')).map(pairArr => pairArr.map(numStr => +numStr));

const myArr = dataArr[1].split("\n").map(line => line.split('=')).map(arr => [
  arr[0].charAt(arr[0].length - 1),
  +arr[1]
]);

const foldArr = [];

myArr.forEach(arr => {
  const myObj = {};
  myObj.axis = arr[0];
  myObj.loc = arr[1];
  foldArr.push(myObj);
});

origami(dotsArr, foldArr);

