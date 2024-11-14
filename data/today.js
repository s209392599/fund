// 基金实时涨幅
const fetch = require('node-fetch');

const { yimai, guancha, fangqi } = require('./data.js');

var arr = [...yimai, ...guancha];

async function getFund(code, index) {
  console.log(`正在请求第 ${index + 1} 个基金数据 ~~~`);
  // https://lc.jr.jd.com/finance/fund/latestdetail/achievement/?fundCode=400030&disclosureType=1&activeIndex=2
  let u = `https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundHistoryNetValuePageInfo?reqData={"fundCode":"${code}","pageNum":1,"pageSize":20,"channel":"9"}`;
  return fetch(u, {})
    .then((res) => res.json())
    .then((res) => {
      let resultData = res.resultData || {};
      let datas = resultData.datas || {};
      let netValueList = datas.netValueList || [];
      // '{"date":"2024-03-26","netValue":"1.3149","dailyProfit":"-0.02","totalNetValue":"1.5429"}'
      // '{"date":"2024-03-26","netValue":"1.3149","dailyProfit":"-0.02","totalNetValue":"1.5429"}'
      return netValueList[0] || {};
    });
}

var IncreaseArr = [];

// Number((Number("-0.07") * 100).toFixed(0))

async function fetchFundData() {
  const cur_year = new Date().getFullYear();
  let cur_month = new Date().getMonth() + 1;
  cur_month = cur_month < 10 ? `0${cur_month}` : cur_month;
  let cur_day = new Date().getDate();
  if (cur_day < 10) cur_day = `0${cur_day}`;
  const cur_date = `${cur_year}-${cur_month}-${cur_day}`;

  for (let i = 0; i < arr.length; i++) {
    let obj = await getFund(arr[i].number, i);
    const flag = obj.date === cur_date;
    IncreaseArr.push({
      代号: arr[i].number,
      名称: arr[i].name,
      万元收入: flag ? Math.round(Number(obj.dailyProfit) * 100) : 0,
      单位净值: flag ? obj.netValue : '',
      累计净值: flag ? obj.totalNetValue : '',
      日期: flag ? obj.date : '',
    });
  }
}

fetchFundData().then(() => {
  const count = IncreaseArr.reduce(
    (pre, cur) => pre + Number(cur['万元收入']),
    0
  );
  console.log('今日累计收益: ' + count + '元');
  console.table(IncreaseArr);
  // console.table(IncreaseArr, { columns: { 万元收入: { align: 'right' } } });// console-table-printer'
});

// $(this.el).on('mousedown', '.gantt_cell', function () {
//   $(document).on('mousemove.drag', async function (e) {
//     //
//   });

//   $(document).on('mouseup.drag', async function (e) {
//     //
//   });
// });
// 怎么在这个里面进行鼠标点击和拖拽的判断呢？

$(this.el).on('mousedown', '.gantt_cell', function (e) {
  let isDragging = false;
  let startX = e.pageX;
  let moved = false;

  $(document).on('mousemove.drag', function (e) {
    if (!isDragging) {
      let deltaX = Math.abs(e.pageX - startX);
      if (deltaX > 5) {
        isDragging = true;
        moved = true;
        console.log('开始拖拽');
      }
    }

    if (isDragging) {
      console.log('正在拖拽', e.pageX, e.pageY);
    }
  });

  $(document).on('mouseup.drag', function (e) {
    $(document).off('mousemove.drag mouseup.drag');

    if (isDragging) {
      console.log('结束拖拽');
      // 在这里添加拖拽结束时的逻辑
    } else if (!moved) {
      console.log('点击事件');
      // 在这里添加点击事件的处理代码
    }

    // 重置状态
    isDragging = false;
    moved = false;
  });
});
