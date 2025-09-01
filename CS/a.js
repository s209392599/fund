// 1. 获取甘特图实例
var gantt = new PlusGantt();

// 2. 定义列
var columns = [
    { header: "任务名称", field: "Name", width: 200 },
    {
        header: "计划开始日期",
        field: "Start",
        width: 150,
        editor: {
            type: "datepicker" // 或者 "datebox"
        }
    },
    // ... 其他列
];

// 3. 设置列
gantt.setColumns(columns);

// 4. 监听单元格编辑结束事件
gantt.on("cellendedit", function (e) {
    var record = e.record; // 当前行的数据
    var field = e.field;   // 当前编辑的字段
    var value = e.value;   // 编辑后的新值

    // 判断是否是“计划开始日期”列
    if (field === "Start") {
        console.log("计划开始日期已更改为: " + value);
        console.log("对应的任务是: " + record.Name);

        // 在这里编写您的业务逻辑，例如：
        // - 更新数据库
        // - 重新计算相关任务的日期
        // - 弹出提示等
    }
});

// 加载数据等其他操作...
gantt.loadData(your_data_here);
gantt.render(document.getElementById("gantt_container"));
