
dataGridView1.SelectionChanged += dataGridView1_SelectionChanged;
dataGridView1.CellClick += dataGridView1_CellClick;
dataGridView1.CellDoubleClick += dataGridView1_CellDoubleClick;
dataGridView1.CellFormatting += dataGridView1_CellFormatting;
dataGridView1.CellPainting += dataGridView1_CellPainting;
dataGridView1.CellValueChanged += dataGridView1_CellValueChanged;
dataGridView1.CellValidating += dataGridView1_CellValidating;
dataGridView1.CellValidated += dataGridView1_CellValidated;
dataGridView1.RowsAdded += dataGridView1_RowsAdded;
dataGridView1.RowsRemoved += dataGridView1_RowsRemoved;
dataGridView1.CellContextMenuStripNeeded += dataGridView1_CellContextMenuStripNeeded;
dataGridView1.CellMouseClick += dataGridView1_CellMouseClick;
dataGridView1.CellMouseDoubleClick += dataGridView1_CellMouseDoubleClick;
dataGridView1.CellMouseMove += dataGridView1_CellMouseMove;
dataGridView1.CellMouseLeave += dataGridView1_CellMouseLeave;
dataGridView1.CellMouseEnter += dataGridView1_CellMouseEnter;
dataGridView1.CellMouseLeave += dataGridView1_CellMouseLeave;



private DataGridViewCell _lastSelectedCell = null;

private void dataGridView1_SelectionChanged(object sender, EventArgs e)
{
    if (dataGridView1.SelectedCells.Count == 0)
        return;
    
    var currentCell = dataGridView1.SelectedCells[0];
    
    // 只有当选择的单元格真正改变时才处理
    if (_lastSelectedCell != currentCell)
    {
        _lastSelectedCell = currentCell;
        
        // 你的处理逻辑
        ProcessSelection();
    }
}



c# 建立一个类似js中的一个对象{a:[{},{}]},数组里面放的事

tabControl1.TabPages.Clear();

避免闪烁
tabControl1.SuspendLayout();
tabControl1.TabPages.Clear();
tabControl1.ResumeLayout();


// 创建带唯一标识的 TabPage
TabPage adminTab = new TabPage
{
    Name = "adminTab", // 唯一标识
    Text = "管理员面板",
    Tag = "Admin" // 附加信息
};

var tabsToShow = new List<string>(); 
// 先显示所有应该显示的
    foreach (var tabName in tabsToShow)
    {
        _tabManager.ShowTab(tabName);
    }

string[] array = { "123_Admin", "123_User", "123_Report" };
MessageBox.Show(string.Join(", ", array));

// 或者换行显示
MessageBox.Show(string.Join("\n", array));


https://mp.weixin.qq.com/s/o7PyHXefwPkYTvtkYzTWSA
https://mp.weixin.qq.com/s/D-z1aMH41Xq5a7FCVW-y_w
https://mp.weixin.qq.com/s/i_2GEZMpFdthS59UZXlupQ
https://mp.weixin.qq.com/s/VEAsLPU2FmdmKzLG47E5rg
