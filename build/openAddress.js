var c = require('child_process');

var address = 'https://s209392599.github.io/fund/#/index/fund09';

let platform = process.platform;
if (platform.startsWith('win')) {
  c.exec('start ' + address);
} else {
  c.exec('open ' + address);
}
