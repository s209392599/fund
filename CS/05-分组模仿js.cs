using System;
using System.Collections.Generic;

// 定义 Item 类
public class Item
{
    public string name { get; set; }
    public int num { get; set; }
}

class Program
{
    public static void Main(string[] args)
    {
        string msg = "";

        var data = new List<Item>
        {
            new Item { name = "1#-1", num = 1 },
            new Item { name = "2#-2", num = 1 },
            new Item { name = "2#-1", num = 1 },
            new Item { name = "2#-2", num = 1 },
            new Item { name = "2#-3", num = 1 },
            new Item { name = "3#-1", num = 1 }
        };

        string flag_str = "";
        foreach(var item in data)
        {
            var str_1 = item.name ?? ""; // 使用 ?? 而不是 ||
            var arr_1 = str_1.Split('#', StringSplitOptions.RemoveEmptyEntries);
            
            if(arr_1.Length > 0 && arr_1[0] != flag_str)
            {
                msg += "\n";
                flag_str = arr_1[0]; // 修正变量名 arr_1
            }
            msg += ";;" + str_1;
        }

        Console.WriteLine($"'{msg}'");
    }
}