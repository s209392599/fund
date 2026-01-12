import { useFundStore } from '@/stores/fundStore';

const fundStore = useFundStore();
// 添加基金示例
await fundStore.addFund({
  fund_code: '000001',
  fund_name: '华夏成长',
  fund_type: '混合型',
  fund_feilv: { time: '2023-01-01', data: { fee: 0.5 } },
  fund_fenhong: { time: '2023-01-01', data: { dividend: 1.2 } },
  fund_chicang: { time: '2023-01-01', data: { holdings: ['股票A', '股票B'] } },
  fund_gz: { time: '2023-01-01', data: { valuation: 1.05 } }
});

// 查询某个基金号的全部数据
async function getFundData(fundCode) {
  const fund = await fundStore.getFund(fundCode);
  if (fund) {
    console.log('全部数据:', fund);
    return fund;
  } else {
    console.log('未找到基金:', fundCode);
    return null;
  }
}

// 查询某个基金号的特定字段
async function getFundField(fundCode, fieldName) {
  const fund = await fundStore.getFund(fundCode);
  if (fund && fund[fieldName]) {
    console.log(`${fieldName} 字段数据:`, fund[fieldName]);
    return fund[fieldName];
  } else {
    console.log('未找到基金或字段:', fundCode, fieldName);
    return null;
  }
}

// 使用示例
// 查询基金 '000001' 的全部数据
getFundData('000001');

// 查询基金 '000001' 的 fund_feilv 字段
getFundField('000001', 'fund_feilv');

// 查询基金 '000001' 的 fund_name 字段
getFundField('000001', 'fund_name');

// 查询基金 '000001' 的 fund_gz 字段
getFundField('000001', 'fund_gz');
