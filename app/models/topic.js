const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  type: { type: Number, default: 0 }, // 话题类型 0八卦/1新闻/2游戏/3宠物
  topic_creator: { type: String }, // 话题建立者
  content: { type: String }, // 内容
  read: { type: Boolean, default: false }, // 阅读状态0：未读1:已读
  replied_num: { type: Number, default: 0 }, // 回复数
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

export default mongoose.model('Topic', TopicSchema);
