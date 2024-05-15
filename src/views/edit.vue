<template>
  <div class="about">
    <div style="height: 15px"></div>

    <div style="height: 5px"></div>

    <el-row>
      <el-button class="opa_btn" type="primary" @click="addInfo">新增</el-button>
      <el-button class="opa_btn" type="primary" @click="copyData">复制数据</el-button>
      <el-button class="opa_btn" type="primary" @click="importDataVisible = true">导入数据</el-button>
      <el-button class="opa_btn" type="primary" @click="importDataZhuyawen">导入朱雅文数据</el-button>
    </el-row>

    <el-table :data="tableData" stripe style="width: 100%" max-height="765" id="viewsAbout">
      <el-table-column fixed type="index" width="34"></el-table-column>
      <el-table-column prop="number" label="代号" min-width="66px"></el-table-column>
      <el-table-column fixed prop="name" label="名称" min-width="160px"></el-table-column>
      <el-table-column prop="remarks" label="备注" min-width="160px"></el-table-column>
      <el-table-column prop="notice" label="提示点位" min-width="90px" class="wert"></el-table-column>
      <el-table-column label="操作" min-width="280px" class="guokun">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row, 1)">编辑</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row, 2)">插入</el-button>
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row, 3)">追加</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="导入数据" v-model="importDataVisible">
      <el-form :model="modelData" class="demo-ruleForm" :rules="rules" ref="importDataModalBox">
        <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="importTextarea">
        </el-input>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="importDataVisible = false">取 消</el-button>
          <el-button type="primary" @click="importDataSure()">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="编辑" v-model="dialogFormVisible">
      <el-form :model="modelData" class="demo-ruleForm" :rules="rules" ref="numberValidateForm">
        <el-form-item label="代号" :label-width="formLabelWidth" prop="number">
          <el-input v-model="modelData.number" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="基金名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="modelData.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
          <el-input v-model="modelData.remarks" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="提示点位" :label-width="formLabelWidth" prop="notice">
          <el-input v-model="modelData.notice" autocomplete="off"></el-input>
        </el-form-item>

        <!-- <el-form-item label="提示点位" :label-width="formLabelWidth" prop="notice">
          <el-input type="number" v-model.number="modelData.notice" autocomplete="off"></el-input>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSure('numberValidateForm')">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Edit',
  data() {
    return {
      sign: null, // 按钮打开的模态框0 编辑进入的模态框1  插入一行2  追加一行3
      dialogFormVisible: false, // 模态框是否显示标识
      modelData: {
        number: '',
        name: '',
        remarks: '',
        notice: '',
      },
      importDataVisible: false, // 导入数据模态框
      importTextarea: '', // 导入数据模态框的内容
      formLabelWidth: '120px',
      rules: {
        number: [
          { required: true, message: '请输入基金代号', trigger: 'blur' },
        ], //type: 'number',trigger: 'change'
        name: [{ required: true, message: '请输入基金名称', trigger: 'blur' }],
      },
      rowsign: null, // 编辑表格时的行号
      tableData: [],
    };
  },
  created() {
    this.tableData = localStorage.getItem('info')
      ? JSON.parse(localStorage.getItem('info'))
      : [];
  },
  methods: {
    importDataSure() {
      eval(`${this.importTextarea}`);
      this.importDataVisible = false;
      this.importTextarea = '';
    },
    // 导入朱雅文数据
    importDataZhuyawen() {
      try {
        var arr = window.globalProperties.defaultArr;
        localStorage.setItem('info', JSON.stringify(arr));
        window.location.reload();
      } catch (err) {
        console.log('导入数据失败', err);
      }
    },
    copyData() {
      // 复制数据
      let str = `var arr =${localStorage.getItem(
        'info'
      )};localStorage.setItem("info",JSON.stringify(arr));window.location.reload();`;
      this.copy(str);
    },
    addInfo() {
      //添加一条信息
      this.sign = 0;
      this.modelData = {
        number: '',
        name: '',
        remarks: '',
        notice: '',
      };
      this.dialogFormVisible = true;
    },
    handleEdit(index, row, sign) {
      this.rowsign = index;
      if (sign == 1) {
        // 点击的是编辑按钮
        this.sign = 1;
        this.modelData = {
          number: row.number,
          name: row.name,
          remarks: row.remarks,
          notice: row.notice,
        };
      } else if (sign == 2) {
        // 点击的是插入按钮
        this.sign = 2;
        this.form = {
          number: '',
          name: '',
          remarks: '',
          notice: '',
        };
      } else if (sign == 3) {
        // 点击的是追加一行那妞
        this.sign = 3;
        this.form = {
          number: '',
          name: '',
          remarks: '',
          notice: '',
        };
      }
      this.dialogFormVisible = true;
    },
    handleDelete(index) {
      // 删除按钮 点击事件
      this.tableData.splice(index, 1);
      localStorage.setItem('info', JSON.stringify(this.tableData));
    },
    editSure(formName) {
      // 模态框 确定事件
      if (this.modelData.notice) {
        // 添加一条信息
        let arr = this.modelData.notice.split(',');
        let len = arr.length;
        if (len == 2) {
          if (Number[0] >= Number[1]) {
            this.$message.error('输入的格式为小到大，如：1.2,1.3');
            return;
          }
        } else {
          this.$message.error('输入的格式为小到大，如：1.2,1.3');
          return;
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.sign == 0) {
            // 新增
            this.tableData.push(this.modelData);
          } else if (this.sign == 1) {
            // 修改
            this.tableData[this.rowsign] = this.modelData;
          } else if (this.sign == 2) {
            // 插入
            this.tableData.splice(this.rowsign, 0, this.modelData);
          } else if (this.sign == 3) {
            // 追加
            console.log(this.rowsign);
            this.tableData.splice(this.rowsign + 1, 0, this.modelData);
          }
          localStorage.setItem('info', JSON.stringify(this.tableData));
          this.dialogFormVisible = false;
          this.modelData = {
            number: '',
            name: '',
            remarks: '',
            notice: '',
          };
        } else {
          return false;
        }
      });
    },
    copy(data) {
      let url = data;
      let oInput = document.createElement('input');
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand('Copy'); // 执行浏览器复制命令
      this.$message({
        message: '复制成功',
        type: 'success',
      });
      oInput.remove();
    },
  },
};
</script>

<style>
.opa_btn {
  padding: 0px 10px;
  margin: 0 0 5px 5px;
}

#viewsAbout td,
#viewsAbout th {
  padding: 2px 0 !important;
}

.el-table .cell {
  padding-left: 5px;
  padding-right: 5px;
}

.el-overlay .el-dialog {
  min-width: 375px;
}

.wert {
  color: red !important;
  background-color: #f00 !important;
}

.el-table__body tr.hover-row.el-table__row--striped>td,
.el-table__body tr.hover-row>td {
  background-color: #e0e2e8;
  color: #303133;
}

.el-table__body tr.hover-row.el-table__row--striped>td.el-table__cell,
.el-table__body tr.hover-row>td.el-table__cell {
  background-color: #e0e2e8;
}
</style>
