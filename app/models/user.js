/**
 * Created by mxj on 2017/8/2.
 */


const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userid: { type: String },
  username: { type: String }, // 用户名
  password: { type: String }, // 密码
  salt: { type: String },
  mobile: { type: String },
  verifyCode: String,
  verified: {
    type: Boolean,
    default: false,
  },
  accessToken: String,
  nickname: String,
  gender: String,
  breed: String,
  age: String,
  avatar: String,
  idcard: { type: String }, // 身份证号
  role_type: { type: Number }, // 角色
  platform_role: { type: Object },
  pay_pwd: { type: String }, // 支付密码
  is_bindwx: { type: Boolean }, // 是否绑定微信
  need_upgrade: { // 是否需要强制升级
    type: Boolean,
    default: false,
  },
  is_real_name: { type: Boolean, default: false }, // 是否实名认证
  modify_mobile: { // 是否修改手机号
    type: Boolean,
    default: false,
  },
  unsubscribe: Boolean, // 账户注销
  disabled: { type: Boolean }, // 禁止用户登录
}, {
  timestamps: {
    createdAt: 'create_at',
    updatedAt: 'update_at',
  },
  // toJSON: {
  //   virtuals: true,
  //   transform(doc, ret) {
  //     delete ret.pay_pwd;
  //     delete ret.history;
  //     delete ret.password;
  //     delete ret.wxopenid;
  //     delete ret.salt;
  //     delete ret._id;
  //     delete ret.__v;
  //     delete ret.idcard;
  //     return ret;
  //   },
  // },
});

// 数据存储前的逻辑
// UserSchema.pre('save', function (next) {
//   if (this.isNew) {
//     this.meta.createAt = this.meta.updateAt = Date.now();
//   } else {
//     this.meta.updateAt = Date.now();
//   }
//   next();
// });

UserSchema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) {
    delete ret.pay_pwd;
    delete ret.history;
    delete ret.password;
    delete ret.wxopenid;
    delete ret.salt;
    delete ret._id;
    delete ret.__v;
    delete ret.idcard;
    return ret;
  },
});

UserSchema.virtual('idcard2')
  .get(function () {
    if (this.idcard) {
      if (this.idcard.length === 18) {
        return `${this.idcard.substr(0, 6)}********${this.idcard.substr(14)}`;
      } else if (this.idcard.length === 15) {
        return `${this.idcard.substr(0, 6)}*****${this.idcard.substr(11)}`;
      }
    }
  });

export default mongoose.model('User', UserSchema);
