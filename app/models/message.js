const mongoose = require('mongoose');

const MsgSchema = new mongoose.Schema({
  type: { type: Number, default: 0 }, // 消息类型 0系统消息/1订单/2礼盒/3升级/4云币/5优惠券/6经验
  from_user: { type: String }, // 发信着
  to_user: { type: String }, // 收信者
  create_time: { type: Number }, // 创建时间
  content: { type: String }, // 内容
  read: { type: Boolean }, // 阅读状态0：未读1:已读
  other_info: { type: Object }, // 其他信息
});

export default mongoose.model('Message', MsgSchema);
