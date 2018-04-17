const mongoose = require('mongoose');

const UserHistorySchema = new mongoose.Schema({
  uid: { type: String }, // userid
  favorites: { type: Array }, // 收藏
  followed: { type: Array }, // 关注的人
  follower: { type: Array }, // 粉丝
  replies: { type: Array }, // 回复过的topic id
  reply_num: { type: Number, default: 0 }, // 回复数
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

export default mongoose.model('UserHistory', UserHistorySchema);
