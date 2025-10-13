import request from '@/utils/request';

// get请求示例
export async function server_testget(data) {
  return request.get('/testget', data);
}
// post请求示例
export async function server_testpost(data) {
  return request.post('/testpost', data);
}
// 登录
export async function server_fund_public_login(data) {
  return request.post('/fund_public_login', data);
}
// 获取所有用户
export async function server_fund_get_all_user_info(data) {
  return request.post('/fund_get_all_user_info', data);
}
// 新增用户
export async function server_fund_add_user_info(data) {
  console.log('-data', data);
  return request.post('/fund_add_user_info', data);
}
// 删除某个用户
export async function server_fund_del_user_info(data) {
  return request.post('/fund_del_user_info', data);
}
// 修改某个用户信息
export async function server_fund_update_user_info(data) {
  return request.post('/fund_update_user_info', data);
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
export async function server_fund_public_fund_query(data) {
  return request.post('/fund_public_fund_query', data);
}
// 获取公共的基金数据-新增
export async function server_fund_public_fund_add(data) {
  return request.post('/fund_public_fund_add', data);
}
// 获取公共的基金数据-修改
export async function server_fund_public_fund_update(data) {
  return request.post('/fund_public_fund_update', data);
}
// 获取公共的基金数据-删除
export async function server_fund_public_fund_delete(data) {
  return request.post('/fund_public_fund_delete', data);
}
// 获取天天基金的搜索结果
export async function server_fund_search_bytiantian(data) {
  return request.post('/fund_search_bytiantian', data);
}
// 排序-公共的基金数据
export async function server_fund_public_fund_sort(data) {
  return request.post('/fund_public_fund_sort', data);
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
