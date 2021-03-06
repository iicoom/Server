/**
 * Created by mxj on 2017/8/2.
 */


const mongoose = require('mongoose');

const User = mongoose.model('User');
const convert = require('koa-convert');

exports.signature = convert(function *(next) {
  this.body = {
    success: true,
  };
});

exports.hasBody = convert(function *(next) {
  const body = this.request.body || {};

  if (Object.keys(body).length === 0) {
    this.body = {
      success: false,
      err: '是不是漏掉什么了',
    };

    return next;
  }
  return next;
});

exports.hasToken = convert(function *(next) {
  let accessToken = this.query.accessToken;

  if (!accessToken) {
    accessToken = this.request.body.accessToken;
  }

  if (!accessToken) {
    this.body = {
      success: false,
      message: '未找到accessToken',
    };

    return next;
  }

  const user = yield User.findOne({
    accessToken,
  });

  if (!user) {
    this.body = {
      success: false,
      err: '用户没登陆',
    };

    return next;
  }

  this.session = this.session || {};
  this.session.user = user;

  yield next;

});
