(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0a3e1909"],{1987:function(e,t,a){"use strict";a("e00f")},6451:function(e,t,a){"use strict";a.r(t);var i=a("7a23");const n={class:"about"},r=Object(i["createElementVNode"])("div",{style:{height:"15px"}},null,-1);function l(e,t,a,l,o,d){const u=Object(i["resolveComponent"])("el-table-column"),c=Object(i["resolveComponent"])("el-table");return Object(i["openBlock"])(),Object(i["createElementBlock"])("div",n,[r,Object(i["createVNode"])(c,{data:o.tableData,stripe:"",style:{width:"100%"},"max-height":"765",id:"viewsAbout"},{default:Object(i["withCtx"])(()=>[Object(i["createVNode"])(u,{fixed:"",type:"index",width:"28px"}),Object(i["createVNode"])(u,{fixed:"",prop:"number",label:"代号",width:"64px"}),Object(i["createVNode"])(u,{prop:"name",label:"名称",width:"126px"}),Object(i["createVNode"])(u,{prop:"update_zhangfu",label:"万元收入",width:"66px",align:"right"},{default:Object(i["withCtx"])(({row:e})=>[Object(i["createElementVNode"])("span",{class:Object(i["normalizeClass"])(["cell_zhangfu",d.getColor(e.update_zhangfu)])},Object(i["toDisplayString"])(e.update_zhangfu),3)]),_:1}),Object(i["createVNode"])(u,{prop:"update_time",label:"时间",width:"60px"},{default:Object(i["withCtx"])(({row:e})=>[Object(i["createElementVNode"])("span",{class:Object(i["normalizeClass"])(d.getColor_time(e.update_time))},Object(i["toDisplayString"])(d.turn_time(e.update_time)),3)]),_:1}),Object(i["createVNode"])(u,{prop:"update_danweijingzhi",label:"单位净值",width:"70px",align:"right"}),Object(i["createVNode"])(u,{prop:"update_leijijingzhijingzhi",label:"累计净值",width:"70px",align:"right"})]),_:1},8,["data"])])}var o=a("bc3a"),d=a.n(o),u={name:"Edit",data(){return{fundURL:globalProperties.fundURL,tableData:[]}},created(){let e=localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")):globalProperties.defaultArr;this.tableData=e.map((e,t)=>(this.getShouyi({number:e.number,index:t}),{number:e.number,name:e.name,remarks:e.remarks,notice:e.notice,update_time:"",update_zhangfu:"",update_danweijingzhi:"",update_leijijingzhijingzhi:""}))},methods:{getShouyi(e){setTimeout(()=>{d.a.get(`${this.fundURL}/obtainNetWorth/?code=${e.number}&size=1`).then(t=>{console.log("fund09.vue 40 [res]",t);let a=t.data||[];var i=a[0]||{};this.tableData[e.index]["update_time"]=i.date||"",this.tableData[e.index]["update_zhangfu"]=Math.round(100*Number(i.dailyProfit||0)),this.tableData[e.index]["update_danweijingzhi"]=i.netValue||"",this.tableData[e.index]["update_leijijingzhijingzhi"]=i.totalNetValue||""}).catch(e=>{console.log("err",e)})},10*e.index)},getColor(e){return e?Number(e)<0?"down":"up":""},turn_time(e){if(!e)return"";let t=new Date(e),a=t.getMonth()+1;a=a>9?a:"0"+a;let i=t.getDate();return i=i>9?i:"0"+i,`${a}-${i}`},getColor_time(e){if(!e)return"";let t=new Date,a=new Date(e),i=t.getFullYear(),n=t.getMonth()+1,r=t.getDate(),l=a.getFullYear(),o=a.getMonth()+1,d=a.getDate();return i===l&&n===o&&r===d?"":"down"}}},c=(a("1987"),a("6b0d")),p=a.n(c);const b=p()(u,[["render",l]]);t["default"]=b},e00f:function(e,t,a){}}]);