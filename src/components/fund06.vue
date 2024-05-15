<template>
  <div class="hello">
    <div class="item-wrapper" v-for="(item,index) in numberArr" :key="index">
      <!-- 图片展示 -->
      <div class="img-box">
        <a target="_blank" class="item-img-" :href="'http://fund.eastmoney.com/'+(numberArr[index])+'.html?spm=aladin'">
          <img class="fundImg" :src="todaysTrend[index]" /><!-- 今日走势图 -->
        </a>

        <a target="_blank" class="item-img" :href="'http://fund.eastmoney.com/'+(numberArr[index])+'.html?spm=aladin'">
          <img class="fundImg" :src="historicalIncome[index]" /><!-- 历史走势图 -->
        </a>
      </div>

      <!-- 收益展示 -->
      <div class="list">
        <div class="list-header">
          <div class="list-name" title="{{numberArr[index]}}">
            周(<span :class="Number(weeklyIncrease[index]) >= 0 ? 'up-org' : 'down-grn'">{{weeklyIncrease[index]}}%</span>)
            双周(<span :class="Number(biweeklyIncrease[index]) >= 0 ? 'up-org' : 'down-grn'">{{biweeklyIncrease[index]}}%</span>)
          </div>
          <div class="list-percentage">日涨幅</div>
        </div>

        <div class="list-content">
          <div class="item" v-for="(v,i) in info[index]" :key="i">
            <div class="date">{{v.date}}</div>
            <div class="nav">{{v.nav}}</div>
            <div class="percentage" :class="Number(v.percentage) >= 0 ? 'up-org' : 'down-grn'">{{v.percentage}}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Fund1',
  data(){
    return {
      fundURL:globalProperties.fundURL,
      numberArr:[],//基金号码的数组
      nameArr:[], //基金名称的数组
      historicalIncome:[],//历史收益的数组
      todaysTrend:[],//今日走势图
      weeklyIncrease:[],//周涨幅
      biweeklyIncrease:[],//双周涨幅
      info:[]
    }
  },
  created(){
    let arr = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")) : globalProperties.defaultArr;
    arr.forEach((item,index) => {
      let thisTime = +new Date();

      this.numberArr.push(item.number);
      this.nameArr.push(item.name);

      this.historicalIncome.push(`https://j3.dfcfw.com/images/JJJZ12/${item.number}.png?t=${thisTime}`);//历史收益图片
      this.todaysTrend.push(`http://j4.dfcfw.com/charts/pic6/${item.number}.png?v=${thisTime}`);//今日走势图
      
      this.getInfo({
        code:item.number,
        index:index
      })
    })
  },
  methods:{
    getInfo(params){
      axios.get(`${this.fundURL}/historicalIncome/?code=${params.code}&pagesize=120`,{
        headers:{
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
      .then(res => {
        let arr = res.data.items;
        this.info[params.index] = arr;

        let num0 = Number(arr[0]["nav"]);
        let num5 = Number(arr[5]["nav"]);
        this.weeklyIncrease[params.index] = ((num0-num5)/num5*100).toFixed(2);//周涨幅

        let num10 = Number(arr[10]["nav"]);
        this.biweeklyIncrease[params.index] = ((num0-num10)/num10*100).toFixed(2);//双周涨幅
      })
      .catch(err => {
          console.log("err",err);
      })
    },
  },
};
</script>

<style scoped>
.item-wrapper{
  display: inline-block;
  width: 585px;
  overflow: hidden;
}
.img-box{
  float: left;
  width: 315px;
}
.item-img,
.fundImg{
  width: 315px;
  height: 138.5px;
}
.list{
  position: relative;
  float: left;
  width: 270px;
  height: 277px;
  border:1px solid #e8e8e8;
  font-size:14px;
  color:#333;
}
.list-header{
  height: 30px;
  line-height: 30px;
  border-bottom:1px solid #e8e8e8;
}
.list-content{
  height:242px;
  overflow: auto;
}
.item{
  display: flex;
  height: 30px;
  line-height: 30px;
  padding:0 2px;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
}
.date{
  width: 34%;
  text-align:left;
}
.percentage{
  width: 33%;
  text-align: right;
}
.up-org {
  color: #ff6600;
}
.down-grn {
  color: #0FA578;
}
.list-name{
  float: left;
  width: calc(100% - 66px);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding:0 0 0 10px;
}
.list-percentage{
  float: left;
  width: 66px;
  padding:0 20px 0 0;
}
</style>
