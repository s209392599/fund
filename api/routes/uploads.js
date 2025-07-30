// 上传文件
const express = require('express');
const router = express.Router();
const multer = require('multer');

// 设置存储配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 上传文件存储的路径
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf8'
    );
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// 初始化上传
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), function (req, res) {
  const file = req.file;
  if (!file) {
    return res.status(400).send('Please upload a file.');
  }
  res.send('File uploaded successfully.');
});

module.exports = router;
