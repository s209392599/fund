(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-34f29636"],{"4bf9":function(e,t,a){"use strict";a("4e10")},"4e10":function(e,t,a){},"6adc":function(e,t,a){"use strict";a("eae6")},eae6:function(e,t,a){},ee60:function(e,t,a){"use strict";a.r(t);var r=a("7a23");const i={class:"hello",style:{padding:"10px 0 0 0"}};function l(e,t,a,l,n,o){const c=Object(r["resolveComponent"])("el-table-column"),s=Object(r["resolveComponent"])("el-table");return Object(r["openBlock"])(),Object(r["createElementBlock"])("div",i,[Object(r["createVNode"])(s,{data:n.tableArr,stripe:"",style:{width:"100%"},"max-height":"810",id:"componentsFund02"},{default:Object(r["withCtx"])(()=>[Object(r["createVNode"])(c,{fixed:"",type:"index",width:"30"}),Object(r["createVNode"])(c,{prop:"number",label:"代号","min-width":"57px"}),Object(r["createVNode"])(c,{fixed:"",prop:"name",label:"基金名称","min-width":"140px"}),Object(r["createVNode"])(c,{align:"center",label:"购买","min-width":"40px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{style:Object(r["normalizeStyle"])({color:o.getSetColor(e.status)})},Object(r["toDisplayString"])(o.getSetStatus(e.status)),5)]),_:1}),Object(r["createVNode"])(c,{align:"center",label:"建议","min-width":"70px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{style:Object(r["normalizeStyle"])({color:o.getAdviceColor(e.advice)})},Object(r["toDisplayString"])(e.advice),5)]),_:1}),Object(r["createVNode"])(c,{label:"历史平均收益率"},{default:Object(r["withCtx"])(()=>[Object(r["createVNode"])(c,{prop:"nav_grlty",align:"right",label:"6个月","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.avgRate_1))},Object(r["toDisplayString"])(o.filterPercent(e.avgRate_1)),3)]),_:1}),Object(r["createVNode"])(c,{prop:"nav_grlty",align:"right",label:"1年","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.avgRate_2))},Object(r["toDisplayString"])(o.filterPercent(e.avgRate_2)),3)]),_:1}),Object(r["createVNode"])(c,{prop:"nav_grlty",align:"right",label:"2年","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.avgRate_3))},Object(r["toDisplayString"])(o.filterPercent(e.avgRate_3)),3)]),_:1})]),_:1}),Object(r["createVNode"])(c,{label:"历史盈利概率(持有两年)"},{default:Object(r["withCtx"])(()=>[Object(r["createVNode"])(c,{prop:"nav_grlty",align:"right",label:"10%以上","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.profitProbability_1))},Object(r["toDisplayString"])(o.filterPercent(e.profitProbability_1)),3)]),_:1}),Object(r["createVNode"])(c,{prop:"nav_grlty",align:"right",label:"5%~10%","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.profitProbability_2))},Object(r["toDisplayString"])(o.filterPercent(e.profitProbability_2)),3)]),_:1}),Object(r["createVNode"])(c,{prop:"nav_grlty",align:"right",label:"0%~5%","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.profitProbability_3))},Object(r["toDisplayString"])(o.filterPercent(e.profitProbability_3)),3)]),_:1})]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"120天正收益比例","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.zheng_120))},Object(r["toDisplayString"])(o.filterPercent(e.zheng_120)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"120天负收益<3%比例","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.down_3))},Object(r["toDisplayString"])(o.filterPercent(e.down_3)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"周","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.jin_0))},Object(r["toDisplayString"])(o.filterPercent(e.jin_0)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"2周","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.jin_9))},Object(r["toDisplayString"])(o.filterPercent(e.jin_9)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"3周","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.jin_10))},Object(r["toDisplayString"])(o.filterPercent(e.jin_10)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"1月","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.jin_1))},Object(r["toDisplayString"])(o.filterPercent(e.jin_1)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"3月","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.jin_2))},Object(r["toDisplayString"])(o.filterPercent(e.jin_2)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"6月","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.jin_3))},Object(r["toDisplayString"])(o.filterPercent(e.jin_3)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"一年","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.jin_4))},Object(r["toDisplayString"])(o.filterPercent(e.jin_4)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"三年","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.jin_5))},Object(r["toDisplayString"])(o.filterPercent(e.jin_5)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"五年","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.jin_6))},Object(r["toDisplayString"])(o.filterPercent(e.jin_6)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"成立","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.jin_8))},Object(r["toDisplayString"])(o.filterPercent(e.jin_8)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"今年","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.jin_7))},Object(r["toDisplayString"])(o.filterPercent(e.jin_7)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"近3年最大回撤","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.retracementValue))},Object(r["toDisplayString"])(o.filterPercent(e.retracementValue)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"波动率(越小越好)","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.returnSd))},Object(r["toDisplayString"])(o.filterPercent(e.returnSd)),3)]),_:1}),Object(r["createVNode"])(c,{align:"right",label:"近3年净值修复天数","min-width":"60px"},{default:Object(r["withCtx"])(({row:e})=>[Object(r["createElementVNode"])("span",{class:Object(r["normalizeClass"])(o.getColor(e.restoreDaysMap))},Object(r["toDisplayString"])(e.restoreDaysMap),3)]),_:1})]),_:1},8,["data"])])}var n=a("bc3a"),o=a.n(n),c={name:"Fund1",data(){return{fundURL:globalProperties.fundURL,tableArr:[]}},created(){let e=localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")):globalProperties.defaultArr;this.tableArr=e.map((e,t)=>(console.log(e),this.getFundHistoryPerformancePageInfo({number:e.number,index:t}),this.getAdvice({number:e.number,index:t}),this.getJingZhi({number:e.number,index:t}),this.getFundDiagnosisPageInfo({skuId:e.skuId,index:t}),{number:e.number,name:e.name,status:e.status||"",end_date:"",advice:"",jin_0:"",jin_1:"",jin_2:"",jin_3:"",jin_4:"",jin_5:"",jin_6:"",jin_7:"",jin_8:"",jin_9:"",jin_10:"",zheng_120:"",down_3:"",avgRate_1:"",avgRate_2:"",avgRate_3:"",profitProbability_1:"",profitProbability_2:"",profitProbability_3:"",retracementValue:"",returnSd:"",restoreDaysMap:"",unit_nav:"",unit_acc_nav:"",nav_grtd:"",srank_l1m:"",srank_l3m:"",srank_l6m:"",srank_lty:"",srank_l1y:"",srank_l3y:"",srank_l5y:"",srank_base:""}))},methods:{getSetStatus(e){return console.log("status",e),e?"1"===e?"已买":"2"===e?"待移除":"3"===e?"待买":"观察":""},getSetColor(e){return console.log(240,"status",e),"1"===e?"#ff6600":"2"===e?"#E6A23C":"3"===e?"#67C23A":"#000000"},getAdvice(e){o.a.get(`${this.fundURL}/advice/?code=${e.number}`).then(t=>{this.tableArr[e.index]["advice"]=t.data.advice||""}).catch(e=>{console.log("err",e)})},getAdviceColor(e){return e?e.includes("积极持有")?"#ff801a":e.includes("谨慎持有")?"#44bf97":e.includes("持续观望")?"yellowgreen":void 0:""},getColor(e){return e?Number(e)<0?"down":"up":""},filterPercent(e){return e?Number(e).toFixed(2)+"%":""},getFundHistoryPerformancePageInfo(e){o.a.get(`${this.fundURL}/getFundHistoryPerformancePageInfo/?code=${e.number}`).then(t=>{let a=t.data||[],r=a[0]||{},i=a[1]||{},l=a[2]||{},n=a[3]||{},o=a[4]||{},c=a[5]||{},s=a[6]||{},b=a[7]||{},d=a[8]||{};this.tableArr[e.index]["jin_0"]=r.rate||"",this.tableArr[e.index]["jin_1"]=i.rate||"",this.tableArr[e.index]["jin_2"]=l.rate||"",this.tableArr[e.index]["jin_3"]=n.rate||"",this.tableArr[e.index]["jin_4"]=o.rate||"",this.tableArr[e.index]["jin_5"]=c.rate||"",this.tableArr[e.index]["jin_6"]=s.rate||"",this.tableArr[e.index]["jin_7"]=b.rate||"",this.tableArr[e.index]["jin_8"]=d.rate||""}).catch(e=>{console.log("err",e)})},getFundDiagnosisPageInfo(e){o.a.get(`${this.fundURL}/getFundDiagnosisPageInfo/?skuid=${e.skuId}`,{headers:{"Content-Type":"application/json;charset=UTF-8"}}).then(t=>{let a=t.data;console.log(238,a);var r=a.avgRateList||{};this.tableArr[e.index]["avgRate_1"]=(r[0]||{}).value||"",this.tableArr[e.index]["avgRate_2"]=(r[1]||{}).value||"",this.tableArr[e.index]["avgRate_3"]=(r[2]||{}).value||"";var i=a.profitProbability||[],l=i[2]||{},n=l.probabilityIntervals||[];this.tableArr[e.index]["profitProbability_1"]=(n[0]||{}).value||"",this.tableArr[e.index]["profitProbability_2"]=(n[1]||{}).value||"",this.tableArr[e.index]["profitProbability_3"]=(n[2]||{}).value||"";var o=a.maxRetracement||{};console.log("fund05.vue 315 [maxRetracement]",o),this.tableArr[e.index]["retracementValue"]=o.retracementValue||"";var c=a.returnSd||{};this.tableArr[e.index]["returnSd"]=c.value||"";var s=a.restoreDaysMap||{};this.tableArr[e.index]["restoreDaysMap"]=s.value||""}).catch(e=>{console.log("err",e)})},getJingZhi(e){o.a.get(`${this.fundURL}/obtainNetWorth/?code=${e.number}&size=120&page=1`,{headers:{"Content-Type":"application/json;charset=UTF-8"}}).then(t=>{let a=t.data;if(console.log("fund05.vue 234 [arr]",a),a.length){let t=Number(a[0]["totalNetValue"]),r=Number(a[10]["totalNetValue"]);this.tableArr[e.index]["jin_9"]=((t-r)/r*100).toFixed(2)||"";let i=Number(a[15]["totalNetValue"]);this.tableArr[e.index]["jin_10"]=((t-i)/i*100).toFixed(2);let l=0,n=0;a.forEach((e,t)=>{parseFloat(e.dailyProfit||0)>=0&&l++,parseFloat(e.dailyProfit||0)<=-3&&n++}),this.tableArr[e.index]["zheng_120"]=(100*l/a.length).toFixed(2),this.tableArr[e.index]["down_3"]=(100*n/a.length).toFixed(2)}}).catch(e=>{console.log("err",e)})}}},s=(a("4bf9"),a("6adc"),a("6b0d")),b=a.n(s);const d=b()(c,[["render",l],["__scopeId","data-v-3502ba3e"]]);t["default"]=d}}]);