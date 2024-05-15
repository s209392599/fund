<template>
  <div class="hello">
    <a
      v-for="(item, index) in info"
      :key="index"
      target="_blank"
      :href="
        'http://fund.eastmoney.com/' + numberArr[index] + '.html?spm=aladin'
      "
      class="item"
    >
      <img class="fundImg" :src="item" />

      <div class="price_Reminder">
        <!-- 基金是否买卖 -1,不显示 1,低于设定最小值 2,正常区 3,高于设定最高值  -->
        <div class="price_state1" v-show="businessArr[index] === 1"
          >低于设定的值</div
        >
        <div class="price_state2" v-show="businessArr[index] === 2"
          >正常区间</div
        >
        <div class="price_state3" v-show="businessArr[index] === 3"
          >高于设定值</div
        >

        <div class="price_highPoint" v-show="!!highPoint[index]">
          高点：{{ highPoint[index] }}
        </div>
        <div class="price_lowPoint" v-show="!!lowPointArr[index]">
          低点：{{ lowPointArr[index] }}
        </div>
      </div>
    </a>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Fund1',
  data() {
    return {
      fundURL: globalProperties.fundURL,
      fundInfoArr: [], // 本地存储的基金信息
      numberArr: [], //基金号码的数组
      info: [],
      weeklyIncrease: [], //周涨幅
      biweeklyIncrease: [], //双周涨幅
      lowPointArr: [], // 基金提醒的最低价数组
      highPoint: [], // 基金提醒的最高价数组
      businessArr: [], // 基金是否买卖 -1,不显示 1,低于设定最小值 2,正常区 3,高于设定最高值
    };
  },
  created() {
    let arr = localStorage.getItem('selftFundInfo')
      ? JSON.parse(localStorage.getItem('selftFundInfo'))
      : []; // 自选基金数据
    this.fundInfoArr = arr;

    this.info = arr.map((item, index) => {
      this.numberArr.push(item.number);
      this.businessArr.push(-1);

      let curNotice = item.notice.split(','),
        curNoticeLen = curNotice.length;
      if (curNoticeLen == 2) {
        this.lowPointArr.push(curNotice[0]);
        this.highPoint.push(curNotice[1]);

        this.getInfo({
          // 获取基金当前价格信息
          code: item.number,
          index: index,
        });
      } else {
        this.lowPointArr.push(null);
        this.highPoint.push(null);
      }

      let thisTime = +new Date();
      return `http://j4.dfcfw.com/charts/pic6/${item.number}.png?v=${thisTime}`;
    });
  },
  methods: {
    // 处理当前价格查询的信息
    realTimeInformation(str) {
      if (str.startsWith('jsonpgz(')) {
        str = str.slice(8);
      }
      if (str.endsWith(');')) {
        str = str.substring(0, str.length - 2);
      }
      return str;
    },
    getInfo(params) {
      //获取单双周涨幅
      let _this = this;

      axios
        .get(`${this.fundURL}/incomeTrendChart/?code=${params.code}`, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        })
        .then((res) => {
          let currentPrice = Number(res.data.gsz) || 0;
          console.log('107', currentPrice, params.index);
          if (currentPrice != 0) {
            // businessArr: [], // 基金是否买卖 -1,不显示 1,低于设定最小值 2,正常区 3,高于设定最高值
            if (currentPrice > _this.highPoint[params.index]) {
              _this.businessArr[params.index] = 3;
            } else if (currentPrice > _this.lowPointArr[params.index]) {
              _this.businessArr[params.index] = 2;
            } else {
              _this.businessArr[params.index] = 1;
            }
            console.log('111', _this.businessArr[params.index]);
          }
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
  },
};
</script>

<style scoped>
.fundImg {
  width: 352px; /* 440px */
  height: 277px;
}
.item {
  display: inline-block;
  position: relative;
  z-index: 2;
}
.increase {
  position: absolute;
  right: 0;
  z-index: 5;
  color: #333;
}
.price_Reminder {
  position: absolute;
  left: 48px;
  bottom: 42px;
  width: auto;
  font-size: 14px;
  z-index: 5;
}
.price_state1 {
  color: green;
  font-size: 30px;
}
.price_state2 {
  color: #717171;
  font-size: 14px;
}
.price_state3 {
  color: #f00;
  font-size: 30px;
}
.price_highPoint {
  color: #717171;
}
.price_lowPoint {
  color: #717171;
}
</style>
