module.exports = {
  // 已买(符合购买标准的前15名)
  yimai: [
    { number: '006961', name: '南方中债7-10' },
    { number: '006549', name: '国金惠盈纯债A' },
    { number: '006980', name: '国寿安保(限500)' },

    { number: '006760', name: '国金惠盈C(30)' },
    { number: '009604', name: '国金惠盈(7-1000)' },
    { number: '007214', name: '国泰惠丰(30天)' },
    { number: '000116', name: '嘉实丰益(1)' },
    { number: '007540', name: '华泰保兴安A' },
    { number: '008799', name: '国金惠安利C' },
    { number: '016658', name: '兴华安裕' },
    { number: '007492', name: '上银政策性' },
    { number: '000606', name: '天弘优选债券A' },
    { number: '016604', name: '国泰嘉睿纯债债券C' },
  ],

  // 观察列表(过往买过的，或者表现下降或者快上升能购买的)
  guancha: [
    { number: '400030', name: '东方添益(随时)' },
    { number: '003547', name: '鹏华丰禄(限100)' },
    { number: '519762', name: '交银裕通' },
    { number: '006475', name: '国泰嘉睿纯债债券A' }, // 016604 重复
    { number: '017593', name: '汇添富添C' },
    { number: '010353', name: '南方崇元A' },
    { number: '006061', name: '红土创新增强收益债券A' },
  ],

  // 放弃的基金
  fangqi: [
    {
      productCode: '002569',
      productName: '博时裕弘纯债债券A',
      remarks: '8.03 京东金融不卖 2024年11月18日13:06:28',
    },
    {
      number: '485019',
      name: '工银信用(稳)',
      remarks: '已经有同类的了 2024年04月21日16:24:15',
    },
    {
      number: '005637',
      name: '国联聚业(3月)',
      remarks: '只能机构购买',
    },
    {
      number: '005070',
      name: '长江乐丰(3)',
    },
    {
      number: '006716',
      name: '东方永泰(1)(5.23)',
    },
    {
      number: '007925',
      name: '平安鑫享混合E',
    },
    {
      number: '002988',
      name: '平安鼎信(30天)',
    },
    {
      number: '007235',
      name: '广发聚利(30天)',
    },
    {
      number: '008728',
      name: '同泰恒利(30天)',
    },
    {
      number: '011376',
      name: '华宝安享混合',
    },
    {
      number: '014767',
      name: '景顺长城华城稳健6月持有混合A',
    },
    {
      number: '006549',
      name: '国金惠盈纯债A(30)',
    },
  ],
};

/*
var arr =[
    { "number": "007677", "name": "蜂巢添汇(7天)", "remarks": "10.60", "notice": "", skuId: '1007677', status: '1' },
    { "number": "400030", "name": "东方添益(随时)", "remarks": "6.62;入8;730", "notice": "", skuId: '106545', status: '2' },
    { "number": "485119", "name": "工银信用(稳)", "remarks": "5.96;入8;730", "notice": "", skuId: '107337', status: '2' },
    { "number": "006980", "name": "国寿安保(限500)", "remarks": "6.98;入8;30", "notice": "", skuId: '114237', status: '2' },
    { "number": "003547", "name": "鹏华丰禄(限100)", "remarks": "5.46;入8;365", "notice": "", skuId: '110067', status: '2' },
];localStorage.setItem("info",JSON.stringify(arr));window.location.reload();
*/
