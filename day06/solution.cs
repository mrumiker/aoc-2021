using System;
using System.IO; //for importing data
using System.Collections.Generic; // for Lists

class Program {
  public static void Main (string[] args) {
    //Problem A
    static void countFish1(string fish, int dayCount) {
      //import data into list
      var fishAges = new List<int>(Array.ConvertAll(fish.Split(','), int.Parse));

      //loop through days, adding new fish as they are spawned
      for (int day = 0; day < dayCount; day++) {

        int spawnCount = 0;

        for (int i = 0; i < fishAges.Count; i++) {
          if (fishAges[i] == 0) {
            spawnCount++;
            fishAges[i] = 6;
          } else {
            fishAges[i]--;
          }
        }
        for (int i = 0; i < spawnCount; i++) {
          fishAges.Add(8);
        }
        
      }
    //print the Answer: the length of the list after all fish are spawned
    Console.WriteLine(fishAges.Count);
    }

    //Problem B
    static void countFish2(string fish, int dayCount) {
      //store the ages of the original fish in an array
      int[] firstFish = Array.ConvertAll(fish.Split(','), int.Parse);
      //add those original fish to the count
      long fishCount = firstFish.Length;

      //make an array of zeroes, one for each day. This will hold a count of the fish born each day
      long[] spawnArr = new long[dayCount]; 

      //Loop through the first fish and put a count of each of their immediate children on the appropriate day in spawnArr
      for (int i = 0; i < firstFish.Length; i++) {
        int fishAge = firstFish[i];
        for (int day = fishAge; day < dayCount; day += 7) {
          spawnArr[day]++;
        }
      }

      //Loop through the array of born counts, adding the children of the children
      for (int day = 0; day < dayCount; day++) {
        long bornToday = spawnArr[day];
        for (int i = day + 9; i < dayCount; i += 7) {
          spawnArr[i] += bornToday;
        } 
      }
      //add the sum of the born array to the original fish count
      for (int i = 0; i < dayCount; i++) {
        fishCount += spawnArr[i];
      }
      //return the answer for problem B
      Console.WriteLine(fishCount);
    }

    string data = File.ReadAllText("day06data.txt");
    countFish1(data, 80);
    countFish2(data, 256);
  }
}
