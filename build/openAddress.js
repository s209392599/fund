var c = require('child_process');

var address = 'https://gitee.com/gkjson/fund/pages';

let platform = process.platform;
if (platform.startsWith('win')) {
  c.exec('start ' + address);
} else {
  c.exec('open ' + address);
}
