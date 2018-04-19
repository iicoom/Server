const mongoose = require('mongoose');

const MsgSchema = new mongoose.Schema({
  type: { type: Number, default: 10 }, // 消息类型 0注册/1订单
  from_user: { type: String }, // 发信者
  to_user: { type: String }, // 收信者
  content: { type: String }, // 内容
  read: { type: Boolean, default: false }, // 阅读状态0：未读1:已读
  other_info: { type: Object }, // 其他信息
}, {
  timestamps: {
    createdAt: 'create_time',
    updatedAt: 'update_at',
  },
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      delete ret.__v;
      delete ret._id;
      return ret;
    },
  },
});

export default mongoose.model('Message', MsgSchema);
