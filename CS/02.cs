public class TabPageManager
{
    private TabControl _tabControl;
    private Dictionary<string, TabPage> _hiddenTabs = new Dictionary<string, TabPage>();
    private Dictionary<string, int> _originalPositions = new Dictionary<string, int>();

    public TabPageManager(TabControl tabControl)
    {
        _tabControl = tabControl ?? throw new ArgumentNullException(nameof(tabControl));
        SaveOriginalPositions();
    }

    private void SaveOriginalPositions()
    {
        for (int i = 0; i < _tabControl.TabPages.Count; i++)
        {
            TabPage tab = _tabControl.TabPages[i];
            if (!string.IsNullOrEmpty(tab.Name))
            {
                _originalPositions[tab.Name] = i;
            }
        }
    }

    public void HideTab(string tabName)
    {
        TabPage tab = FindTabByName(tabName);
        if (tab != null && !_hiddenTabs.ContainsKey(tabName))
        {
            _originalPositions[tabName] = _tabControl.TabPages.IndexOf(tab);
            _hiddenTabs[tabName] = tab;
            _tabControl.TabPages.Remove(tab);
        }
    }

    public void ShowTab(string tabName)
    {
        if (_hiddenTabs.TryGetValue(tabName, out TabPage tabToShow))
        {
            // 使用 Tag 属性来确定其原始顺序
            int desiredPosition = -1;
            if (tabToShow.Tag != null && int.TryParse(tabToShow.Tag.ToString(), out desiredPosition))
            {
                int insertionIndex = 0;
                // 遍历当前可见的标签页，找到正确的插入点
                foreach (TabPage visibleTab in _tabControl.TabPages)
                {
                    int visibleTabPosition = -1;
                    if (visibleTab.Tag != null && int.TryParse(visibleTab.Tag.ToString(), out visibleTabPosition))
                    {
                        if (visibleTabPosition < desiredPosition)
                        {
                            insertionIndex++;
                        }
                    }
                }
                _tabControl.TabPages.Insert(insertionIndex, tabToShow);
            }
            else
            {
                // 如果Tag无效，则作为最后的备用方案添加到末尾
                _tabControl.TabPages.Add(tabToShow);
            }
            
            _hiddenTabs.Remove(tabName);
        }
    }

    private TabPage FindTabByName(string tabName)
    {
        return _tabControl.TabPages.Cast<TabPage>()
                    .FirstOrDefault(t => t.Name == tabName);
    }

    public bool IsTabVisible(string tabName)
    {
        return FindTabByName(tabName) != null;
    }

    public List<string> GetHiddenTabs()
    {
        return _hiddenTabs.Keys.ToList();
    }

    public void RestoreAllTabs()
    {
        foreach (var tabKey in _hiddenTabs.Keys.ToList())
        {
            ShowTab(tabKey);
        }
    }
}