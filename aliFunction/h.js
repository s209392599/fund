const fetch = require('node-fetch');

let u;
// u =
//   'https://acaee3e4137c47abac64e44e32b624c9.apig.cn-east-3.huaweicloudapis.com';
u =
  'https://775477fdb4134cd5924c62381cf95ed0.apig.cn-east-3.huaweicloudapis.com/event';

u =
  'https://console.huaweicloud.com/functiongraph/rest/cff/v2/54930c98af0345b98b15486a6cd558b6/fgs/functions/urn:fss:cn-east-3:54930c98af0345b98b15486a6cd558b6:function:default:event:latest/invocations';

async function getData() {
  try {
    const response = await fetch(`${u}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'test',
      }),
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

getData();
