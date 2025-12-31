const fs = require('fs').promises;
const filterJson = require('./data/filter.json');

const codeStr = filterJson.map(item => item.fund_code).join(',');
console.log(codeStr);
