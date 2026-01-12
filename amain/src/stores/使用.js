import { useFundStore } from '@/stores/fundStore';

export default {
  setup() {
    const fundStore = useFundStore();

    // 添加基金
    const addFund = async () => {
      await fundStore.addFund({
        fund_code: '000001',
        fund_name: '华夏成长混合',
        fund_type: '混合型',
        fund_feilv: { time: '2023-01-01', data: { /* 费率数据 */ } },
        fund_fenhong: { time: '2023-01-01', data: { /* 分红数据 */ } },
        fund_chicang: { time: '2023-01-01', data: { /* 持仓数据 */ } },
        fund_gz: { time: '2023-01-01', data: { /* 估值数据 */ } }
      });
    };

    // 更新基金（会自动更新update_time）
    const updateFund = async () => {
      await fundStore.updateFund('000001', {
        fund_name: '华夏成长混合(更新)',
        fund_feilv: { time: '2023-01-02', data: { /* 新费率数据 */ } }
      });
    };

    // 查询单个基金
    const getFund = async () => {
      const fund = await fundStore.getFund('000001');
      console.log(fund);
    };

    // 查询所有基金
    const getAllFunds = async () => {
      const funds = await fundStore.getAllFunds();
      console.log(funds);
    };

    // 按类型查询基金
    const getFundsByType = async () => {
      const funds = await fundStore.getFundsByType('混合型');
      console.log(funds);
    };

    // 删除基金
    const deleteFund = async () => {
      await fundStore.deleteFund('000001');
    };

    return {
      addFund,
      updateFund,
      getFund,
      getAllFunds,
      getFundsByType,
      deleteFund
    };
  }
};
