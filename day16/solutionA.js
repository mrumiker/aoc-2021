function decodePacket1(hexStr) {

  let versionsCount = 0;//keep track of the sum of the version numbers

  const binaryStr = hexStr.split('').map(i => parseInt(i, 16).toString(2).padStart(4, '0')).join(''); //from stack Overflow https://stackoverflow.com/questions/45053624/convert-hex-to-binary-in-javascript

  const L = binaryStr.length;

  let startIndex = 0; //keep track of where we are in the binary String

  while (startIndex < L) {

    parsePacket();

  } //we will keep running the parsePacket function until we reach the end of the binaryString

  return versionsCount;

  
  //HELPER FUNCTION
  
  function parsePacket() {

    if ([...binaryStr.slice(startIndex)].every(digit => digit === '0')) {
      startIndex = L;
      return;
    }//if we have reached the point where only the trailing zeroes remain, this will fast-forward to the end of the binaryString and send us back to complete the main function

    const subString = binaryStr.slice(startIndex);//make a slice of the binaryString, starting at our current startIndex. This is the packet that we will examine now

    const versionNum = subString.slice(0, 3); //get the version number from the beginning of subString
    
    versionsCount += parseInt(versionNum, 2); //add the version number to our running sum. 

    //Now that we've gotten the version number, the rest of this function will figure out where the next version number will start

    const typeId = subString.slice(3, 6); 

    if (typeId === '100') { //If this packet is a Literal Value, we can quicky skip through to the next package

      let numStartIndex = 6;

      while (subString[numStartIndex] === '1') numStartIndex += 5;
      
      startIndex += numStartIndex + 5; //set the startIndex to the position right after our number ends and, as long as we aren't at the end of the binary Sting, get ready to run this parse function again

    } else { // if the package is anything other than a Literal Value...

      const lengthTypeId = +subString[6]; //determine the length type indicator 

      const lengthLength = lengthTypeId && 11 || 15; //lengthLength is the length of the binary number that indicates the length of the sub packages

      startIndex += 7 + lengthLength; //set a new startIndex right after the prefix tags we just examined

      if (lengthTypeId) { // if the length of the subpackets is expressed as a count...

        const subPacketsCount = parseInt(subString.slice(7, 18), 2);//find out how many subpackets there are

        for (let i = 0; i < subPacketsCount; i++) { //run this function recursively on each subpacket
          parsePacket();
        }
              
      } else {// if the length of the subpackets is expressed as a number of bits...

        const subPacketsLength = parseInt(subString.slice(7, 22), 2);//find out how many bits
        const goalPost = startIndex + subPacketsLength; //set a goalpost that many bits away

        while (startIndex < goalPost) {//run this function recursively to parse all the packets until you reach the goalpost 
          parsePacket();
        }
        
      }
    }

    return;

  }
}

const fs = require('fs');

const dataStr = fs.readFileSync('day16data.txt').toString();

const testArr = [
  {input: '8A004A801A8002F478', answer: 16},
  {input: '620080001611562C8802118E34', answer: 12},
  {input: 'C0015000016115A2E0802F182340', answer: 23},
  {input: 'A0016C880162017C3686B18A3D4780', answer: 31},
  {input: dataStr, answer: 993},
];

testArr.forEach((test, i) => {
  const output = decodePacket1(test.input);
  console.assert(output === test.answer, `Test${i}\n`, "Expected output:", test.answer, "\n", "Actual output:", output, "\n");
})
console.log("Tests Complete");


