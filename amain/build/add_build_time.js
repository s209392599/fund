// 添加打包时间信息等
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 获取当前文件的目录路径（替代 __dirname）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 获取当前时间
function getUpdateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 修改 index.html 添加版本信息
function addVersionInfo() {
  const indexPath = path.resolve(__dirname, '../dist/index.html');

  // 检查 dist/index.html 是否存在
  if (!fs.existsSync(indexPath)) {
    console.error('dist/index.html 文件不存在，请先执行打包命令');
    process.exit(1);
  }

  let htmlContent = fs.readFileSync(indexPath, 'utf-8');
  const updateTime = getUpdateTime();
  const updateInfo = `当前项目版本更新于: ${updateTime}`;
  const scriptTag = `<script>console.log(\`%c${updateInfo.trim()}\`,'color: #43bb88;font-size: 14px;');</script>`;

  // 插入到 </body> 之前
  if (htmlContent.includes('</body>')) {
    htmlContent = htmlContent.replace('</body>', `${scriptTag}</body>`);
  } else {
    htmlContent += scriptTag;
  }

  // 写入文件
  fs.writeFileSync(indexPath, htmlContent, 'utf-8');

  console.log('版本信息已添加到 index.html');
  console.log(updateInfo);
}

// 执行
addVersionInfo();
