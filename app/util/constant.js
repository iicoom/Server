const constant = {};

//积分
constant.integrali = 10;
constant.DEFAULT_REPEAT = 100;

//账户明细分页，查询3天内的账户明细
constant.TIME_INTERVAL = 7 * 24 * 3600000;

//标的url
constant.MARK_URL = 'http://m.yunfarm.cn/myfarm/#/login/login/';
//分页
constant.PAGE_SIZE = 30; //每页大小
constant.PAGE_NO = 1; //页号

// 用户标记
constant.USER_FLAG = {
    guest: 'guest',     // 游客(没有微信信息也没有用户信息)
    wxGuest: 'wxGuest', // 微信认证游客（有微信信息没有用户信息）
    normal: 'normal',   // 普通用户
    sinaNormal: 'sinaNormal' // 新浪认证
};

// 充值方式
constant.rechargeType = {
    'CCB': '中国建设银行', // 中国建设银行
    'ABC': '中国农业银行', // 中国农业银行
    'ICBC': '中国工商银行', // 中国工商银行
    'BOC': '中国银行', // 中国银行
    'CMBC': '中国民生银行', // 中国民生银行
    'CMB': '招商银行', // 招商银行
    'CIB': '兴业银行', // 兴业银行
    'BOB': '北京银行', // 北京银行
    'BCM': '交通银行', // 交通银行
    'CEB': '中国光大银行', // 中国光大银行
    'AliPay': '支付宝', // 支付宝
    'WeiXin': '微信支付', // 微信支付
    'UnionPay': '银联支付', // 银联支付
    'OfflinePay': '线下支付', // 线下支付
    'WeiboPay': '新浪支付' // 新浪支付
};

// 交易类型
constant.WeiboPaySubService = {
    SHOPPING: 'SHOPPING', // 购物
    TRANSFER: 'TRANSFER', // 转账
    RECHARGE: 'RECHARGE', // 充值
    WITHDRAW: 'WITHDRAW', // 提现
    YUNFARM_REMITTANCE: 'YUNFARM_REMITTANCE', // 打款到牧场
    YUNFARM_GATHERING: 'YUNFARM_GATHERING', // 云联收款
    FARM_ATONE: 'FARM_ATONE', // 牧场打款
    ATONE: 'ATONE', // 赎回
    SETTLE: 'SETTLE' // 余额结算
};

// 银行类型
constant.BANKS = {
    'CCB': '中国建设银行', // 中国建设银行
    'ABC': '中国农业银行', // 中国农业银行
    'ICBC': '中国工商银行', // 中国工商银行
    'BOC': '中国银行', // 中国银行
    'CMBC': '中国民生银行', // 中国民生银行
    'CMB': '招商银行', // 招商银行
    'CIB': '兴业银行', // 兴业银行
    'BOB': '北京银行', // 北京银行
    'BCM': '交通银行', // 交通银行
    'CEB': '中国光大银行' // 中国光大银行
};

// 银行状态
constant.BANK_STATUS = {
    'use': '1', // 使用
    'delete': '2' // 删除

};

// 新人专场
constant.checkNewUser = {
    'yes': '1',
    'no': '2'
};

//处理中、交易成功、交易关闭（有退款）
constant.BILL_STATE = {
    'PROGRESS': '1', // 处理中
    'SUCCESS': '2', // 交易成功
    'CANCEL': '3' // 交易关闭
};

// 批次打款回款状态
constant.BATCH_PAY_STATE = {
    PROGRESS: 'PROGRESS',
    SUCCESS: 'SUCCESS',
    PARTFAIL: 'PARTFAIL',
    FAIL: 'FAIL'
};

// 提现状态
constant.WITHDRAW_STATE = {
    'PROGRESS': 'PROGRESS',
    'SUCCESS': 'SUCCESS',
    'FAIL': 'FAIL'
};

// 支付方式
constant.PAY_TYPE = {
    'BALANCE': '账户余额',
    'JIFEN': '积分',
    'JIFEN_BALANCE': '积分+账户余额'
};

// 账单类型
constant.BILL_TYPE = {
    'SHOPPING': '1', // 购物
    'TRANSFER': '2', // 转账
    'RECHARGE': '3', // 充值
    'WITHDRAW': '4', // 提现
    'YUNFARM_REMITTANCE': '5', // 打款到牧场
    'YUNFARM_GATHERING': '6', // 云联收款
    'ATONE': '7', // 赎回
    'GIVE': '8', // 赠送
};

// 交易类型
constant.TRANSACTION_TYPE = {
    'B2B': '1', // 云联对牧场、牧场对云联
    'B2C': '2', // 云联对用户
    'C2B': '3' // 用户对云联
};

//验证码类型
constant.VerifyCodeType = {
    Find_Pw: 1,
    Regist: 2,
    Change_Phone: 3,
    Login: 4,
    draw: 5, //支付密码
    pay_pwd: 6, //提现,
    signup: 'signup', // 新注册
    upgrade: 'upgrade', // 升级
    reset_pwd: 'reset_pwd', // 重置密码
    modify_pwd: 'modify_pwd', // 修改密码
    modify_mobile: 'modify_mobile', // 修改手机号
    modify_mobile_next: 'modify_mobile_next' // 修改手机号
};


//补助类型
constant.SubsidyType = {
    Subsidy_Yields: 1, //平台补助
    Meat_Coupons: 2 //肉卷补助

};
// 云之讯短信模板
constant.UCPAAS_TPLS = {
    '4': '3649', // 登录
    '5': '5149', // 提现
    '6': '5150', // 登录
    'signup': '3649', // 新注册
    'upgrade': '17574', // 用户升级
    'reset_pwd': '17468', // 重置密码
    'modify_pwd': '17469', // 修改密码
    'modify_mobile': '17472', // 修改手机号
    'modify_mobile_next': '17472' // 修改手机号
};

// 云通讯短信模板
constant.YUNTONGXUN_TPLS = {
    '4': '12981' // 登录
};

//余额设置类型
constant.AccountSetType = {
    balance: 1, //自动存入余额
    buy: 2, //自动购买
    card: 3 //自动提现
};

//积分类型
constant.integraliType = {
    RecommondedBuy: 1 //被推荐人购买羊只获取积分
};

//积分使用状态
constant.integraliStatus = {
    Enable: 1, //未使用
    Disable: 2 //已使用
};

//积分累积状态
constant.integraliAddStatus = {
    Enable: 1, //启用
    Disable: 2 //禁用
};

//羊只赠送状态
constant.sendStatus = {
    noSend: 1, //未发送
    send: 2 //已发送
};

//羊只接收状态
constant.receiveStatus = {
    noReceive: 1, //未接收
    receive: 2 //已接收

};

// 验证码类型
constant.CaptchaType = {
    SMS: 'SMS', // 短信
    VoiceCode: 'VoiceCode' // 语音
};

//手机信息状态
constant.TelMsgSendStatus_Wait = 1; //等待发送
constant.TelMsgSendStatus_Sended = 2; //已发送

//银行卡状态
constant.cardStatus = {
    nomal: 1,
    delete: 2
};

// 默认分页
constant.DEFAULT_PAGE_SIZE = 10;

//订单状态
constant.OrderState = {
    NoPay: 1, //未支付
    Payed: 2, //已支付/未领取
    Finish: 5, //已完成
    Cancel: 6 //已取消
};

//订单类型
constant.OrderType = {
    Normal: 1, //正常订单
    Presented: 2, //赠送订单
    Repurchase: 3, //回购订单
    NormalPresented: 4 //正常
};

//订单状态
// constant.payType = {
//     AliPay:1,//支付宝支付
//     SelfPay:2,//线下支付
//     UnionPay:3,//银联支付
//     WxPay:4//微信支付
// }


//饲料
constant.items = {
    gancao: 0, //干草
    gaoyangliao: 1, //羔羊料
    nongsuoliao: 2, //浓缩料
    yumi: 3, //玉米
    caofen: 4 //草粉
};

constant.RoleType = {
    Administor: 1,
    Feeder: 2,
    User: 3
};

constant.AccountOperationType = {
    Earning: 0, //收益
    Buy: 1, //购买
    Expend: 2, //提现
    Recharge: 3, //充值
    Revenues: 4 //收入
};

//羊只种类
constant.sheepClass = {
    shangyeyang: 1,
    zhongyang: 2,
    zaiyang: 3
};

//羊只品种
constant.sheepVarieties = {
    Xiaowei: 1,
    Boer: 2
};

//羊只性别
constant.sheepGender = {
    man: 1,
    woman: 2
};

//羊只是否怀孕
constant.sheepPreg = {
    yes_preg: true,
    no_preg: false
};

//羊只的状态
constant.sheepStatus = {
    grow: 1, //羊只饲养
    butcher: 2, //羊只屠宰
    sell: 3, //羊只出售
    noDistributed: 4 //未分配
};

//羊群的状态
constant.flockStatus = {
    grow: 1, //羊群只饲养
    butcher: 2, //羊群只屠宰
    sell: 3, //羊群只出售
    finish: 4 //管理员已将收益打给牧场主
};

//羊的成长记录类型
constant.sheepRecordType = {
    entry: 1, //进场
    feed: 2, //饲料打卡
    immune: 3, //免疫打卡
    worm: 4, //除虫打卡
    disinfect: 5, //消毒打卡
    medicated: 6, //药浴打卡
    slaughter: 7, //屠宰
    sell: 8, //出售
    exchange: 9, //交换拥有人
    noReceive: 10, //未接受赠送羊
    receive: 11 //接受赠送羊
};

//饲养类型
constant.FeedingType = {
    Forage: 1, //饲料
    Worm: 2, //除虫
    Cropping: 3, //剪毛
    Disinfection: 4, //消毒
    Medicated: 5, //药浴
    Vaccinum: 6, //疫苗
    butcher: 7 //屠宰
};
constant.COUPON_GROUP = {
    LIST: '/coupon_group/coupons/users/:mid'// 获取用户优惠券列表
};


// 推送模板消息
constant.PUSH_TPL = {
    'ePrKk_RHvlsOjZM5GvRTrxYmPuYOkFn35icdWQqk41g':
        '主人，付款已成功，您的羊群正在赶往羊舍的路上！', // 付款成功
    'sTVotwn1KpysVBsAssSwvKw8SZRJVF20rzbY':
        '主人，您的羊群正在办理入住手续，即将开启增肥模式～', // 入栏成功
    '"sTVotwn1KpysVBsAssSwvKw8SZRJVF20rzbY-guIQ8A':
        '主人，您的收益已到账，快去数钱吧！', // 赎回成功
    'qS0jFe5k38VU5Bh2cdVmsl_RivlN2CNzerw20iDgQ4k':
        '主人，您的提现申请已成功，请注意查收！', // 提现成功
    'SQ4XINQ_K8zai6XZ1b-c3CtPLbMOIM0x05d6UaKzg1w':
        '主人，兑换券已领取成功，快去咩鲜生商场大采购吧～', // 兑换券发放成功
    'Sjjl9fi2fjettCPb3psniaFFYhOs3aqD_OTa03Lk9sc':
        '主人，您有新积分到账，请注意查收！' // 羊角提醒
};

constant.companyRoleType = {
    admin: 1,   //管理者
    owner: 2,   //
    worker: 3   //工作人员
};

constant.msgSendType = {
    SYS: 'sys',         //系统消息
    WX: 'wx',           //微信消息
    SMS: 'sms',         //短信消息
    ALIPUSH: 'push'     //阿里推送
};

constant.msgBodyState = {
    await: 1,   //等待发送
    success: 2, //发送成功
    retry: 3,   //重试发送
    failed: 4   //发送失败
};

constant.platforms = {
    yunFarm: 'yunfarm', //牧场管理平台
    farm: 'farm',    //养殖场
    camera: 'camera',  //摄像头管理平台
    message: 'message' //消息管理平台
};

module.exports = constant;
