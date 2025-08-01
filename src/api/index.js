import request from '@/utils/request';

// get请求示例
export async function server_testget(data) {
  return request.get('/testget', data);
}

// post请求示例
export async function server_testpost(data) {
  return request.post('/testpost', data);
}

// post请求示例
export async function server_fund_today_rate_by_timer(data) {
  return request.post('/fund_today_rate_by_timer', data);
}
