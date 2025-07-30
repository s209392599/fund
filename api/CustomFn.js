// CustomDateFtt(1565059668200,"yyyy-MM-dd hh:mm:ss");// '2019-08-06 10:47:48'
// CustomDateFtt(1565059668200,"yyyy-MM-dd");// '2019-08-06'
var CustomDateFtt = (date, fmt) => {
  if (date != null && date != '' && date != undefined) {
    if (typeof date == 'string') {
      if (date.includes('T')) {
        date = new Date(date);
      } else {
        date = date.replace(/-/g, '/');
      }
    }
    var date = new Date(date);
    var o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds(), //毫秒
    };
    o.S < 100 && (o.S = o.S < 10 ? '00' + o.S : '0' + o.S);
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        );
  } else {
    fmt = '';
  }
  return fmt;
};
exports.CustomDateFtt = CustomDateFtt;
