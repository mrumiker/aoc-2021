using System;
using System.IO;
using System.Collections.Generic;

class Program {
  public static void Main (string[] args) {

    static void diagnoseSub(string[] readings) {
      int bitsLength = readings[0].Length;
      int[] counts = new int[bitsLength];
      foreach (string reading in readings) {
        for (int i = 0; i < bitsLength; i++) {
          if (reading[i].Equals('1')) {
            counts.SetValue(counts[i] + 1, i);
          }
        }
      }
      
      string gamma = "";
      string epsilon = "";
      foreach (int count in counts) {
        if (count >= readings.Length / 2) {
          gamma += '1';
          epsilon += '0';
        }
        else {
          gamma += '0';
          epsilon += '1';
        }
      }
      
      Console.WriteLine(Convert.ToInt32(gamma, 2) * Convert.ToInt32(epsilon, 2)); // solution for problem A

      var oxygen = new List<string>();
      var co2 = new List<string>();

      foreach (string reading in readings) {
        if (reading[0].Equals(gamma[0])) {
          oxygen.Add(reading);
        }
        else {
          co2.Add(reading);
        }
      }

      string generator = "";
      string scrubber = "";

      for (int i = 1; i < bitsLength; i++) {
        if (oxygen.Count > 1) {
          decimal count = 0;
          char winner = '0';
          foreach (string reading in oxygen) {
            if (reading[i] == '1') {
              count++;
            }
          }
          decimal oxyLength = oxygen.Count;
          if (count >= oxyLength / 2) {
            winner = '1';
          }

          oxygen.RemoveAll(reading => reading[i] != winner);

          if (oxygen.Count == 1) {
            generator = oxygen[0];
          }
        }

        if (co2.Count > 1) {

        
          decimal count = 0;
          char winner = '0';
          foreach (string reading in co2) {
            if (reading[i] == '1') {
              count++;
            }
          }
          decimal co2Length = co2.Count;
          if (count < co2Length / 2) {
            winner = '1';
          }
          co2.RemoveAll(reading => reading[i] != winner);
          //Console.WriteLine(string.Join(", ", co2));

          if (co2.Count == 1) {
            scrubber = co2[0];
          }

        }
         
      }

      Console.WriteLine(Convert.ToInt32(generator, 2) * Convert.ToInt32(scrubber, 2));   //Solution for Problem B
  }

  string[] data = File.ReadAllLines("day03data.txt");

  diagnoseSub(data);
}
}
