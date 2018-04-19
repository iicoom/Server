/**
 * Created by wuyanming on 2017/11/6.
 */
// 系统数据
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Mixed } = Schema.Types;

const MsgBodySchema = new Schema({
  link_code: {
    type: String,
    required: true,
    comment: 'msg_link_code',
  },
  content: {
    type: Mixed,
    comment: '要发放的数据',
  },
  state: {
    type: Number,
    comment: '发放状态 1 待发放， 2 已发放 3 发放中',
    default: 1,
  },
  remark: {
    type: Mixed,
    required: false,
    comment: '备注 用于记录发送失败的信息',
  },
  send_to: {
    type: Array,
    required: false,
    comment: '消息发送的对象',
  },
  // send_to: [
  //     {
  //         type: Schema.Types.ObjectId,
  //         comment: '消息发送的对象'
  //     }],
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

export default mongoose.model('MsgBody', MsgBodySchema);
