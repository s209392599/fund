const fetch = require('node-fetch');
const fs = require('fs');

const data = JSON.stringify({
  bodyEncrypt:
    'AQAAAOsDAABQBAAAMTU2NDA0MzUGn1MZkxCiG5PxNiI2J0qT4/CMW3n1t6G/RQHuEqvIFyQTSL06GldZU75B+g16bT5jL7OdZT+xSKSYu7QHS3ByWLWlEwgOl2Efp2gMDKxpt1PNpgp4fT/4nXDWMocy1dCjpYplj6SkAvpe5XxbTRFxqu7SgWG6CW73yNizIA7hu5FZ7GV+D+9rsCufhFMfAipedf5N6ysqvNWxi/EvNLIkefNsGpwvgYtu2YtRawaJk8pQ3Dc4jyt0MjWWEwaC3sq353yQ9hELJejuf1VOkW9CxyPsxt4QuSPE8+h+0GTiOlz95ykLrpF8RbbRlfqhl1I8i2hL5Zn6QQq9sv+fDsbSi/BWGAzFJBeyKzYkQ8RMT6vJSa6r4+vUokgOk0S/kjMWrIcfrVzA3SIIGMYVq342k/2Q/ceZlFDxEA+nQKcBhKE/kLUdxeSn35MP/TCoJiJs3IQd+v54AD0LKnVMm2a5QcWsec749xeZ5cTWo5LpnmDxkxZn4v7lLIf/xAhxGrTA2Xg2WjXTcITh2Xz5arOQSO882cIuVvu4Gf4glemwNePnjLIOD0ziMWRdQrvRqj6/Zx4S/Xsx9S/ADGYHeHAw4ZtqfZqUNaKySWC2FlGP0Rd2BKvrhqge2snvJ69lmAaU3fiCt9FGekfURLzqmRylvXURw1+wuCV6kjrksRHznxY+pGaX7cyu4qzFLZWIJ/sY5GZOkDWoQDG20hFnjzVAD739JAoAnltAqoLHgqRbLd/6XKvkQywHKV6T7jn65SVBWUnncbdEDHo+qzfWtAVCiNByxVmFIWw6W7YUSsArXkIt9N3jdflx6XG/YVVGQJ3ccA9ZasjGc3p1E7YCAyIVtO0o/jxB+tm7mqV96T0jK5l7f736Nz64xoIPrvf7TYzQYacpiyDcJxIP2EDUnecg6SlmykdCGYW5iOk0e1SNp0gvBqjz98PuZvmH+7xrxodl/uRPEvZ+/0msv4aVCbckw+UEA9P8e0yhRm+S0OPP4efFO1yeDJtDF3P6gTMSwTCAfb/AbgVaAIBEKxuM00nUs/VBPuFiHBJLOoq7YIEla3Yiy0B7NpCABrD2XgfnSJXKQNoUTokV4zwdodu/WPmtxedI6flN/T5jhz33DCnHOj4R3X7K8j30ioyt7dwwLXpo0FMHr2FXzy8xv6QTJc18cMQaV8iCX5pj/vv3zIhsaiaokFyb+xk7ZAyemErtoWQBvuYGJspiS5IGjv7zDQoCABoY1hUhxmCwOt52Zyne5s2nI8JEyxWsGWAIFu3Hdp0E6Xo+Tve096a0CIBbBrVFGZ/2ydZTo0Kd2rCe76LrsEMHseerBZz20eo3iKtcAhuokfVffUnZ1E/HVY5DElyne+5PxfaGcKh6fMUWIa7DresI7PwcPsbJjRX2kZpQLHEGO/iwCObx81WSVh3hwiIBf2L5bF7m09H1KGw5Gj1l+hNeMQWE470QjRRsLCJ8RBBJWgc/7D7hHW/Rx0RqALSPBQRslhjnCKuyEW9SERx5bing5eZyFTmwLJhrFTM6k6r7sjLZdSxY+Z92KysbxT0eXCQeaIbIGFvVPNRoCjYqXCG3XOj4QjCjujwLaElK98yJa8yLHVIYVPUkXeUS20GE',
  channelEncrypt: 1,
});

const options = {
  method: 'POST',
  headers: {
    'User-Agent': 'JDJRMobile/618 CFNetwork/1329 Darwin/21.3.0',
    'Content-Type': 'application/json',
    'content-type': 'application/json; charset=UTF-8',
    isallowrecommend: '1',
    'x-mlaas-at': 'wl=0&id=3471622568713834675&src=sgm-mobile',
    'sgm-context':
      '3471622568713834675;3471622568713834675;false;9HwAEg@vlKkp7SqT8dSSBaj',
    'accept-language': 'zh-CN,zh-Hans;q=0.9',
    jdgs: '{"b1":"bb0eb1e7-979d-4072-94ae-e36f5f305ef0","b2":"2.2.2_1","b3":"2.1","b4":"MHltfKgxcMgzpVfXPIZmrXTjW0FKFMgQcFLaeYw4zDpsJDHRWxCrekzCYxToUKeo+iYJaZ8PTmh23xH3y1/u8yPLFif+8ehlFTEEml5fE4HZqpRuFKvTCAKb5H0fNMxYAZlzognpxgI9/meOqbofO1ta1j1dvOCM5AfpLwO7/+Lc2dK8a024RLhJrIObHxtCWfdgqxC5+0OJiCq1XPiBj9hT5Je4gjNBZFfgllCDC/fraSXOV+dCFXUxlpcesTesbqqwvrLpB7F/3rI0ubh8nB2eWVyFb5p64QTuGm+hiuPH3tgEFIJWOvY47gXX","b5":"d5747088fe7de31c8381d2f2dd974b12f084bcf7","b7":"1758980830010","b6":"d080ea0ffc53b6d61441acadc4ca80b3afd24f1a"}',
    Cookie:
      'qid_evord=2808; qid_sid=5e8c6183-831c-47b3-8216-0b9f0676206d-13; 3AB9D23F7A4B3C9B=2PH2NTSK3H3P6RIG3ZORMTFUS6RMEFFZFCDJBD7XYIR7TPKESHIYHHLZI4MG6SCKG7XK2IWE3QXZRDPYUGDPA6FXY4; 3AB9D23F7A4B3CSS=jdd032PH2NTSK3H3P6RIG3ZORMTFUS6RMEFFZFCDJBD7XYIR7TPKESHIYHHLZI4MG6SCKG7XK2IWE3QXZRDPYUGDPA6FXY4AAAAMZRNTE5AIAAAAACMMKRO4QGY6PYAX; pt_key=app_openAAJo18cGADAM_ZnT74ey7SCE3WmWTSSoJ6C3FHnC7aPagw1V90musAVWfirGj6g6lJv5vrX99-g; pt_pin=%E5%8D%9A%E5%AD%A6%E5%89%8D%E9%94%8B; pwdt_id=%E5%8D%9A%E5%AD%A6%E5%89%8D%E9%94%8B; qid_ls=1758974517061; qid_ts=1758980360966; qid_vis=13; sid=521f49b99b977b4104c85eb422da3e6w; qid_fs=1758383314517; qid_uid=5e8c6183-831c-47b3-8216-0b9f0676206d',
  },
  body: data,
  // body: ``,
};

fetch(
  'https://ms.jr.jd.com/gw2/generic/jj/newna/m/getRankingProductListV2',
  options
)
  .then((response) => response.text())
  .then((result) => {
    fs.writeFileSync('a2.txt', result, 'utf8');
  })
  .catch((error) => console.log('error', error));
