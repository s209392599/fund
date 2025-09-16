using System;
class Program
{
    public static void Main(string[] args)
    {
        string str = "1#-1";
        string[] parts = str.Split('#', StringSplitOptions.RemoveEmptyEntries);
        string firstPart = parts.Length > 0 ? parts[0] : "（空）";
        Console.WriteLine($"输入: '{str}' -> 第一位: '{firstPart}'");
    }
}