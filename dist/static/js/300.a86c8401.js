"use strict";(self["webpackChunkjijin"]=self["webpackChunkjijin"]||[]).push([[300],{300:function(e,r,n){n.r(r),n.d(r,{default:function(){return b}});var t=n(641),a=n(33);const s={class:"hello"},i={class:"list-title"},l={title:"近120天正收益天数比率"},o={class:"list-header"},c=["title"],u=["href"],d={class:"list-content"},p={class:"date"},h={class:"nav"};function m(e,r,n,m,k,v){return(0,t.uX)(),(0,t.CE)("div",s,[((0,t.uX)(!0),(0,t.CE)(t.FK,null,(0,t.pI)(k.numberArr,((e,n)=>((0,t.uX)(),(0,t.CE)("div",{class:"list",key:n},[(0,t.Lk)("div",i,[(0,t.Lk)("span",null,(0,a.v_)(k.numberArr[n])+" "+(0,a.v_)(k.nameArr[n]),1),r[0]||(r[0]=(0,t.eW)()),(0,t.Lk)("span",l,(0,a.v_)(k.profit[n]),1)]),(0,t.Lk)("div",o,[(0,t.Lk)("div",{class:"list-name",title:k.numberArr[n]+"  "+k.nameArr[n]},[r[1]||(r[1]=(0,t.eW)(" 周(")),(0,t.Lk)("span",{class:(0,a.C4)(Number(k.weeklyIncrease[n])>=0?"up-org":"down-grn")},(0,a.v_)(k.weeklyIncrease[n])+"%",3),r[2]||(r[2]=(0,t.eW)(") 双周(")),(0,t.Lk)("span",{class:(0,a.C4)(Number(k.biweeklyIncrease[n])>=0?"up-org":"down-grn")},(0,a.v_)(k.biweeklyIncrease[n])+"%",3),r[3]||(r[3]=(0,t.eW)(") 三周(")),(0,t.Lk)("span",{class:(0,a.C4)(Number(k.threeWeeks[n])>=0?"up-org":"down-grn")},(0,a.v_)(k.threeWeeks[n])+"%",3),r[4]||(r[4]=(0,t.eW)(") "))],8,c),(0,t.Lk)("a",{target:"_blank",class:"list-percentage",href:"http://fund.eastmoney.com/"+k.numberArr[n]+".html?spm=aladin"},"日涨幅",8,u)]),(0,t.Lk)("div",d,[((0,t.uX)(!0),(0,t.CE)(t.FK,null,(0,t.pI)(k.info[n],((e,r)=>((0,t.uX)(),(0,t.CE)("div",{class:"item",key:r},[(0,t.Lk)("div",p,(0,a.v_)(e.date),1),(0,t.Lk)("div",h,(0,a.v_)(e.nav),1),(0,t.Lk)("div",{class:(0,a.C4)(["percentage",Number(e.percentage)>=0?"up-org":"down-grn"])},(0,a.v_)(e.percentage)+"%",3)])))),128))])])))),128))])}var k=n(335),v={name:"Fund1",data(){return{fundURL:globalProperties.fundURL,numberArr:[],nameArr:[],weeklyIncrease:[],biweeklyIncrease:[],threeWeeks:[],info:[],profit:[]}},created(){let e=localStorage.getItem("info")?JSON.parse(localStorage.getItem("info")):globalProperties.defaultArr;e.forEach(((e,r)=>{this.profit.push("0"),this.numberArr.push(e.number),this.nameArr.push(e.name),this.getInfo({code:e.number,index:r})}))},methods:{getInfo(e){k.A.get(`${this.fundURL}/historicalIncome/?code=${e.code}&pagesize=120`,{headers:{"Content-Type":"application/json;charset=UTF-8"}}).then((r=>{let n=r.data.items;this.info[e.index]=n;let t=Number(n[0]["nav"]),a=Number(n[5]["nav"]);this.weeklyIncrease[e.index]=((t-a)/a*100).toFixed(2);let s=Number(n[10]["nav"]);this.biweeklyIncrease[e.index]=((t-s)/s*100).toFixed(2);let i=Number(n[15]["nav"]);this.threeWeeks[e.index]=((t-i)/i*100).toFixed(2);let l=0;n.forEach(((e,r)=>{(e.percentage||0)>=0&&l++})),this.profit[e.index]=(100*l/n.length).toFixed(2)+"%"})).catch((e=>{console.log("err",e)}))}}},f=n(262);const g=(0,f.A)(v,[["render",m],["__scopeId","data-v-4a4f0f4a"]]);var b=g}}]);