//--- Day 21: Dirac Dice ---

// There's not much to do as you slowly descend to the bottom of the ocean. The submarine computer challenges you to a nice game of Dirac Dice.

// This game consists of a single die, two pawns, and a game board with a circular track containing ten spaces marked 1 through 10 clockwise. Each player's starting space is chosen randomly (your puzzle input). Player 1 goes first.

// Players take turns moving. On each player's turn, the player rolls the die three times and adds up the results. Then, the player moves their pawn that many times forward around the track (that is, moving clockwise on spaces in order of increasing value, wrapping back around to 1 after 10). So, if a player is on space 7 and they roll 2, 2, and 1, they would move forward 5 times, to spaces 8, 9, 10, 1, and finally stopping on 2.

// After each player moves, they increase their score by the value of the space their pawn stopped on. Players' scores start at 0. So, if the first player starts on space 7 and rolls a total of 5, they would stop on space 2 and add 2 to their score (for a total score of 2). The game immediately ends as a win for any player whose score reaches at least 1000.

// A compartment opens, labeled Dirac dice. Out of it falls a single three-sided die.

// As you experiment with the die, you feel a little strange. An informational brochure in the compartment explains that this is a quantum die: when you roll it, the universe splits into multiple copies, one copy for each possible outcome of the die. In this case, rolling the die always splits the universe into three copies: one where the outcome of the roll was 1, one where it was 2, and one where it was 3.

// The game is played the same as before, although to prevent things from getting too far out of hand, the game now ends when either player's score reaches at least 21.

// Using the starting positions (player one: 4 / player two: 8), player 1 wins in 444356092776315 universes, while player 2 merely wins in 341960390180808 universes.

// Using your given starting positions, determine every possible outcome. Find the player that wins in more universes; in how many universes does that player win?

function diracDice(player1Start, player2Start) {
  let myObj = {};//create initial object with space to count all possible game scenarios (10 spaces, 20 point totals, 2 players)
  for (let i = 1; i <= 10; i++) {
    myObj[i] = {};
    for (let j = 1; j <= 20; j++) {
      myObj[i][j] = {};
      for (let k = 0; k <= 10; k++) {
        myObj[i][j][k] = {};
        for (let l = 0; l <= 20; l++) {
          myObj[i][j][k][l] = 0;
        }
      }
    }
  }
  //simulate first turn
  let player1Space = (player1Start + 3) % 10 || 10; //player 1 rolls 3 and moves to space

  const freqArr = [1, 3, 6, 7, 6, 3, 1]; //contains number of times each roll will happen, starting with a roll of 3 and going to 9

  for (let i = 0; i < 7; i++) { //loop through freqArr and place the number of games in which player one will get to each space on her first time in myObj
    const freq = freqArr[i];
    myObj[player1Space][player1Space][0][0] = freq;
    player1Space = nextSpace(player1Space);
  }

  for (const spacePlayerOne in myObj) { //loop through myObj
    const currentFreq = myObj[spacePlayerOne][spacePlayerOne][0][0];
    if (currentFreq) {//if we reach a space reached by player one on one of her first moves, create 27 more games based on that move, one for each of player 2's first moves
      let spacePlayerTwo = (player2Start + 3) % 10 || 10;
      for (let i = 0; i < 7; i++) {
        const newFreq = freqArr[i];
        myObj[spacePlayerOne][spacePlayerOne][spacePlayerTwo][spacePlayerTwo] = newFreq * currentFreq;
        myObj[spacePlayerOne][spacePlayerOne][0][0] = 0;
        spacePlayerTwo = nextSpace(spacePlayerTwo);
      }  
    }  
  } 
  //each player has done his or her first move in all the games now, so we get ready for the real thing now
  let player1Wins = 0,
      player2Wins = 0,
      round = 0; //counters for keeping track of the win count for each player and what round we are on.

  let done = false;//flag to test whether there are any game scenarios still in progress

  while (!done) { //here is where the magic happens. We go turn by turn, alternating between players one and two. We work with two Objects: myObj (the old object from the previous turn) and newObj, which starts as a blank object and gets filled in as we go. We check the count of games currently with each combination of spaces and scores for each player. For each of these, we count 27 more game scenarios and add them into the newObj where they belong. However, if any games reach a score of 21 or higher in this round, we add to the player's win count instead. If there are still games going when we finish the round, we set the newObj as myObj and go to the next round

    done = true;
    round++;

    const newObj = generateNewObj();

    if (round % 2) {//player one's turn
      for (const spacePlayerOne in myObj) {
        const currentSpace = +spacePlayerOne;
        for (const scorePlayerOne in myObj[spacePlayerOne]) {
          const currentScore = +scorePlayerOne;
          for (const spacePlayerTwo in myObj[spacePlayerOne][scorePlayerOne]) {
            for (const scorePlayerTwo in myObj[spacePlayerOne][scorePlayerOne][spacePlayerTwo]) {
              const currentFreq = myObj[spacePlayerOne][scorePlayerOne][spacePlayerTwo][scorePlayerTwo];
              if (currentFreq) {
                let newSpace = (currentSpace + 3) % 10 || 10;
                for (let i = 0; i < 7; i++) {
                  const newScore = currentScore + newSpace;
                  const newFreq = freqArr[i];
                  if (newScore >= 21) { //player one wins!
                    player1Wins += currentFreq * newFreq;
                  } else {
                    done = false;
                    newObj[newSpace][newScore][spacePlayerTwo][scorePlayerTwo] += currentFreq * newFreq;
                  }
                  newSpace = nextSpace(newSpace);
                }
              }
            }
          }
        }
      }
    } else {//player two's turn
      for (const spacePlayerOne in myObj) {
        for (const scorePlayerOne in myObj[spacePlayerOne]) {
          for (const spacePlayerTwo in myObj[spacePlayerOne][scorePlayerOne]) {
            const currentSpace = +spacePlayerTwo;
            for (const scorePlayerTwo in myObj[spacePlayerOne][scorePlayerOne][spacePlayerTwo]) {
              const currentScore = +scorePlayerTwo;
              const currentFreq = myObj[spacePlayerOne][scorePlayerOne][spacePlayerTwo][scorePlayerTwo];
              if (currentFreq) {
                let newSpace = (currentSpace + 3) % 10 || 10;
                for (let i = 0; i < 7; i++) {
                  const newScore = currentScore + newSpace;
                  const newFreq = freqArr[i];
                  if (newScore >= 21) { //player 2 wins!
                    player2Wins += currentFreq * newFreq;
                  } else {
                    done = false;
                    newObj[spacePlayerOne][scorePlayerOne][newSpace][newScore] += currentFreq * newFreq;
                  }
                  newSpace = nextSpace(newSpace);
                }
              }
            }
          }
        }
      }
    }
    if (!done) myObj = newObj;  
  }
  return Math.max(player1Wins, player2Wins); //find out who won more times and return that number 
}

function nextSpace(currentSpace) {
  return (currentSpace + 1) % 10 || 10; 
}

function generateNewObj() {
  const myObj = {};
  for (let i = 1; i <= 10; i++) {
    myObj[i] = {};
    for (let j = 1; j <= 20; j++) {
      myObj[i][j] = {};
      for (let k = 1; k <= 10; k++) {
        myObj[i][j][k] = {};
        for (let l = 1; l <= 20; l++) {
          myObj[i][j][k][l] = 0;
        }
      }
    }
  }
  return myObj;
}


console.log(diracDice(4, 9)); //My puzzle input was player 1 starts on space 4, player two on space 9. Any two spaces (from 1 to 10) may be entered here.


