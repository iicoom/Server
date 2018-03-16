const mongoose = require('mongoose');
const orderStat = require('../util/constant').OrderState;

// 订单表
const OrderSchema = new mongoose.Schema({
  order_code: {
    type: String,
    unique: true,
  }, // 订单号
  sheep_num: Number, // 购买羊只数量
  user_id: String, // 用户id 购买者
  merchant_id: String, // 商户ID
  type: Number, // 订单类型 1：普通订单 2：赠送订单 3：回购订单
  amount: Number, // 金额
  from: String, // 来自订单（延续订单使用）
  good_ids: Array, // 商品Id
  state: {
    type: Number,
    default: orderStat.NoPay,
  }, // 订单状态1：未支付 2：已支付/未领取 5：已完成 6：已取消
  cancel_reason: String, // 取消原因描述
  pay_infos: Array, // 支付信息
  paymendMethod: Object, // 支付方式
  batch_id: String, // 购买期数记录_id
  create_time: Number, // 创建时间
  finish_time: Number, // 完成时间
  pay_time: Number, // 支付完成时间
  update_time: Number, // 最后更新时间
  other_info: Object, // 订单其他信息（赠送订单：接收人电话，接收人姓名）
  receive_state: {
    type: Boolean,
    default: false,
  }, // 赠送订单接收状态
  repurchase_state: String, // 回购订单还款状态
  original_order: String,
  original_amount: Number,
  meatloaf_send_state: String, // 肉卷发送状态  1 是发送，没有就是未发送
  send_meatloaf_time: Number, // 发送肉卷时间
  coupon_card_send_state: String, // 优惠券发送状态  1 是发送，没有就是未发送
  coupon_card_send_time: Number, // 发送优惠券时间

  is_hide: { type: Boolean, default: false }, // 是否隐藏
});


OrderSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Order', OrderSchema);

