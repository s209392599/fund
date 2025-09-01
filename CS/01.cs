public class TabManager
{
    private TabControl _tabControl;
    private List<TabPage> _allTabs = new List<TabPage>();
    private Dictionary<string, bool> _tabVisibility = new Dictionary<string, bool>();

    public TabManager(TabControl tabControl)
    {
        _tabControl = tabControl;
    }

    // 批量创建TabPages
    public void CreateTabs(int count)
    {
        _allTabs.Clear();
        _tabVisibility.Clear();
        
        for (int i = 1; i <= count; i++)
        {
            var tab = new TabPage()
            {
                Name = $"tab_{i}",
                Text = $"tab_{i}",
                Tag = i  // 使用整数Tag
            };
            
            _allTabs.Add(tab);
            _tabVisibility[tab.Name] = true; // 默认全部显示
        }
        
        RefreshTabs();
    }

    // 切换显示/隐藏
    public void ToggleTabVisibility(string tabName, bool visible)
    {
        if (_tabVisibility.ContainsKey(tabName))
        {
            _tabVisibility[tabName] = visible;
            RefreshTabs();
        }
    }

    // 重新排序并显示
    private void RefreshTabs()
    {
        _tabControl.TabPages.Clear();
        
        var visibleTabs = _allTabs
            .Where(tab => _tabVisibility[tab.Name])
            .OrderBy(tab => (int)tab.Tag)  // 按Tag的整数值排序
            .ToList();
        
        foreach (var tab in visibleTabs)
        {
            _tabControl.TabPages.Add(tab);
        }
    }

    // 显示所有
    public void ShowAllTabs()
    {
        foreach (var key in _tabVisibility.Keys.ToList())
        {
            _tabVisibility[key] = true;
        }
        RefreshTabs();
    }

    // 隐藏所有
    public void HideAllTabs()
    {
        foreach (var key in _tabVisibility.Keys.ToList())
        {
            _tabVisibility[key] = false;
        }
        RefreshTabs();
    }
}