<script setup>
console.log('src/views/preview/tabs/preview_12.vue');

const info = reactive({
  text: '易方达沪深300',
  tableData: [],// 列表数据
});

window.jsonpgz = (data) => {
  console.log('data', data);
  // if (!data) {
  //   info.tableData = info.tableData.filter(item => item.code !== data.fundcode);
  // }
};
window.aaa = (code) => {
  console.log('aaa -- code', code);
};

// 封装为Promise版本
const fetchFundData = (code) => {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonpgz_${code}_${Date.now()}`;
    
    window[callbackName] = (data) => {
      try {
        if (!data || !data.fundcode) {
          console.warn('Empty response for:', code);
          resolve({ code, success: false, data: null });
        } else {
          resolve({ code, success: true, data });
        }
      } catch (error) {
        reject(error);
      } finally {
        // 清理
        delete window[callbackName];
        const script = document.querySelector(`script[src*="${code}.js"]`);
        if (script) script.remove();
      }
    };
    
    const script = document.createElement('script');
    script.src = `https://fundgz.1234567.com.cn/js/${code}.js?callback=${callbackName}`;
    script.onerror = () => reject(new Error(`Failed to load ${code}`));
    document.body.appendChild(script);
  });
};

// 批量处理（推荐）
const getFundGZ = async (codes) => {
  const promises = codes.map(code => fetchFundData(code));
  const results = await Promise.allSettled(promises);
  
  // 处理结果
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      const { code, success, data } = result.value;
      console.log('code', code, 'success', success, 'data', data);
      
      if (!success) {
        // info.tableData = info.tableData.filter(item => item.code !== code);
      } else {
        // 更新数据
        // ...你的业务逻辑
      }
    }
  });
};


// 查看是否可以读取到当日的涨幅
// const getFundGZ = (code) => {
//   info.tableData.forEach((item,index) => {
//     console.log('item.code', item.code);
//     setTimeout(() => {
//       const script = document.createElement('script');
//       script.src = `https://fundgz.1234567.com.cn/js/${item.code}.js?callback=aaa(${item.code})`;
//       document.body.appendChild(script);
//     }, (index + 1) * 10)
//   })
// };

const getList = () => {
  if (info.text.trim() === '') {
    info.tableData = [];
    return;
  }
  server_fund_search_bytiantian({ text: info.text.trim() }).then(res => {
    console.log('res', res);
    if (res.code === 200) {
      // 不以ETF结尾的基金
      info.tableData = [...res.data].filter(item => !item.name.endsWith('ETF'));
      info.tableData.push({
        code: '008164',
        name: 'aaaaaa',
      })
      info.tableData.push({
        code: '008087',
        name: 'bbb',
      })
      // getFundGZ();// 查看是否可以读取到当日的涨幅
      getFundGZ(info.tableData.map(item => item.code));
    } else {
      info.tableData = [];
      ElMessage.error(res.msg || '获取列表失败');
    }
  }).catch(() => {
    info.tableData = [];
    ElMessage.error('获取列表失败');
  });
};
const resetForm = () => {
  info.search = '';
  getList();
};
// 去除A类
const removeA = () => { 
  console.log('去除name最后一个字符是A');
  info.tableData = info.tableData.filter(item => item.name[item.name.length - 1] !== 'A');
};

const addFn = () => {
  console.log('新增');
};
const btn_del = (row, $index) => {
  console.log('删除', row);
  info.tableData.splice($index, 1);
};





</script>

<template>
  <div class="page_wrapper pd-10">
    <div class="search_box">
      <el-form :inline="true">
        <el-form-item label="关键字">
          <el-input v-model="info.text" placeholder="搜索的文字" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="success" @click="removeA">去除A类</el-button>
          <el-button type="success" @click="addFn">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main_box">
      <el-table :data="info.tableData" border style="width: 100%" height="500">
        <el-table-column fixed label="序" type="index" width="50" />
        <el-table-column prop="code" label="代码" width="80" />
        <el-table-column prop="name" label="名称" width="240" show-overflow-tooltip />

        <el-table-column label="Operations" min-width="120">
          <template #default="{ row, $index }">
            <el-button link type="primary" size="small" @click="btn_del(row, $index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
