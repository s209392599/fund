try {
  const fetch = require('node-fetch');
  console.log('node-fetch type:', typeof fetch);
  if (fetch.default) {
      console.log('fetch.default exists');
  }
  // 尝试检查 package.json 版本（如果能找到）
  // 或者打印 fetch 的属性
  console.log(Object.keys(fetch));
} catch (e) {
  console.log('Error requiring node-fetch:', e.message);
}
