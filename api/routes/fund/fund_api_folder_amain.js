const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const iconv = require("iconv-lite");// 处理文件名编码

// 深度删除文件或文件夹的nodejs公共方法，只需要批量传入文件或者文件夹的路径
function deleteFile(filePath) {
  let files = [];
  if (fs.existsSync(filePath)) {
    files = fs.readdirSync(filePath);
    files.forEach((file, index) => {
      let curPath = path.join(filePath, file);
      if (fs.statSync(curPath).isDirectory()) {
        deleteFile(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(filePath);
  }
}

function decodeFileName(name) {
  if (!name) {
    return name;
  }
  try {
    const buf = Buffer.from(name, 'binary');
    return iconv.decode(buf, 'utf8');
  } catch (e) {
    return name;
  }
}


// 自定义存储配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 从字段名中提取路径信息
    const fieldName = file.fieldname;

    if (fieldName.startsWith('files[') && fieldName.endsWith(']')) {
      // 提取路径：files[dist/a/ss/a.html] -> dist/a/ss/a.html
      const fullPath = fieldName.substring(6, fieldName.length - 1);
      const dirPath = path.dirname(fullPath);

      const fullDirPath = path.join(__dirname, '../../', 'static', 'fund_manager', dirPath);
      // const fullDirPath = path.join(__dirname, 'uploads', dirPath);
//
      // 创建所有需要的文件夹
      if (!fs.existsSync(fullDirPath)) {
        fs.mkdirSync(fullDirPath, { recursive: true });
      }

      cb(null, fullDirPath);
    } else {
      // cb(null, path.join(__dirname, 'uploads'));
      cb(null, path.join(__dirname, '../../', 'static', 'fund_manager'));
    }
  },
  filename: function (req, file, cb) {
    const fieldName = file.fieldname;

    if (fieldName.startsWith('files[') && fieldName.endsWith(']')) {
      const fullPath = fieldName.substring(6, fieldName.length - 1);
      const fileName = decodeFileName(path.basename(fullPath));
      cb(null, fileName);
    } else {
      cb(null, decodeFileName(file.originalname));
    }
  }
});

const upload = multer({ storage: storage });

// 处理任意字段名的文件
router.post('/fund_apifolder_fundmanager2222',
  upload.any(), // 处理所有字段
  (req, res) => {
    // 设置超时机制
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('文件上传操作超时'));
      }, 30000); // 30秒超时
    });

    const uploadPromise = new Promise((resolve, reject) => {
      try {
        const managePath = path.join(__dirname, '../../', 'static', 'fund_manager');

        // 清空目录但不删除根目录
        if (fs.existsSync(managePath)) {
          const files = fs.readdirSync(managePath);
          for (const file of files) {
            const filePath = path.join(managePath, file);
            if (fs.statSync(filePath).isDirectory()) {
              deleteFile(filePath); // 删除子目录
            } else {
              fs.unlinkSync(filePath); // 删除文件
            }
          }
        } else {
          fs.mkdirSync(managePath, { recursive: true }); // 创建目录
        }

        const files = req.files || [];
        const fileArr = files.map(file => ({
          originalName: decodeFileName(file.originalname),
          savedPath: file.path,
          size: file.size
        }));

        console.log('上传的文件：');
        files.forEach(file => {
          console.log(`  ${decodeFileName(file.originalname)} -> ${file.path}`);
        });

        resolve({ success: true, files: fileArr });
      } catch (error) {
        reject(error);
      }
    });

    Promise.race([uploadPromise, timeoutPromise])
      .then(result => {
        res.json(result);
      })
      .catch(error => {
        console.error('文件上传错误:', error.message);
        res.status(500).json({ success: false, error: error.message });
      });
  }
);


// 处理任意字段名的文件
router.post('/fund_apifolder_fundmanager',
  (req, res, next) => {
    try {
      const managePath = path.join(__dirname, '../../', 'static', 'fund_manager');
      // 清空目录
      if (fs.existsSync(managePath)) {
        const files = fs.readdirSync(managePath);
        files.forEach(file => {
          const filePath = path.join(managePath, file);
          if (fs.statSync(filePath).isDirectory()) {
            deleteFile(filePath);
          } else {
            fs.unlinkSync(filePath);
          }
        });
      } else {
        fs.mkdirSync(managePath, { recursive: true });
      }
      next();
    } catch (error) {
      console.error('清理目录错误:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
  upload.any(), // 处理所有字段
  (req, res) => {
    try {
      const files = req.files || [];
      const fileArr = files.map(file => ({
        originalName: decodeFileName(file.originalname),
        savedPath: file.path,
        size: file.size
      }));

      console.log('上传的文件：');
      files.forEach(file => {
        console.log(`  ${decodeFileName(file.originalname)} -> ${file.path}`);
      });

      res.json({ success: true, files: fileArr });
    } catch (error) {
      console.error('文件上传处理错误:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

module.exports = router;
