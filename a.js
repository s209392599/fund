/*
产品详情
https://lc.jr.jd.com/finance/fund/latestdetail/index/?fundCode=400030&fundUtmSource=340&fundUtmParam=AppShare&utm_term=wxfriends&utm_source=iOS_url_1712791482459&utm_medium=jrappshare

getFundDetailPageInfo



上面的产品详情点击交易规则：
https://lc.jr.jd.com/finance/fund/latestdetail/buySellInfo/?activeIndex=0&fundCode=400030&createOrdermaket=&fundUtmSource=340&fundUtmParam=AppShare&fromJumpType=&fromJumpUrl=
https://ms.jr.jd.com/gw/generic/jj/h5/m/getFundTradeRulesPageInfo?reqData={"fundCode":"400030","orderLimit":"","channel":"9"}





name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.BOXUE_FUND }}
          publish_dir: ./dist
          publish_branch: gh-pages
         clean: true
*/
