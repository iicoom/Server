/**
 * 账户
 * Created by tyk on 2015/3/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Account = new Schema({
  uid: {type: String}, // 用户ID
  balance: {type: Number/*, min: 0*/}, // 余额
  income: {type: Number, min: 0}, // 收益
  last_update_bill: {type: String}, // 上次更新涉及账单
  create_at: {type: Number, default: Date.now},
  update_at: {type: Number}
});

Account.statics.findAccountByID = function (accountId, cb) {
  return this.findById(accountId, cb);
}

Account.statics.findAccountByUID = function (uid, cb) {
  return this.findOne({ uid: uid }, cb);
}

// 序列化结果
Account.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

Account.virtual('id')
    .get(function () {
      if (typeof this._id == 'object')
        return this._id.toHexString();
      return this._id
    });

export default mongoose.model('Account', Account);