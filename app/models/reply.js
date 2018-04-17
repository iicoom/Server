const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  topic_id: { type: String },
  type: { type: Number, default: 0 }, // 话题类型 0八卦/1新闻/2游戏/3宠物
  reply_creator: { type: String }, // 回复建立者
  reply_to: { type: String }, // 被回复者
  content: { type: String }, // 内容
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

export default mongoose.model('Reply', ReplySchema);
