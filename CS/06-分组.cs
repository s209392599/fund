using System;
using System.Collections.Generic;
using System.Linq;

public class Item
{
    public string name { get; set; }
    public int num { get; set; }
}

class Program
{
    public static void Main(string[] args)
    {
        var data = new List<Item>
        {
            new Item { name = "1#-1", num = 1 },
            new Item { name = "1#-2", num = 1 },
            new Item { name = "2#-1", num = 1 },
            new Item { name = "2#-2", num = 1 },
            new Item { name = "2#-3", num = 1 },
            new Item { name = "3#-1", num = 1 }
        };

        string flag_str = "";
        var msgParts = new List<string>();
        
        foreach(var item in data)
        {
            var prefix = item.name.Split('#').FirstOrDefault() ?? "";
            
            if(prefix != flag_str && !string.IsNullOrEmpty(flag_str))
            {
                msgParts.Add("\n");
            }
            
            msgParts.Add(";;" + item.name);
            flag_str = prefix;
        }

        string msg = string.Join("", msgParts);
        Console.WriteLine($"'{msg}'");
    }
}