function decodePacket(hexStr) {

  let outputNum = 0;

  const binaryStr = hexStr.split('').map(i => parseInt(i, 16).toString(2).padStart(4, '0')).join(''); //from stack Overflow https://stackoverflow.com/questions/45053624/convert-hex-to-binary-in-javascript
  //console.log(binaryStr);
  const L = binaryStr.length;

  let startIndex = 0; //keep track of where we are in the binary String

  while (startIndex < L) {

    outputNum += parsePacket();

  } //we will keep running the parsePacket function until we reach the end of the binaryString. Results get added to outputNum

  return outputNum;

  //Helper Functions
  
  function parsePacket() { //this is run on every packet, with the goal of returning a value for that packet

    if ([...binaryStr.slice(startIndex)].every(digit => digit === '0')) {
      startIndex = L;
      return 0;
    }//if we have reached the point where only the trailing zeroes remain, this will fast-forward to the end of the binaryString and send us back to complete the main function

    const subString = binaryStr.slice(startIndex);//make a slice of the binaryString, starting at our current startIndex. We will examine the first packet in this string now.

    const typeId = subString.slice(3, 6);

    if (typeId === '100') { //If this packet is a Literal Value, we figure out and return its value

      let numStartIndex = 6;

      let binaryNum = '';

      while (subString[numStartIndex] === '1') {//keep going through the string, adding each group of four bits with a '1' on the front to your string
        binaryNum += subString.slice(numStartIndex + 1, numStartIndex + 5);
        numStartIndex += 5;
      }
      binaryNum += subString.slice(numStartIndex + 1, numStartIndex + 5);
      startIndex += numStartIndex + 5; //when we get to the last group of bits in the Literal Value, add it to the end of our string
      return parseInt(binaryNum, 2);//parse the binary string and return an int

    } else {// if the package is not a Literal Value...
      
      const myArr = [];//create an array to store the values of the package's children

      processPacket(myArr, subString);//run the processPacket function, which will push the values into myArr by calling this function recursively

      switch (typeId) {//check the typeId of the packet, process the values in myArr accordingly, and return the result
        case '000': //sum
          return myArr.reduce((a, b) => a + b);
        case '001': //product
          return myArr.reduce((a, b) => a * b);
        case '010': //minimum
          return Math.min(...myArr);
        case '011'://maximum
          return Math.max(...myArr);
        case '101'://greater than
          return myArr[0] > myArr[1] && 1 || 0;
        case '110'://less than
          return myArr[0] < myArr[1] && 1 || 0;
        case '111'://equal
          return myArr[0] === myArr[1] && 1 || 0;
      }
  
    }

  }

  function processPacket(arr, str) {

    const lengthTypeId = +str[6];

    const lengthLength = lengthTypeId && 11 || 15; //lengthLength is the length of the binary number that indicates the length of the sub packages, derived from lengthTypeId

    startIndex += 7 + lengthLength; //set a new startIndex right after the prefix tags we just examined

    if (lengthTypeId) { // if the length of the subpackets is expressed as a count...

      const subPacketsCount = parseInt(str.slice(7, 18), 2);//find out how many subpackets there are

      for (let i = 0; i < subPacketsCount; i++) { //run the parsePacket function recursively on each subpacket to get the values you need into the array 
        arr.push(parsePacket());
      }
            
    } else {//// if the length of the subpackets is expressed as a number of bits...

      const subPacketsLength = parseInt(str.slice(7, 22), 2);//find out how many bits
      const goalPost = startIndex + subPacketsLength; //set a goalpost that many bits away

      while (startIndex < goalPost) {//run the parsePacket function recursively on each subpacket to get the values you need into the array 
        
        arr.push(parsePacket());

      }
        
    }
    return;
  }
}

const fs = require('fs');

const dataStr = fs.readFileSync('day16data.txt').toString();

console.log(decodePacket(dataStr));

const testArr = [
  {input: 'C200B40A82', answer: 3},
  {input: '04005AC33890', answer: 54},
  {input: '880086C3E88112', answer: 7},
  {input: 'CE00C43D881120', answer: 9},
  {input: 'D8005AC2A8F0', answer: 1},
  {input: 'F600BC2D8F', answer: 0},
  {input: '9C005AC2F8F0', answer: 0},
  {input: '9C0141080250320F1802104A08', answer: 1},
];

testArr.forEach((test, i) => {
  const output = decodePacket(test.input);
  console.assert(output === test.answer, `Test${i}\n`, "Expected output:", test.answer, "\n", "Actual output:", output, "\n");
})
console.log("Tests Complete");
