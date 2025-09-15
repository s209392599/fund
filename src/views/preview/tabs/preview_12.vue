<script setup>
console.log('src/views/preview/tabs/preview_12.vue');

const info = reactive({
  text: '中证A500',
  tableData: [],// 列表数据
});

// 转换服务器上的数据为table使用的
const turnSearchData = (data) => {

}
/*
jd_header_tag: jd_header_tag,// 头部标签
{"rankList":[],"highlights":{"tagList":["基金规模大"],"morningstarRating":"4"},"userFocus":[],"themeNameList":["半导体","机器视觉"]}
{"rankList":["连续5年跑赢同类 · 第9名"],"highlights":{"tagList":[],"morningstarRating":"2"},"userFocus":[],"themeNameList":["农产品加工","免税店"]}


jd_historyPerformance,// 历史业绩
[{"avg":"2.36","rate":"2.12","name":"近1周","rank":"2495/4881"},
{"avg":"11.12","rate":"11.20","name":"近1月","rank":"2032/4859"},
{"avg":"23.08","rate":"28.29","name":"近3月","rank":"1210/4719"},
{"avg":"22.01","rate":"26.57","name":"近6月","rank":"1236/4609"},
{"avg":"57.35","rate":"55.06","name":"近1年","rank":"1913/4416"},
{"avg":"30.09","rate":"29.99","name":"今年以来","rank":"2013/4881"},
{"avg":"7.60","rate":"-17.99","name":"近3年","rank":"2772/3171"},
{"avg":"649.70","rate":"145.30","name":"成立以来","rank":"135/162"}]


jd_fundDiagnosis,// 综合诊断
99|29|11|51


jd_proportion,// 持仓分类占比
18.58|83.99|2.99|0.00|0.00


jd_totalAsset,// 资产
35940533.08


jd_chi_cang,// 持仓详情(股票占比)
{
  "stock":[
    {"name":"宁德时代","industryName":"电池","ratio":"1.26%"},
    {"name":"路维光电","industryName":"半导体","ratio":"1.16%"},
    {"name":"比亚迪","industryName":"汽车整车","ratio":"1.11%"},
    {"name":"科伦药业","industryName":"化学制药","ratio":"1.10%"},
    {"name":"中航沈飞","industryName":"军工装备","ratio":"1.06%"},
    {"name":"永兴材料","industryName":"能源金属","ratio":"0.93%"},
    {"name":"恺英网络","industryName":"游戏","ratio":"0.92%"},
    {"name":"潮宏基","industryName":"服装家纺","ratio":"0.81%"},
    {"name":"芯原股份","industryName":"半导体","ratio":"0.81%"},
    {"name":"中金黄金","industryName":"贵金属","ratio":"0.81%"}
  ],
  "bond":[
    {"name":"国债2420","industryName":"国债","ratio":"10.82%"},
    {"name":"19西咸02","industryName":"企业债","ratio":"5.76%"},
    {"name":"25国债01","industryName":"国债","ratio":"5.03%"},
    {"name":"兴业转债","industryName":"可转债","ratio":"4.85%"},
    {"name":"20国债04","industryName":"国债","ratio":"4.15%"}
  ],
  "fund":[]
}

jd_fund_archive,// 基金档案
{
  "establishedDateByCn":"2013年04月24日",
  "company_name":"华富基金管理有限公司",
  "fundScaleList":["0.37","0.31","0.32","0.33"],
  "instPurchaseRatio":"29.77",
  "purchaseRatio":"70.23",
  "companyManageScale":"978.06亿",
  "manageNumber":"72"
}

jd_managerInfo,// 基金经理
[
  {
    "yearPerformance":"3.40",
    "employPerformance":"13.99",
    "employmentDate":"2年357天",
    "accessionDateDesc":"2022.09.23-至今",
    "managerName":"戴弘毅",
    "accessionDate":"2年357天",
    "manageScale":"5.03亿元"
  }
]


*/


const getList = () => {
  if (info.text.trim() === '') {
    info.tableData = [];
    return;
  }
  server_fund_mysql_query_keywords({ text: info.text.trim() }).then(res => {
    console.log('关键词搜索', 'res', res);
    if (res.code === 200) {
      info.tableData = [...res.data.data];
      // // 不以ETF结尾的基金
      // info.tableData = [...res.data].filter(item => !item.name.endsWith('ETF'));
      // info.tableData.push({
      //   code: '008164',
      //   name: 'aaaaaa',
      // })
      // info.tableData.push({
      //   code: '008087',
      //   name: 'bbb',
      // })
      // // getFundGZ();// 查看是否可以读取到当日的涨幅
      // getFundGZ(info.tableData.map(item => item.code));
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
  info.tableData = info.tableData.filter(item => item.fund_name[item.fund_name.length - 1] !== 'A');
};

const addFn = () => {
  console.log('新增');
};
const btn_del = (row, $index) => {
  console.log('删除', row);
  info.tableData.splice($index, 1);
};

/*


*/


const getNormalFundAll = () => {
  server_fund_mysql_normal_all().then(res => {
    console.log('res', res);
    if (res.code === 200) {

    } else {
      ElMessage.error(res.msg || '获取列表失败');
    }
  }).catch(() => {
    info.tableData = [];
    ElMessage.error('获取列表失败');
  });
};
// getNormalFundAll();

//
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

    <div>
      <span class="">总数量：{{ info.tableData.length }}个</span>
    </div>

    <div class="main_box">
      <el-table :data="info.tableData" border style="width: 100%" height="500">
        <el-table-column fixed label="序" type="index" width="50" />
        <el-table-column prop="fund_code" label="基金号" width="80" />
        <el-table-column prop="fund_name" label="基金名称" width="240" show-overflow-tooltip />
        <el-table-column prop="fund_type_name" label="基金类型" width="110" show-overflow-tooltip />

        <el-table-column label="Operations" min-width="120">
          <template #default="{ row, $index }">
            <el-button link type="primary" size="small" @click="btn_del(row, $index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--
      基金经理的返回值
      {
        "yearPerformance":"6.06",
        "employPerformance":"105.86",
        "employmentDate":"14年217天",
        "accessionDateDesc":"2013.03.29-至今",
        "managerName":"何秀红",
        "accessionDate":"12年170天",
        "manageScale":"81.94亿元",
        "awardList":[
          {"awardTypeName":"金牛奖"},
          {"awardTypeName":"金基金奖"},
          {"awardTypeName":"明星基金奖"}
        ]
      },
      -->
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
