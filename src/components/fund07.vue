<template>
  <div class="hello">
    <a v-for="(item,index) in list" :key="index"
      class="nav_item" 
      :href="item.adress"
      target="_blank"
    >
      {{item.name}}
    </a>
  
    <!--
    <a class="nav_item" href=""></a>
     -->
  
  </div>
</template>

<script>
// import axios from 'axios';
export default {
  name: 'Fund07',
  data(){
    return {
      list:[
        {
          name:'阿里云函数计算控制台',
          adress:'https://fc.console.aliyun.com/fc/service/cn-shanghai/fund/functions'
        },
        {
          name:'天天基金可转债排行',
          adress:'http://fund.eastmoney.com/data/fundranking.html#tzq;c0;r;s6yzf;pn50;ddesc;qsd20201027;qed20211027;qdii;zq045;gg;gzbd;gzfs;bbzt;sfbb',
        },
        {
          name:'天天基金-基金对比',
          adress:'http://fund.eastmoney.com/Compare/'
        },
        {
          name:'大盘云图',
          adress:'http://summary.jrj.com.cn/dpyt/',
        },
        {
          name:'韭圈儿-基金对比',
          adress:'https://www.funddb.cn/fund/fund_pk',
        },
        {
          name:'新发基金',
          adress:'http://fund.eastmoney.com/data/xinfund.html',
        },

        
        /* 
        {
          name:'',
          adress:'',
        }, 
        */
      ]
    }
  },
  created(){
    
  },
  methods:{
    
  },
};
</script>

<style scoped>
.hello{
  padding:20px 4px 10px 4px;
}
.nav_item{
  display:inline-block;
  margin: 5px;
  padding:0 6px;
  border:1px solid #e8e8e8;
  font-size:14px;
  height:34px;
  line-height: 34px;
  border-radius: 8px;
}
.nav_item:hover{
  background-color: #f00;
  color:#fff;
}
</style>
