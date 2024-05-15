<template>
  <div class="hello" style="padding:10px 0 0 0;">
    <el-table :data="arr" stripe style="width: 100%" max-height="810" id="componentsFund02">
      <el-table-column type="index" fixed width="40"></el-table-column>
      <el-table-column prop="number" label="代号" min-width="68px"></el-table-column>
      <el-table-column prop="name" fixed label="基金名称" min-width="172px"></el-table-column>
      <el-table-column prop="thirtyDays" align="right" label="30天盈利概率" min-width="69px"></el-table-column>
      <el-table-column prop="surpassTheSameKind" align="right" label="超越同类" min-width="53px"></el-table-column>
      <el-table-column align="center" label="建议" min-width="70px">
        <template v-slot="{ row }">
          <span :style="{ color: getAdviceColor(row.advice) }">{{ row.advice }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="retracement" align="right" label="回撤" min-width="72px"></el-table-column>
      <el-table-column label="近一年连涨能力">
        <el-table-column prop="benRate" align="right" label="连续最大涨幅" width="72px"></el-table-column>
        <el-table-column prop="socre" align="right" label="评分" width="46px"></el-table-column>
        <el-table-column prop="sameRate" align="right" label="同类平均" width="72px"></el-table-column>
        <el-table-column prop="hs300Rate" align="right" label="沪深300" width="72px"></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Fund1',
  data() {
    return {
      fundURL: globalProperties.fundURL,
      arr: [],
      info: []
    }
  },
  created() {
    let ifnoArr = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")) : globalProperties.defaultArr;
    this.arr = ifnoArr.map((item, index) => {
      this.getRetracement({//近一年最大回撤
        number: item.number,
        index: index,
      })
      this.profit({//30天盈利概率
        number: item.number,
        index: index,
      });
      this.getAdvice({//诊断建议
        number: item.number,
        index: index,
      });
      this.getInfo({//连涨能力
        number: item.number,
        index: index,
      });
      this.obtainNetWorth({//累计净值
        number: item.number,
        index: index,
      })
      return {
        number: item.number,
        name: item.name,
        thirtyDays: '',//30天盈利概率
        surpassTheSameKind: '',//超越同类
        retracement: '',//近一年最大回撤
        benRate: '',//本基金近一年最大连续涨幅
        socre: '',//连涨能力评分
        sameRate: '',//同类平均连涨能力
        hs300Rate: '',//沪深300连涨能力
        advice: '',//诊断建议(积极持有，持续观望)
        future01: '', future02: '', future03: '', future04: '',
        future11: '', future12: '', future13: '', future14: '',
        future21: '', future22: '', future23: '', future24: '',
      };
    })
  },
  methods: {
    getRetracement(params) {//近一年最大回撤
      axios.get(`${this.fundURL}/retracement/?code=${params.number}`)
        .then(res => {
          let str = '';
          if (res.data.benRate) str = res.data.benRate + '%';
          console.log(96, res.data, str);
          this.arr[params.index]["retracement"] = str;
        })
        .catch(err => {
          console.log("err", err);
        })
    },
    getAdvice(params) {//诊断建议，积极持有
      axios.get(`${this.fundURL}/advice/?code=${params.number}`)
        .then(res => {
          this.arr[params.index]["advice"] = res.data.advice || '';
        })
        .catch(err => {
          console.log("err", err);
        })
    },
    getAdviceColor(str) {
      if (!str) return '';
      if (str.includes("积极持有")) {
        return '#ff801a'
      } else if (str.includes("谨慎持有")) {
        return '#44bf97'
      } else if (str.includes("持续观望")) {
        return 'yellowgreen'
      }
    },
    profit(params) {
      axios.get(`${this.fundURL}/profit/?code=${params.number}`, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .then(res => {
          var arr = res.data.msg.match(/\d+(.\d+)?/g);//["78", "30", "69.84", "30.16"]
          if (arr[2]) this.arr[params.index]["thirtyDays"] = arr[2] + '%';//30天盈利概率
          if (arr[0]) this.arr[params.index]["surpassTheSameKind"] = arr[0] + '%';//超越同类
        })
        .catch(err => {
          console.log("err", err);
        })
    },
    getInfo(params) {
      axios.get(`${this.fundURL}/queryUpndayability/?code=${params.number}`)
        .then(res => {
          if (res.data.benRate) this.arr[params.index]["benRate"] = res.data.benRate + '%';
          if (res.data.socre) this.arr[params.index]["socre"] = res.data.socre;
          if (res.data.sameRate) this.arr[params.index]["sameRate"] = res.data.sameRate + '%';
          if (res.data.hs300) this.arr[params.index]["hs300Rate"] = res.data.hs300 + '%';
        })
        .catch(err => {
          console.log("err", err);
        })
    },
    obtainNetWorth(params) {//未来潜力
      axios.get(`${this.fundURL}/obtainNetWorth/?code=${params.number}&size=780`)
        .then(res => {
          console.log(119, res.data);
          // if (res.data.oneMonthProbability.incomeUpProbability) this.arr[params.index]["future01"] = res.data.oneMonthProbability.incomeUpProbability + '%';
          // if (res.data.oneMonthProbability.zeroTofiveUpRange) this.arr[params.index]["future02"] = res.data.oneMonthProbability.zeroTofiveUpRange + '%';
          // if (res.data.oneMonthProbability.fiveToTenUpRange) this.arr[params.index]["future03"] = res.data.oneMonthProbability.fiveToTenUpRange + '%';
          // if (res.data.oneMonthProbability.tenToOverUpRange) this.arr[params.index]["future04"] = res.data.oneMonthProbability.tenToOverUpRange + '%';

          // if (res.data.threeMonthProbability.incomeUpProbability) this.arr[params.index]["future11"] = res.data.threeMonthProbability.incomeUpProbability + '%';
          // if (res.data.threeMonthProbability.zeroTofiveUpRange) this.arr[params.index]["future12"] = res.data.threeMonthProbability.zeroTofiveUpRange + '%';
          // if (res.data.threeMonthProbability.fiveToTenUpRange) this.arr[params.index]["future13"] = res.data.threeMonthProbability.fiveToTenUpRange + '%';
          // if (res.data.threeMonthProbability.tenToOverUpRange) this.arr[params.index]["future14"] = res.data.threeMonthProbability.tenToOverUpRange + '%';

          // if (res.data.sixMonthProbability.incomeUpProbability) this.arr[params.index]["future21"] = res.data.sixMonthProbability.incomeUpProbability + '%';
          // if (res.data.sixMonthProbability.zeroTofiveUpRange) this.arr[params.index]["future22"] = res.data.sixMonthProbability.zeroTofiveUpRange + '%';
          // if (res.data.sixMonthProbability.fiveToTenUpRange) this.arr[params.index]["future23"] = res.data.sixMonthProbability.fiveToTenUpRange + '%';
          // if (res.data.sixMonthProbability.tenToOverUpRange) this.arr[params.index]["future24"] = res.data.sixMonthProbability.tenToOverUpRange + '%';
        })
        .catch(err => {
          console.log("err", err);
        })
    },
  }
};
</script>

<style scoped>
.fundImg {
  width: 352px;
  /* 440px */
  height: 277px;
}
</style>

<style>
#componentsFund02 td,
#componentsFund02 th {
  padding: 2px 0 !important;
}

.el-table .cell {
  padding: 0 2px !important;
}
</style>
