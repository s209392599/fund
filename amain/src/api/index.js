import request from '@/utils/request';

// get请求示例
// export async function server_testget(data) {
//   return request.get('/testget', data);
// }
// post请求示例
// export async function server_testpost(data) {
//   return request.post('/testpost', data);
// }
// 登录
export async function server_fund_amain_login(data) {
  return request.post('/fund_amain_login', data);
}
// 保存基金数据
export async function server_fund_amain_save_fund_data(data) {
  return request.post('/fund_amain_save_fund_data', data);
}
// 查询用户基金
export async function server_fund_amain_fund_query_by_user(data) {
  return request.post('/fund_amain_fund_query_by_user', data);
}
// 修改某个用户信息
export async function server_fund_update_user_info(data) {
  return request.post('/fund_update_user_info', data);
}
// 获取群主公开基金
export async function server_fund_amain_public_funds(data) {
  return request.post('/fund_amain_public_funds', data);
}
// 获取基金的历史业绩
export async function server_fund_history_performance(data) {
  return request.post('/fund_history_performance', data);
}

// 获取基金历史数据
export async function server_fund_history_data(data) {
  return request.post('/fund_history_data', data);
}
// 获取timer基金数据
export async function server_fund_today_rate_by_timer(data) {
  return request.post('/fund_today_rate_by_timer', data);
}
// 获取公共的基金数据-查询
export async function server_fund_manage_fund_query(data) {
  return request.post('/fund_manage_fund_query', data);
}
// 获取公共的基金数据-新增
export async function server_fund_manage_fund_add(data) {
  return request.post('/fund_manage_fund_add', data);
}
// 获取公共的基金数据-修改
export async function server_fund_manage_fund_update(data) {
  return request.post('/fund_manage_fund_update', data);
}
// 获取公共的基金数据-删除
export async function server_fund_manage_fund_delete(data) {
  return request.post('/fund_manage_fund_delete', data);
}
// 获取天天基金的搜索结果
export async function server_fund_search_bytiantian(data) {
  return request.post('/fund_search_bytiantian', data);
}
// 排序-公共的基金数据
export async function server_fund_manage_fund_sort(data) {
  return request.post('/fund_manage_fund_sort', data);
}
// fund_amain_getfundgz-获取实时涨幅
export async function server_fund_amain_getfundgz(data) {
  return request.post('/fund_amain_getfundgz', data);
}
// fund_jd_getFundTradeRulesPageInfo 获取京东基金交易规则
export async function server_fund_jd_getFundTradeRulesPageInfo(data) {
  return request.post('/fund_jd_getFundTradeRulesPageInfo', data);
}
// fund_jd_detailPageInfoWithNoPin 获取基金的基本信息
export async function server_fund_jd_detailPageInfoWithNoPin(data) {
  return request.post('/fund_jd_detailPageInfoWithNoPin', data);
}
// fund_jd_getFundDividendPageInfo 获取基金分红
export async function server_fund_jd_getFundDividendPageInfo(data) {
  return request.post('/fund_jd_getFundDividendPageInfo', data);
}
// fund_jd_InvestmentDistributionPageInfo 获取基金持仓
export async function server_fund_jd_InvestmentDistributionPageInfo(data) {
  return request.post('/fund_jd_InvestmentDistributionPageInfo', data);
}
// fund_jd_getFundDetailChartPageInfo 获取基金历史数据
export async function server_fund_jd_getFundDetailChartPageInfo(data) {
  return request.post('/fund_jd_getFundDetailChartPageInfo', data);
}

// --------------------------------------------------------------  下面是数据库操作

// 获取所有正常监听的基金(排除关键词、不可买)
export async function server_fund_mysql_normal_all(data) {
  return request.post('/fund_mysql_normal_all', data);
}
// 根据关键词返回基金
export async function server_fund_mysql_query_keywords(data) {
  return request.post('/fund_mysql_query_keywords', data);
}
// 根据 基金号获取基金数据
export async function server_fund_mysql_fundinfo_byfunds(data) {
  return request.post('/fund_mysql_fundinfo_byfunds', data);
}
