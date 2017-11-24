/**
 * Created by wuyanming on 2017/11/6.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

const MsgLinkSchema = new Schema({
    code: {
        type: String,
        unique: true,
        comment: '系统配置唯一标识 eg: finish_msg'
    },
    name: {
        type: String,
        comment: 'link的名称'
    },
    msg_tpl: [{ type: Schema.Types.ObjectId, ref: 'MsgTpl',comment:'关联的模板ID' }],
    type: {
        type: Number,
        comment: '系统图标 eg: 0-6'
    },
}, {
    timestamps: {
        createdAt: 'create_at',
        updatedAt: 'update_at',
    },
    toJSON: {
        virtuals: true,//控制返回的虚拟字段 id
        transform(doc, ret) {
            delete ret.__v;
            delete ret._id;
            return ret;
        }
    }
});

export default mongoose.model('MsgLink', MsgLinkSchema);

