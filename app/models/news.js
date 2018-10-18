const mongoose = require('mongoose');

const { Schema } = mongoose;

// 资讯
const  news = new Schema({
  title: { type: String, comment: '标题' },
  type: { type: String, comment: '类型' },
  abstract: { type: String, comment: '摘要内容' },
  content: { type: String, comment: '资讯内容' },
  link: { type: String, comment: '链接地址' },
  image_url: { type: String, coment: '图片地址' },
  state: { type: String, comment: '状态' },
  version: { type: Number, comment: '资讯version' },
}, {
  timestamps: {
    createdAt: 'create_at',
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

export default mongoose.model('News', news);
