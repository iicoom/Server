export const MsgTpl = {
  RegistSuc: '妈卖批，欢迎您来到牧场，牧场还没有羊呢，快去购买吧！',
  OrderSuc: '妈卖批，订单已提交成功，等待您的付款~',
  SheepEnterSuc: '妈卖批，您的gogo已经办理完入住手续',
  PigEnterSuc: '妈卖批，您的种猪已经进入配种舍，开始繁育小猪仔啦~',
  FeedSign: '妈卖批，您的gogo已更换了饲料~',
  DisinfectSign: '妈卖批，您的gogo已进行过消毒~',
  ImmuneSign: '妈卖批，您的gogo已进行过免疫~',
  MedicatedSign: '妈卖批，您的gogo已进行过药浴~',
  WormSign: '妈卖批，您的gogo已进行过除虫~',
  SellSign: '妈卖批，您的gogo已出售，钱包君呼唤您快去数钱！',
  EarningNotify: '妈卖批，您的钱包有新收益了，快去看看钱包君吧！',
  TransferSuc(batchaname, principal, earnings, yieldRate) {
    return `妈卖批，${batchaname}收益已到账，快去数钱吧！内含本金${(+principal).toFixed(2)}元，收益${(+earnings).toFixed(2)}元，本次投资年化收益率${(yieldRate * 100).toFixed(2)}％，打赢了市场上88％的投资产品`;
  },
  gathering: '妈卖批，付款已成功，您的gogo正在赶来的路上！',
  PaySheepSuc: '妈卖批，付款已成功，您的gogo正在赶来的路上！',
  PayPigSuc: '妈卖批，付款已成功，您的种猪正在办理认养手续，请耐心等待！',
};
