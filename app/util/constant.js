const constant = {};

// 积分
constant.integrali = 10;
constant.DEFAULT_REPEAT = 100;

// 账户明细分页，查询3天内的账户明细
constant.TIME_INTERVAL = 7 * 24 * 3600000;

// 充值方式
constant.rechargeType = {
  CCB: '中国建设银行', // 中国建设银行
  ABC: '中国农业银行', // 中国农业银行
  ICBC: '中国工商银行', // 中国工商银行
  BOC: '中国银行', // 中国银行
  CMBC: '中国民生银行', // 中国民生银行
  CMB: '招商银行', // 招商银行
  CIB: '兴业银行', // 兴业银行
  BOB: '北京银行', // 北京银行
  BCM: '交通银行', // 交通银行
  CEB: '中国光大银行', // 中国光大银行
  AliPay: '支付宝', // 支付宝
  WeiXin: '微信支付', // 微信支付
  UnionPay: '银联支付', // 银联支付
  OfflinePay: '线下支付', // 线下支付
  WeiboPay: '新浪支付', // 新浪支付
};

// 银行类型
constant.BANKS = {
  CCB: '中国建设银行', // 中国建设银行
  ABC: '中国农业银行', // 中国农业银行
  ICBC: '中国工商银行', // 中国工商银行
  BOC: '中国银行', // 中国银行
  CMBC: '中国民生银行', // 中国民生银行
  CMB: '招商银行', // 招商银行
  CIB: '兴业银行', // 兴业银行
  BOB: '北京银行', // 北京银行
  BCM: '交通银行', // 交通银行
  CEB: '中国光大银行', // 中国光大银行
};

// 订单状态
constant.OrderState = {
  NoPay: 1, // 未支付
  Payed: 2, // 已支付/未领取
  Finish: 5, // 已完成
  Cancel: 6, // 已取消
};

// 饲料
constant.items = {
  gancao: 0, // 干草
  gaoyangliao: 1, // 羔羊料
  nongsuoliao: 2, // 浓缩料
  yumi: 3, // 玉米
  caofen: 4, // 草粉
};

constant.RoleType = {
  Administor: 1,
  Feeder: 2,
  User: 3,
};

constant.AccountOperationType = {
  Earning: 0, // 收益
  Buy: 1, // 购买
  Expend: 2, // 提现
  Recharge: 3, // 充值
  Revenues: 4, // 收入
};

// 推送模板消息
constant.PUSH_TPL = {
  ePrKk_RHvlsOjZM5GvRTrxYmPuYOkFn35icdWQqk41g:
        '主人，付款已成功，您的羊群正在赶往羊舍的路上！', // 付款成功
  sTVotwn1KpysVBsAssSwvKw8SZRJVF20rzbY:
        '主人，您的羊群正在办理入住手续，即将开启增肥模式～', // 入栏成功
  '"sTVotwn1KpysVBsAssSwvKw8SZRJVF20rzbY-guIQ8A':
        '主人，您的收益已到账，快去数钱吧！', // 赎回成功
  qS0jFe5k38VU5Bh2cdVmsl_RivlN2CNzerw20iDgQ4k:
        '主人，您的提现申请已成功，请注意查收！', // 提现成功
  'SQ4XINQ_K8zai6XZ1b-c3CtPLbMOIM0x05d6UaKzg1w':
        '主人，兑换券已领取成功，快去咩鲜生商场大采购吧～', // 兑换券发放成功
  Sjjl9fi2fjettCPb3psniaFFYhOs3aqD_OTa03Lk9sc:
        '主人，您有新积分到账，请注意查收！', // 羊角提醒
};


constant.msgSendType = {
  SYS: 'sys',         // 系统消息
  WX: 'wx',           // 微信消息
  SMS: 'sms',         // 短信消息
  ALIPUSH: 'push',     // 阿里推送
};

constant.msgBodyState = {
  await: 1,   // 等待发送
  success: 2, // 发送成功
  retry: 3,   // 重试发送
  failed: 4,   // 发送失败
};


module.exports = constant;
