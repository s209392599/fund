<script setup>
console.log('src/views/preview/tabs/preview_13.vue');
// 基金持仓，要支持再次的手动输入

const info = reactive({
  text: '',
  tableData: [
    {
      "code": "018561",
      "name": "中信保诚多策略混合(LOF)C",
      "themeNameList": [
        "专用设备",
        "乡村振兴"
      ],
      "stock": [
        {
          "name": "荣信文化",
          "industryName": "文化传媒",
          "ratio": "0.96%"
        },
        {
          "name": "安利股份",
          "industryName": "塑料制品",
          "ratio": "0.87%"
        },
        {
          "name": "国际实业",
          "industryName": "光伏设备",
          "ratio": "0.87%"
        },
        {
          "name": "春雪食品",
          "industryName": "食品加工制造",
          "ratio": "0.86%"
        },
        {
          "name": "中公高科",
          "industryName": "建筑装饰",
          "ratio": "0.86%"
        },
        {
          "name": "优德精密",
          "industryName": "专用设备",
          "ratio": "0.85%"
        },
        {
          "name": "华绿生物",
          "industryName": "种植业与林业",
          "ratio": "0.85%"
        },
        {
          "name": "宁波联合",
          "industryName": "综合",
          "ratio": "0.84%"
        },
        {
          "name": "天鹅股份",
          "industryName": "专用设备",
          "ratio": "0.84%"
        },
        {
          "name": "美信科技",
          "industryName": "通信设备",
          "ratio": "0.83%"
        }
      ],
      "stockDistribution": [
        {
          "name": "制造业",
          "value": "32.03"
        }
      ]
    },
    {
      "code": "002112",
      "name": "德邦鑫星价值灵活配置混合C",
      "themeNameList": [
        "通信设备",
        "共封装光学(CPO)"
      ],
      "stock": [
        {
          "name": "胜宏科技",
          "industryName": "元件",
          "ratio": "9.36%"
        },
        {
          "name": "长芯博创",
          "industryName": "通信设备",
          "ratio": "9.30%"
        },
        {
          "name": "太辰光",
          "industryName": "通信设备",
          "ratio": "8.91%"
        },
        {
          "name": "沪电股份",
          "industryName": "元件",
          "ratio": "7.86%"
        },
        {
          "name": "生益电子",
          "industryName": "元件",
          "ratio": "6.28%"
        },
        {
          "name": "新易盛",
          "industryName": "通信设备",
          "ratio": "5.59%"
        },
        {
          "name": "德科立",
          "industryName": "通信设备",
          "ratio": "4.82%"
        },
        {
          "name": "源杰科技",
          "industryName": "半导体",
          "ratio": "4.78%"
        },
        {
          "name": "华工科技",
          "industryName": "自动化设备",
          "ratio": "4.45%"
        },
        {
          "name": "腾景科技",
          "industryName": "光学光电子",
          "ratio": "4.23%"
        }
      ],
      "stockDistribution": [
        {
          "name": "制造业",
          "value": "93.96"
        }
      ]
    },
    {
      "code": "018957",
      "name": "中航机遇领航混合发起C",
      "themeNameList": [
        "通信设备",
        "共封装光学(CPO)"
      ],
      "stock": [
        {
          "name": "中际旭创",
          "industryName": "通信设备",
          "ratio": "9.78%"
        },
        {
          "name": "新易盛",
          "industryName": "通信设备",
          "ratio": "9.74%"
        },
        {
          "name": "英维克",
          "industryName": "专用设备",
          "ratio": "9.73%"
        },
        {
          "name": "胜宏科技",
          "industryName": "元件",
          "ratio": "8.95%"
        },
        {
          "name": "长芯博创",
          "industryName": "通信设备",
          "ratio": "8.91%"
        },
        {
          "name": "天孚通信",
          "industryName": "通信设备",
          "ratio": "8.21%"
        },
        {
          "name": "德科立",
          "industryName": "通信设备",
          "ratio": "8.09%"
        },
        {
          "name": "仕佳光子",
          "industryName": "通信设备",
          "ratio": "8.07%"
        },
        {
          "name": "方正科技",
          "industryName": "元件",
          "ratio": "5.47%"
        },
        {
          "name": "沪电股份",
          "industryName": "元件",
          "ratio": "5.19%"
        }
      ],
      "stockDistribution": [
        {
          "name": "制造业",
          "value": "90.45"
        }
      ]
    },
    {
      "code": "016371",
      "name": "信澳业绩驱动混合C",
      "themeNameList": [
        "通信设备",
        "英伟达概念"
      ],
      "stock": [
        {
          "name": "新易盛",
          "industryName": "通信设备",
          "ratio": "9.87%"
        },
        {
          "name": "中际旭创",
          "industryName": "通信设备",
          "ratio": "9.81%"
        },
        {
          "name": "麦格米特",
          "industryName": "其他电源设备",
          "ratio": "9.23%"
        },
        {
          "name": "英维克",
          "industryName": "专用设备",
          "ratio": "8.69%"
        },
        {
          "name": "胜宏科技",
          "industryName": "元件",
          "ratio": "8.43%"
        },
        {
          "name": "沪电股份",
          "industryName": "元件",
          "ratio": "7.89%"
        },
        {
          "name": "天孚通信",
          "industryName": "通信设备",
          "ratio": "7.71%"
        },
        {
          "name": "生益电子",
          "industryName": "元件",
          "ratio": "7.47%"
        },
        {
          "name": "德科立",
          "industryName": "通信设备",
          "ratio": "7.45%"
        },
        {
          "name": "长芯博创",
          "industryName": "通信设备",
          "ratio": "7.06%"
        }
      ],
      "stockDistribution": [
        {
          "name": "制造业",
          "value": "94.38"
        }
      ]
    },
    {
      "code": "016858",
      "name": "国金量化多因子股票C",
      "themeNameList": [
        "元件",
        "长三角一体化"
      ],
      "stock": [
        {
          "name": "胜宏科技",
          "industryName": "元件",
          "ratio": "2.34%"
        },
        {
          "name": "天风证券",
          "industryName": "证券",
          "ratio": "1.56%"
        },
        {
          "name": "东山精密",
          "industryName": "元件",
          "ratio": "1.50%"
        },
        {
          "name": "同花顺",
          "industryName": "软件开发",
          "ratio": "1.50%"
        },
        {
          "name": "长芯博创",
          "industryName": "通信设备",
          "ratio": "1.44%"
        },
        {
          "name": "新华保险",
          "industryName": "保险",
          "ratio": "1.38%"
        },
        {
          "name": "格力电器",
          "industryName": "白色家电",
          "ratio": "1.36%"
        },
        {
          "name": "澜起科技",
          "industryName": "半导体",
          "ratio": "1.36%"
        },
        {
          "name": "阳光电源",
          "industryName": "光伏设备",
          "ratio": "1.36%"
        },
        {
          "name": "昆仑万维",
          "industryName": "游戏",
          "ratio": "1.35%"
        }
      ],
      "stockDistribution": [
        {
          "name": "制造业",
          "value": "49.40"
        }
      ]
    },
    {
      "code": "018729",
      "name": "华夏智胜新锐股票C",
      "themeNameList": [
        "塑料制品",
        "国企改革"
      ],
      "stock": [
        {
          "name": "道通科技",
          "industryName": "计算机设备",
          "ratio": "0.86%"
        },
        {
          "name": "深圳机场",
          "industryName": "机场航运",
          "ratio": "0.75%"
        },
        {
          "name": "华润材料",
          "industryName": "塑料制品",
          "ratio": "0.72%"
        },
        {
          "name": "中原高速",
          "industryName": "公路铁路运输",
          "ratio": "0.72%"
        },
        {
          "name": "匠心家居",
          "industryName": "家居用品",
          "ratio": "0.70%"
        },
        {
          "name": "阳普医疗",
          "industryName": "医疗器械",
          "ratio": "0.69%"
        },
        {
          "name": "光正眼科",
          "industryName": "医疗服务",
          "ratio": "0.64%"
        },
        {
          "name": "中国电信",
          "industryName": "通信服务",
          "ratio": "0.63%"
        },
        {
          "name": "美硕科技",
          "industryName": "电网设备",
          "ratio": "0.62%"
        },
        {
          "name": "金三江",
          "industryName": "美容护理",
          "ratio": "0.61%"
        }
      ],
      "stockDistribution": [
        {
          "name": "制造业",
          "value": "61.77"
        }
      ]
    },
    {
      "code": "002834",
      "name": "华夏新锦绣混合C",
      "themeNameList": [
        "消费电子",
        "国企改革"
      ],
      "stock": [
        {
          "name": "金山办公",
          "industryName": "软件开发",
          "ratio": "1.87%"
        },
        {
          "name": "工业富联",
          "industryName": "消费电子",
          "ratio": "1.83%"
        },
        {
          "name": "宝钢股份",
          "industryName": "钢铁",
          "ratio": "1.72%"
        },
        {
          "name": "中国电信",
          "industryName": "通信服务",
          "ratio": "1.72%"
        },
        {
          "name": "小商品城",
          "industryName": "零售",
          "ratio": "1.68%"
        },
        {
          "name": "宁德时代",
          "industryName": "电池",
          "ratio": "1.65%"
        },
        {
          "name": "紫金矿业",
          "industryName": "工业金属",
          "ratio": "1.64%"
        },
        {
          "name": "分众传媒",
          "industryName": "文化传媒",
          "ratio": "1.57%"
        },
        {
          "name": "贵州茅台",
          "industryName": "白酒",
          "ratio": "1.52%"
        },
        {
          "name": "比亚迪",
          "industryName": "汽车整车",
          "ratio": "1.51%"
        }
      ],
      "stockDistribution": [
        {
          "name": "制造业",
          "value": "58.38"
        }
      ]
    },
    {
      "code": "023350",
      "name": "诺安多策略混合C",
      "themeNameList": [
        "专用设备",
        "雄安新区"
      ],
      "stock": [
        {
          "name": "帝欧家居",
          "industryName": "家居用品",
          "ratio": "0.46%"
        },
        {
          "name": "华生科技",
          "industryName": "纺织制造",
          "ratio": "0.45%"
        },
        {
          "name": "瀚川智能",
          "industryName": "专用设备",
          "ratio": "0.45%"
        },
        {
          "name": "万里股份",
          "industryName": "电池",
          "ratio": "0.44%"
        },
        {
          "name": "泰林生物",
          "industryName": "专用设备",
          "ratio": "0.44%"
        },
        {
          "name": "华斯股份",
          "industryName": "服装家纺",
          "ratio": "0.44%"
        },
        {
          "name": "力源科技",
          "industryName": "环境治理",
          "ratio": "0.44%"
        },
        {
          "name": "飞鹿股份",
          "industryName": "化学制品",
          "ratio": "0.43%"
        },
        {
          "name": "中自科技",
          "industryName": "汽车零部件",
          "ratio": "0.43%"
        },
        {
          "name": "开创电气",
          "industryName": "通用设备",
          "ratio": "0.43%"
        }
      ],
      "stockDistribution": [
        {
          "name": "制造业",
          "value": "69.98"
        }
      ]
    },
    {
      "code": "020726",
      "name": "建信灵活配置混合C",
      "themeNameList": [
        "造纸",
        "长三角一体化"
      ],
      "stock": [
        {
          "name": "康拓医疗",
          "industryName": "医疗器械",
          "ratio": "1.18%"
        },
        {
          "name": "金三江",
          "industryName": "美容护理",
          "ratio": "1.16%"
        },
        {
          "name": "莱伯泰科",
          "industryName": "通用设备",
          "ratio": "1.16%"
        },
        {
          "name": "友车科技",
          "industryName": "软件开发",
          "ratio": "1.15%"
        },
        {
          "name": "浙江力诺",
          "industryName": "通用设备",
          "ratio": "1.15%"
        },
        {
          "name": "合富中国",
          "industryName": "医药商业",
          "ratio": "1.15%"
        },
        {
          "name": "瑞华泰",
          "industryName": "塑料制品",
          "ratio": "1.15%"
        },
        {
          "name": "恒丰纸业",
          "industryName": "造纸",
          "ratio": "1.15%"
        },
        {
          "name": "明志科技",
          "industryName": "通用设备",
          "ratio": "1.14%"
        },
        {
          "name": "双箭股份",
          "industryName": "橡胶制品",
          "ratio": "1.14%"
        }
      ],
      "stockDistribution": [
        {
          "name": "制造业",
          "value": "61.30"
        }
      ]
    },
    {
      "code": "023918",
      "name": "华夏国证自由现金流ETF联接C",
      "themeNameList": [
        "贸易",
        "参股保险"
      ],
      "stock": [
        {
          "name": "上汽集团",
          "industryName": "汽车整车",
          "ratio": "0.25%"
        },
        {
          "name": "中国海油",
          "industryName": "油气开采及服务",
          "ratio": "0.24%"
        },
        {
          "name": "美的集团",
          "industryName": "白色家电",
          "ratio": "0.23%"
        },
        {
          "name": "格力电器",
          "industryName": "白色家电",
          "ratio": "0.18%"
        },
        {
          "name": "洛阳钼业",
          "industryName": "工业金属",
          "ratio": "0.12%"
        },
        {
          "name": "中国铝业",
          "industryName": "工业金属",
          "ratio": "0.11%"
        },
        {
          "name": "正泰电器",
          "industryName": "电网设备",
          "ratio": "0.07%"
        },
        {
          "name": "厦门国贸",
          "industryName": "物流",
          "ratio": "0.07%"
        },
        {
          "name": "上海电气",
          "industryName": "其他电源设备",
          "ratio": "0.07%"
        },
        {
          "name": "中国动力",
          "industryName": "其他电源设备",
          "ratio": "0.06%"
        }
      ],
      "stockDistribution": [
        {
          "name": "制造业",
          "value": "1.59"
        }
      ]
    },
    {
      "code": "022691",
      "name": "华安医药生物股票发起式C",
      "themeNameList": [
        "化学制药",
        "创新药"
      ],
      "stock": [
        {
          "name": "信达生物",
          "ratio": "8.70%"
        },
        {
          "name": "石药集团",
          "ratio": "6.72%"
        },
        {
          "name": "康方生物",
          "ratio": "6.60%"
        },
        {
          "name": "三生制药",
          "ratio": "6.38%"
        },
        {
          "name": "泽璟制药",
          "industryName": "化学制药",
          "ratio": "5.69%"
        },
        {
          "name": "百济神州",
          "ratio": "5.25%"
        },
        {
          "name": "云顶新耀",
          "ratio": "4.76%"
        },
        {
          "name": "信立泰",
          "industryName": "化学制药",
          "ratio": "4.17%"
        },
        {
          "name": "荣昌生物",
          "industryName": "生物制品",
          "ratio": "3.62%"
        },
        {
          "name": "荣昌生物",
          "ratio": "3.29%"
        }
      ],
      "stockDistribution": [
        {
          "name": "制造业",
          "value": "47.76"
        }
      ]
    },
    {
      "code": "017437",
      "name": "华宝纳斯达克精选股票发起式",
      "themeNameList": [
        "美国"
      ],
      "stock": [
        {
          "name": "英伟达",
          "ratio": "9.82%"
        },
        {
          "name": "微软",
          "ratio": "8.91%"
        },
        {
          "name": "博通",
          "ratio": "8.37%"
        },
        {
          "name": "特斯拉",
          "ratio": "7.68%"
        },
        {
          "name": "苹果",
          "ratio": "7.44%"
        },
        {
          "name": "奈飞",
          "ratio": "7.33%"
        },
        {
          "name": "Meta Platforms Inc Class A",
          "ratio": "6.19%"
        },
        {
          "name": "亚马逊",
          "ratio": "5.87%"
        },
        {
          "name": "谷歌-C",
          "ratio": "5.50%"
        },
        {
          "name": "迈威尔科技",
          "ratio": "5.41%"
        }
      ],
      "stockDistribution": []
    },
    {
      "code": "012863",
      "name": "汇添富中证电池主题ETF发起式联接C",
      "themeNameList": [
        "电池",
        "钠离子电池"
      ],
      "stock": [],
      "stockDistribution": []
    },
    {
      "code": "012322",
      "name": "东财云计算增强C",
      "themeNameList": [
        "IT服务",
        "东数西算(算力)"
      ],
      "stock": [
        {
          "name": "科大讯飞",
          "industryName": "软件开发",
          "ratio": "8.46%"
        },
        {
          "name": "新易盛",
          "industryName": "通信设备",
          "ratio": "6.61%"
        },
        {
          "name": "中际旭创",
          "industryName": "通信设备",
          "ratio": "6.32%"
        },
        {
          "name": "金山办公",
          "industryName": "软件开发",
          "ratio": "5.09%"
        },
        {
          "name": "中科曙光",
          "industryName": "计算机设备",
          "ratio": "4.85%"
        },
        {
          "name": "紫光股份",
          "industryName": "IT服务",
          "ratio": "4.56%"
        },
        {
          "name": "浪潮信息",
          "industryName": "计算机设备",
          "ratio": "4.50%"
        },
        {
          "name": "恒生电子",
          "industryName": "软件开发",
          "ratio": "3.55%"
        },
        {
          "name": "润和软件",
          "industryName": "IT服务",
          "ratio": "3.29%"
        },
        {
          "name": "润泽科技",
          "industryName": "通信服务",
          "ratio": "2.97%"
        }
      ],
      "stockDistribution": [
        {
          "name": "信息传输、软件和信息技术服务业",
          "value": "63.43"
        }
      ]
    },
    {
      "code": "023521",
      "name": "博时上证科创板人工智能ETF联接C",
      "themeNameList": [
        "半导体",
        "英伟达概念"
      ],
      "stock": [],
      "stockDistribution": []
    },
    {
      "code": "020973",
      "name": "易方达机器人ETF联接C",
      "themeNameList": [
        "电机",
        "机器视觉"
      ],
      "stock": [
        {
          "name": "中大力德",
          "industryName": "通用设备",
          "ratio": "0.00%"
        }
      ],
      "stockDistribution": [
        {
          "name": "制造业",
          "value": "0.00"
        }
      ]
    },
    {
      "code": "007467",
      "name": "华泰柏瑞中证红利低波ETF联接C",
      "themeNameList": [],
      "stock": [],
      "stockDistribution": []
    },
    {
      "code": "019260",
      "name": "富国恒生红利ETF联接A",
      "themeNameList": [],
      "stock": [],
      "stockDistribution": []
    },
    {
      "code": "019103",
      "name": "景顺长城恒生消费ETF联接",
      "themeNameList": [
        "全球"
      ],
      "stock": [],
      "stockDistribution": []
    }
  ], // 列表数据
  // 拖拽相关数据
  dragState: {
    draggingIndex: -1,
    targetIndex: -1
  }
});

// 拖拽开始
const handleDragStart = (e, index) => {
  info.dragState.draggingIndex = index;
  // 设置拖拽效果
  e.dataTransfer.effectAllowed = 'move';
  // 对于某些浏览器需要设置数据
  e.dataTransfer.setData('text/plain', index.toString());
  // 添加拖拽样式
  e.target.classList.add('dragging');
};

// 拖拽经过
const handleDragOver = (e, index) => {
  info.dragState.targetIndex = index;
  // 必须阻止默认行为才能触发drop
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

// 拖拽结束（放置）
const handleDrop = (e, index) => {
  e.preventDefault();

  const draggingIndex = info.dragState.draggingIndex;
  const targetIndex = index;

  // 如果目标位置不同于起始位置，则重新排序
  if (draggingIndex !== targetIndex && draggingIndex !== -1) {
    // 创建新数组以避免直接修改响应式数组
    const newTableData = [...info.tableData];
    // 移除拖拽项
    const [removed] = newTableData.splice(draggingIndex, 1);
    // 插入到新位置
    newTableData.splice(targetIndex, 0, removed);
    // 更新数据
    info.tableData = newTableData;
  }

  // 清理拖拽状态
  e.target.classList.remove('dragging');
  info.dragState.draggingIndex = -1;
  info.dragState.targetIndex = -1;
};


const getList = () => {

};

const addFn = () => {
  console.log('新增');
};

</script>

<template>
  <div class="page_wrapper pd-10">
    <div class="search_box">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
          <el-button type="success" @click="addFn">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main_box">
      <div v-for="(item, index) in info.tableData" :key="item.code + index" class="drag_item" draggable="true"
        @dragstart="handleDragStart($event, index)" @dragover.prevent="handleDragOver($event, index)"
        @drop="handleDrop($event, index)">
        <div class="drag_title">
          <!-- <span class="drag_icon">☰</span> -->
          <span class="drag_text">{{ item.code }}&nbsp;{{ item.name }}</span>
        </div>
        <div class="drag_main">
          <div class="" style="border-bottom: 1px solid #fedddd;">
            <span class="">投资方向：</span>
            <span class="" v-for="(item_1, index_1) in item.themeNameList" :key="index_1">{{ item_1 }}、</span>
          </div>

          <div class="" style="border-bottom: 1px solid #fedddd;">
            <span class="">持仓首位：</span>
            <span class="">{{ item.stockDistribution?.[0]?.name }}&nbsp;{{ item.stockDistribution?.[0]?.value }}%</span>
          </div>

          <div class="gupiao_box">
            <div class="gupiao_item">
              <span class="gupiao_name">股票</span>
              <span class="gupiao_rate">占比</span>
              <span class="gupiao_type">类别</span>
            </div>
            <div class="gupiao_item" v-for="(item_2, index_2) in item.stock" :key="index_2">
              <span class="gupiao_name" :title="item_2.name">{{ item_2.name }}</span>
              <span class="gupiao_rate">{{ item_2.ratio }}</span>
              <span class="gupiao_type">{{ item_2.industryName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss"></style>
<style scoped lang="scss">
.gupiao_item {
  display: flex;
  border-bottom: 1px solid #fedddd;

  .gupiao_name {
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .gupiao_rate {
    width: 60px;
    text-align: center;
  }

  .gupiao_type {
    width: 110px;
    text-align: right;
  }

  &:last-child {
    border-bottom: none;
  }
}

.main_box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  padding: 15px;
}

.drag_item {
  width: 320px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.drag_item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.drag_item.dragging {
  opacity: 0.6;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.drag_title {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;

  padding: 5px 5px;
  background-color: #f5f7fa;
  cursor: move;
  user-select: none;
  font-weight: 500;
}

.drag_icon {
  margin-right: 10px;
  color: #909399;
  font-size: 18px;
  cursor: move;
}

.drag_text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  /* 关键：允许内容收缩，避免 flex 溢出问题 */
}

.drag_main {
  padding: 5px 8px;
  background-color: #fff;
  color: #606266;
  font-size: 14px;
  height: 280px;
}

/* 拖拽过程中的视觉反馈 */
.drag_item.drag-over {
  border-top: 2px solid #409eff;
}
</style>