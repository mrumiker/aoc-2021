//Import Data

const fs = require('fs');

//Process data
const dataArr = fs.readFileSync('day05data.txt').toString().split("\n").map(line => line.split(' -> ')).map(pairArr => pairArr.map(pair => pair.split(',').map(numStr => +numStr)));

//Sort path ends by direction
const horizontals  = [],
      verticals = [],
      downhillDiagonals = [],
      uphillDiagonals = [];

for (const ends of dataArr) {

  const [[x1, y1], [x2, y2]] = ends;

  if (y1 === y2) horizontals.push(ends);

  else if (x1 === x2) verticals.push(ends);

  else if (Math.sign(x1 - x2) === Math.sign(y1 - y2)) downhillDiagonals.push(ends);

  else uphillDiagonals.push(ends);
  
}

//create pointsObj to keep track of how many times each point is crossed by a vent
const pointsObj = {};

//count will keep track of how many times any point is touched twice by a vent
let count = 0;

//populate pointsObj with a count of all points touched by vertical vents
for (const ends of verticals) {
  const [[x1, y1], [x2, y2]] = ends;
  if (!pointsObj[x1]) pointsObj[x1] = {};
  const [top, bottom] = y2 > y1 && [y1, y2] || [y2, y1]; 
  for (let y = top; y <= bottom; y++) {  
    pointsObj[x1][y] = (pointsObj[x1][y] || 0) + 1;
    if (pointsObj[x1][y] === 2) count++;
  }
}

//update pointsObj by counting all points touched by horizonatal vents
for (const ends of horizontals) {
  const [[x1, y1], [x2, y2]] = ends;
  const [left, right] = x2 > x1 && [x1, x2] || [x2, x1];
  for (let x = left; x <= right; x++) {
    if (!pointsObj[x]) pointsObj[x] = {};
    pointsObj[x][y1] = (pointsObj[x][y1] || 0) + 1; 
    if (pointsObj[x][y1] === 2) count++;
  }
}

//with all the vertical and horizontal vents counted, print the current count to solve problem A
console.log(count);

//update pointsObj by counting all points touched by downhill diagonal vents
for (const ends of downhillDiagonals) {
  const [[x1, y1], [x2, y2]] = ends;
  let [left, right, y] = x2 > x1 && [x1, x2, y1] || [x2, x1, y2];
  for (let x = left; x <= right; x++) {
    if (!pointsObj[x]) pointsObj[x] = {};
    pointsObj[x][y] = (pointsObj[x][y] || 0) + 1; 
    if (pointsObj[x][y] === 2) count++;
    y++;
  }
}

//update pointsObj by counting all points touched by uphill diagonal vents
for (const ends of uphillDiagonals) {
  const [[x1, y1], [x2, y2]] = ends;
  let [left, right, y] = x2 > x1 && [x1, x2, y1] || [x2, x1, y2];
  for (let x = left; x <= right; x++) {
    if (!pointsObj[x]) pointsObj[x] = {};
    pointsObj[x][y] = (pointsObj[x][y] || 0) + 1;
    if (pointsObj[x][y] === 2) count++;
    y--;
  }
}

//Now that the diagonals have been counted, print the answer for problem B
console.log(count);
