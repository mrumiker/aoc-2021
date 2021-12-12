//Import Data

const fs = require('fs');

//Process Data

const dataArr = fs.readFileSync('day10data.txt').toString().split("\n");

const matcher = { 
  ')': {open: '(', points: 3, points2: 1},
  ']': {open: '[', points: 57, points2: 2},
  '}': {open: '{', points: 1197, points2: 3},
  '>': {open: '<', points: 25137, points2: 4},
} 

let answer1 = 0;
let ans2Arr = [];

dataArr.forEach(str => {
  const ansObj = balancedBrackets(str);
  answer1 += ansObj.points;
  ans2Arr.push(ansObj.points2);
})

ans2Arr = ans2Arr.filter(item => item !== null);

ans2Arr.sort((a, b) => a - b);

const answer2 = ans2Arr[Math.floor(ans2Arr.length / 2)];

console.log(answer1); //Problem A solution
console.log(answer2); //Problem B solution

function balancedBrackets(str) {
  const stack = [];
  for (let i = 0; i < str.length; i++) { 
    if (Object.values(matcher).some(obj => obj.open === str[i])) {
      stack.push(str[i]);  
    } else if (Object.keys(matcher).includes(str[i])) {
      const closer = str[i],
            opener = stack.pop();
      if (opener !== matcher[closer].open) return {
        points: matcher[closer].points,
        points2: null,
      };    
    } 
  }
  let count = 0;
  const entries = Object.entries(matcher);
  for (let i = stack.length - 1; i >= 0; i--) {
    const closer = entries.find(arr => arr[1].open === stack[i])[0];
    count *= 5;
    count += matcher[closer].points2;
  }
  return {
    points: 0,
    points2: count,
  }; 
}
