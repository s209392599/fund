import request from '@/utils/request';

export async function server_testget(data) {
  return request({
    url: '/api/testget',
    method: 'get',
    params: data,
  });
}

export async function server_testpost(data) {
  return request({
    url: '/api/testpost',
    method: 'post',
    params: data,
  });
}
