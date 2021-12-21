using System;
using System.IO; //for importing data

class Program {
  public static void Main (string[] args) {
    static void trenchMap(char[,] squareArr, string key, int count) {

      int length = squareArr.GetLength(0);

      char[,] newImage = new char[length + 2, length + 2];

      char[,] oldImage = squareArr.Clone() as char[,];

      for (int i = 0; i < count; i++) {
        for (int j = 0; j < length + 2; j++) {
          for (int k = 0; k < length + 2; k++) {
            newImage[j,k] = findPixel(j, k, oldImage, key, i);
          }
        }
     
        if (i != count - 1) {
          length += 2;
          oldImage = new char[length, length];
          oldImage = newImage.Clone() as char[,];
          newImage = new char[length + 2, length + 2];
        }
        
      }
      int pixelCount = 0; 
      for (int i = 0; i < newImage.GetLength(0); i++) {
        for (int j = 0; j < newImage.GetLength(1); j++) {
          
          if (newImage[i,j] == '#') {
            pixelCount++;
          }
        }
      }
      Console.WriteLine(pixelCount);
    }

    static char findPixel(int row, int column, char[,] oldImage, string key, int count) {
      string binary = "";
      for (int i = row - 2; i <= row; i++) {
        for (int j = column - 2; j <= column; j++) {
          char current;
          try {
            if (oldImage[i,j] == '#') {
              current = '1';
            }
            else {
              current = '0';
            }
          }
          catch {
            if (count % 2 == 1) {
              current = '1';
            } 
            else {
              current = '0';
            }
            
          }
          binary += current;
        }
      }
      
      int num = Convert.ToInt32(binary, 2);
      return key[num];
    }

    string data = File.ReadAllText("day20data.txt");
    string[] dataArr = data.Split("\n\n");
    string key = dataArr[0];
    string[] squareLines = dataArr[1].Split("\n");
    char[,] squareArr = new char[squareLines.Length, squareLines.Length];
    for (int i = 0; i < squareLines.Length; i++) {
      char[] chars; 
      chars = squareLines[i].ToCharArray(0, squareLines[i].Length); 
      for (int j = 0; j < squareLines[0].Length; j++) {
        squareArr[i,j] = chars[j];
      }
      
    }

    trenchMap(squareArr, key, 2);
    trenchMap(squareArr, key, 50);

  }
}
