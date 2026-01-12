import { defineStore } from 'pinia';
import Dexie from 'dexie';

import { CustomDateFtt } from '@/utils/CustomFn';

class FundDatabase extends Dexie {
  constructor() {
    super('FundDatabase');  // 数据库名称
    this.version(1).stores({
      // 使用 & 符号表示唯一索引，fund_code 作为主键
      funds: '&fund_code'
    });
    this.funds = this.table('funds');  // 创建表实例
  }
}

const db = new FundDatabase();

export const useFundStore = defineStore('fundStore', {
  state: () => ({
    // 可以添加一些状态，如果需要
  }),

  actions: {
    async addFund(fund) {
      const fundWithTime = { ...fund, update_time: CustomDateFtt(new Date(), 'yyyy-MM-dd hh:mm:ss') };
      await db.funds.add(fundWithTime);
    },
    // 批量添加几个基金数据,注意fund_code重复的直接更新所在的行数据
    async addFunds(fundArray) {
      const fundsWithTime = fundArray.map(fund => ({
        ...fund,
        update_time: CustomDateFtt(new Date(), 'yyyy-MM-dd hh:mm:ss')
      }));
      for (const fund of fundsWithTime) {
        await db.funds.put(fund); // put 方法会根据主键更新或添加
      }
    },

    async updateFund(fund_code, updates) {
      await db.funds.update(fund_code, { ...updates, update_time: CustomDateFtt(new Date(), 'yyyy-MM-dd hh:mm:ss') });
    },

    async getFund(fund_code, fieldName='all') {
      // 如果没有对应的fund_code，返回null
      if (!fund_code) {
        return null;
      }
      // 如果没有指定，或者传入all，返回全部数据
      if (fieldName === 'all') {
        return await db.funds.get(fund_code);
      }
      // 用逗号分割fieldName,支持查询特定字段
      fieldName = fieldName.split(',');
      // 过滤掉不存在的字段
      fieldName = fieldName.filter(f => fund_code[f]);
      // 如果没有指定的字段，返回null
      if (fieldName.length === 0) {
        return null;
      }
      // 从数据库获取指定字段的数据
      const fund = await db.funds.get(fund_code);
      return fund ? fieldName.map(f => fund[f]) : null;
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
