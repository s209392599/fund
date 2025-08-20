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
export async function server_fund_login(data) {
  return request.post('/fund_login', data);
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
// 获取timer基金数据
export async function server_fund_today_rate_by_timer(data) {
  return request.post('/fund_today_rate_by_timer', data);
}
