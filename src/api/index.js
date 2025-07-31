import request from '@/utils/request';

// get请求示例
export async function server_testget(data) {
  return request.get('/api/testget', data);
}

// post请求示例
export async function server_testpost(data) {
  return request.post('/api/testpost',data);
}
