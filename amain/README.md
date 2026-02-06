# 纯html中引入vue3

```html
<link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css">
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/element-plus"></script>
<script src="https://unpkg.com/@element-plus/icons-vue"></script>
```

指定具体的版本 2025年08月26日11:16:29

```html
<link rel="stylesheet" href="https://unpkg.com/element-plus@2.11.1/dist/index.css">
<script src="https://unpkg.com/vue@3.5.20/dist/vue.global.js"></script>
<script src="https://unpkg.com/element-plus@2.11.1/dist/index.full.js"></script>
<script src="https://unpkg.com/@element-plus/icons-vue@2.3.2/dist/index.iife.min.js"></script>
```


ssh root@150.158.175.108
qaz123.. 或者 Qaz123.. 密码

cd /www/wwwroot/fund_api/routes/fund
rm -rf *
exit
sudo chmod -R 755 /www/wwwroot/fund_api/routes/fund

scp -r /Users/guokun/github/fund/api/routes/fund/* root@150.158.175.108:/www/wwwroot/fund_api/routes/fund/

cd /www/wwwroot/fund_api/static/fund_amain
scp -r /Users/guokun/github/fund/amain/dist/* root@150.158.175.108:/www/wwwroot/fund_api/static/fund_amain
