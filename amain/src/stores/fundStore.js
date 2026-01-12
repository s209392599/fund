import { defineStore } from 'pinia';
import Dexie from 'dexie';

class FundDatabase extends Dexie {
  constructor() {
    super('FundDatabase');
    this.version(1).stores({
      funds: 'fund_code, fund_name, fund_type, update_time, fund_feilv, fund_fenhong, fund_chicang, fund_gz'
    });
    this.funds = this.table('funds');
  }
}

const db = new FundDatabase();

export const useFundStore = defineStore('fundStore', {
  state: () => ({
    // 可以添加一些状态，如果需要
  }),

  actions: {
    async addFund(fund) {
      const fundWithTime = { ...fund, update_time: new Date() };
      await db.funds.add(fundWithTime);
    },

    async updateFund(fund_code, updates) {
      await db.funds.update(fund_code, { ...updates, update_time: new Date() });
    },

    async getFund(fund_code) {
      return await db.funds.get(fund_code);
    },

    async getAllFunds() {
      return await db.funds.toArray();
    },

    async deleteFund(fund_code) {
      await db.funds.delete(fund_code);
    },

    // 可以添加更多方法，如按类型查询等
    async getFundsByType(fund_type) {
      return await db.funds.where('fund_type').equals(fund_type).toArray();
    }
  }
});
