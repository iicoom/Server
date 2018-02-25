const mongoose = require('mongoose');

const { Schema } = mongoose;

// 公告
const announcement = new Schema({
  title: { type: String, comment: '标题' },
  type: { type: String, comment: '类型' },
  start_time: { type: Date, comment: '开始时间' },
  end_time: { type: Date, comment: '结束时间' },
  full_content: { type: String, comment: '公告内容' },
  abstract: { type: String, comment: '摘要内容' },
  link_name: { type: String, comment: '链接名称' },
  link_addr: { type: String, comment: '链接地址' },
  link_is_show: { type: Boolean, comment: '链接是否显示' },
  state: { type: String, comment: '状态' },
  create_time: { type: Number, comment: '创建时间' },
  update_time: { type: Number, comment: '最后更新时间' },
  version: { type: Number, comment: '公告version' },
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

export default mongoose.model('Announcement', announcement);
