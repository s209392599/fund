<template>
  <div class="hello">
    <div class="list" v-for="(item,index) in numberArr" :key="index">
      <div class="list-title"><span>{{numberArr[index]}}  {{nameArr[index]}}</span>  <span title="近120天正收益天数比率">{{profit[index]}}</span></div>
      
      <div class="list-header">
        <div class="list-name" :title="numberArr[index] + '  ' +nameArr[index]">
          周(<span :class="Number(weeklyIncrease[index]) >= 0 ? 'up-org' : 'down-grn'">{{weeklyIncrease[index]}}%</span>)
          双周(<span :class="Number(biweeklyIncrease[index]) >= 0 ? 'up-org' : 'down-grn'">{{biweeklyIncrease[index]}}%</span>)
          三周(<span :class="Number(threeWeeks[index]) >= 0 ? 'up-org' : 'down-grn'">{{threeWeeks[index]}}%</span>)
        </div>
        <a target="_blank" class="list-percentage"
          :href="'http://fund.eastmoney.com/'+numberArr[index]+'.html?spm=aladin'"
        >日涨幅</a>
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
      weeklyIncrease:[],//周涨幅
      biweeklyIncrease:[],//双周涨幅
      threeWeeks:[],//三周涨幅
      info:[],
      profit:[],// 收益数组
    }
  },
  created(){
    let arr = localStorage.getItem("info") ? JSON.parse(localStorage.getItem("info")) : globalProperties.defaultArr;

    arr.forEach((item,index) => {
      this.profit.push('0');
      this.numberArr.push(item.number);
      this.nameArr.push(item.name);
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

        let num15 = Number(arr[15]["nav"]);
        this.threeWeeks[params.index] = ((num0-num15)/num15*100).toFixed(2);//三周涨幅
        
        let earnNum = 0;
        arr.forEach((item, index) =>{
          if((item.percentage || 0) >= 0){// 正收益比率
            earnNum++;
          }
        })
        this.profit[params.index] = (earnNum*100/arr.length).toFixed(2)+'%';// 正收益比率
      })
      .catch(err => {
        console.log("err",err);
      })
    },
  },
};
</script>

<style scoped>
.list{
  position: relative;
  float: left;
  width: 352px;/* 440px */
  height: 277px;
  border:1px solid #e8e8e8;
  font-size:14px;
  color:#333;
}
.list-title{
  display: flex;
  justify-content: space-between;
  height: 16px;
  line-height: 16px;
  font-size: 14px;
  padding: 0 10px 0 10px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  border-bottom: 1px solid #e8e8e8;
  color: red;
}
.list-header{
  height: 30px;
  line-height: 30px;
  border-bottom:1px solid #e8e8e8;
}
.list-content{
  height:226px;
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
