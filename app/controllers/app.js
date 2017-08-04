/**
 * Created by mxj on 2017/8/2.
 */
'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');
const convert = require('koa-convert');

exports.signature = convert(function *(next) {
    this.body = {
        success: true
    }
});

exports.hasBody = convert(function *(next) {
    var body = this.request.body || {};

    if(Object.keys(body).length === 0){
        this.body = {
            success: false,
            err: '是不是漏掉什么了'
        };

        return next
    }
    yield next      //之前把这里搞成return就错了
});

exports.hasToken = convert(function *(next) {
    var accessToken = this.query.accessToken;

    if (!accessToken) {
        accessToken = this.request.body.accessToken
    }

    if (!accessToken){
        this.body = {
            success: false,
            message: '未找到accessToken'
        };

        return next
    }

    var user = yield User.findOne({
        accessToken: accessToken
    });

    if(!user){
        this.body = {
            success: false,
            err: '用户没登陆'
        };

        return next
    }

    this.session = this.session || {};
    this.session.user = user;

    yield next

});