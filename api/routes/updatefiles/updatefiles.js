const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const CustomFn = require('../../CustomFn.js');

// 深度删除文件或文件夹的nodejs公共方法，只需要批量传入文件或者文件夹的路径
function deleteFile(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFile(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

// 登录
router.post('/status_delete', async (req, res) => {
  // 接收文件或者文件夹名称或者路径，然后删除static文件夹下的文件或者文件夹
  const { file_name = '' } = req.body;
  if (!file_name) {
    return res.send({
      code: 400,
      msg: '请检查输入',
      data: [],
    });
  }
  CustomFn.deleteFile(path.join(__dirname, `../../static/${file_name}`));
  return res.send({
    code: 200,
    msg: '删除成功',
    data: [],
  });
})

// 上传基金后台的项目打包后的文件
router.post('/status_upload_fundmanger', async (req, res) => {
  

});

module.exports = router;
