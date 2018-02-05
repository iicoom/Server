/**
 * Created by wuyanming on 2017/11/6.
 */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

const MsgTplSchema = new Schema({
  name: {
    type: String,
  },
  content: {
    type: Mixed,
    comment: '模版内容',
  },
  type: {
    type: String,
    comment: '模板类型, eg: wx/sys/sms/aliPush',
  },
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

export default mongoose.model('MsgTpl', MsgTplSchema);

