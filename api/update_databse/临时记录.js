/*
var zhang_zhou = '';// 周涨幅
var zhang_yue_1 = '';// 月涨幅
var zhang_yue_3 = '';// 3月涨幅
var zhang_yue_6 = '';// 6月涨幅
var zhang_nian_1 = '';// 1年涨幅
var zhang_nian_3 = '';// 3年涨幅
// var zhang_nian_5 = '';// 5年涨幅
var zhang_jin_nian = '';// 今年以来
var zhang_cheng_li = '';// 成立以来

var tong_zhou = '';// 同类-周排名
var tong_yue_1 = '';// 同类-月排名
var tong_yue_3 = '';// 同类-3月排名
var tong_yue_6 = '';// 同类-6月排名
var tong_nian_1 = '';// 同类-1年排名
var tong_nian_3 = '';// 同类-3年排名
// var tong_nian_5 = '';// 同类-5年排名
var tong_jin_nian = '';// 同类-今年以来
var tong_cheng_li = '';// 同类-成立以来

var rank_zhou = '';// 周排名
var rank_yue_1 = '';// 月排名
var rank_yue_3 = '';// 3月排名
var rank_yue_6 = '';// 6月排名
var rank_nian_1 = '';// 1年排名
var rank_nian_3 = '';// 3年排名
// var rank_nian_5 = '';// 5年排名
var rank_jin_nian = '';// 今年以来
var rank_cheng_li = '';// 成立以来


historyPerformanceList.forEach((item,index) => {
    if(item.name === '近1周'){
        zhang_zhou = item.rate || '';
        tong_zhou = item.avg || '';
        rank_zhou = item.rank_zhou || '';
    }else if(item.name === '近1月'){
        zhang_yue_1 = item.rate || '';
        tong_yue_1 = item.avg || '';
        rank_yue_1 = item.rank_zhou || '';
    }else if(item.name === '近3月'){
        zhang_yue_3 = item.rate || '';
        tong_yue_3 = item.avg || '';
        rank_yue_3 = item.rank_zhou || '';
    }else if(item.name === '近6月'){
        zhang_yue_6 = item.rate || '';
        tong_yue_6 = item.avg || '';
        rank_yue_6 = item.rank_zhou || '';
    }else if(item.name === '近1年'){
        zhang_nian_1 = item.rate || '';
        tong_nian_1 = item.avg || '';
        rank_nian_1 = item.rank_zhou || '';
    }else if(item.name === '今年以来'){
        zhang_jin_nian = item.rate || '';
        tong_jin_nian = item.avg || '';
        rank_jin_nian = item.rank_zhou || '';
    }else if(item.name === '近3年'){
        zhang_nian_3 = item.rate || '';
        tong_nian_3 = item.avg || '';
        rank_nian_3 = item.rank_zhou || '';
    }else if(item.name === '成立以来'){
        zhang_cheng_li = item.rate || '';
        tong_cheng_li = item.avg || '';
        rank_cheng_li = item.rank_zhou || '';
    }
})


*/