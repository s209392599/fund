const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');


// HTTP/1.1
// Host:
// isAllowRecommend: 1
// Accept: */*
// X-MLAAS-AT: wl=0&id=3276392949078479027&src=sgm-mobile
// Sgm-Context: 3276392949078479027;3276392949078479027;false;9HwAEg@vlKkp7SqT8dSSBaj
// Accept-Encoding: gzip, deflate, br
// Accept-Language: zh-CN,zh-Hans;q=0.9
// Content-Length: 1732
// User-Agent: JDJRMobile/618 CFNetwork/1329 Darwin/21.3.0
// Connection: keep-alive
//
// Cookie: qid_evord=2613; qid_sid=5e8c6183-831c-47b3-8216-0b9f0676206d-12; 3AB9D23F7A4B3C9B=2PH2NTSK3H3P6RIG3ZORMTFUS6RMEFFZFCDJBD7XYIR7TPKESHIYHHLZI4MG6SCKG7XK2IWE3QXZRDPYUGDPA6FXY4; 3AB9D23F7A4B3CSS=jdd032PH2NTSK3H3P6RIG3ZORMTFUS6RMEFFZFCDJBD7XYIR7TPKESHIYHHLZI4MG6SCKG7XK2IWE3QXZRDPYUGDPA6FXY4AAAAMZRMNXJ6AAAAAADVOSKDHWDKBNNEX; pt_key=app_openAAJo18cGADAM_ZnT74ey7SCE3WmWTSSoJ6C3FHnC7aPagw1V90musAVWfirGj6g6lJv5vrX99-g; pt_pin=%E5%8D%9A%E5%AD%A6%E5%89%8D%E9%94%8B; pwdt_id=%E5%8D%9A%E5%AD%A6%E5%89%8D%E9%94%8B; sid=521f49b99b977b4104c85eb422da3e6w; qid_ls=1758971658530; qid_ts=1758974517061; qid_vis=12; qid_fs=1758383314517; qid_uid=5e8c6183-831c-47b3-8216-0b9f0676206d

fetch(
  'https://ms.jr.jd.com/gw/generic/aladdin/newna/m/getPageMutilDataNotLogin?pagetype=3154',
  {
    headers: {
      accept: '*/*',
      'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
      'sec-ch-ua':
        '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'script',
      'sec-fetch-mode': 'no-cors',
      'sec-fetch-site': 'same-origin',
      referer: 'https://ms.jr.jd.com',
      "content-type": "application/json; charset=UTF-8"
    },
    body: `jdgs: {"b1":"bb0eb1e7-979d-4072-94ae-e36f5f305ef0","b2":"2.2.2_1","b3":"2.1","b4":"YK0CE1Ln49C6QUpdoHOEJrKa2nP7S3pZwU6phueOcgMWCTgrlVQcplZMGSWYN1eB/2le9o+R99/kWa18WDbOxbZhNPi6TUAOThcqexgq+xPYaADE7Av5tGP3ZWVQI8VAd7fyeGKvrrWBujTy4bObBoj1xZW22YBR6sFfDSaxM5srNtbl1POz+GnhMcVAMmKRNjKIr/7qVlde1W0DIWjETg8dV1Ze2CgjViII7p8/tXw3quPt3tGT9Hc+2vnLz9zt83dn39s+iEhXP/endWUd8JpckJOQSbitRAhYE2qphm75lKTy4RGMwASaik5PYd8=","b5":"d8609e56e5899112cfcc5fb8e8b19150d71d8828","b7":"1758976284467","b6":"4421019b906b3a864ec1152b164f57aeb4033c16"}`,
    method: 'post',
    mode: 'cors',
    credentials: 'include',
  }
)
  .then((res) => res.text())
  .then((res) => {
    console.log('Response Text:', res);
    // fs.writeFileSync(path.join(__dirname, 'a1.txt'), res);
    // console.log(res.indexOf('{'));
    // console.log(res.lastIndexOf('}'));
    // const jsonString = res.substring(res.indexOf('{'), res.lastIndexOf('}') + 1);
    // const jsonObject = JSON.parse(jsonString);
    // fs.writeFileSync(
    //   'rankData.json',
    //   JSON.stringify(jsonObject, null, 2),
    //   'utf8'
    // );
  })
  .catch((err) => {
    console.error('Error fetching fund data:', err);
  });

