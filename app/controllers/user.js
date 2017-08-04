/**
 * Created by mxj on 2017/8/2.
 */
'use strict';

const xss = require('xss');
const mongoose = require('mongoose');
const User = mongoose.model('User'); //在入口文件app中加载了控制器user，在这里可以拿到，进而去操作数据库
const uuid = require('uuid');
const sms = require('../service/sms');
const convert = require('koa-convert');


/*用户注册 API*/ /*提交了手机号，获取验证码*/
exports.signup = async (ctx)=> {
    //let phoneNumber = ctx.query.phoneNumber;//这里曾测试get请求
    let phoneNumber = xss(ctx.request.body.phoneNumber.trim());//这里接收的是post请求
    let verifyCode = ctx.request.body.verifyCode;
    //let verifyCode = '6982';
    console.log(phoneNumber);


    async function validate (ctx) {

        let doc = await User.findOne({'phoneNumber':phoneNumber});

        let _status;
        if (!doc) {
            let verifyCode = sms.getCode(); //生成4位验证码
            let accessToken = uuid.v4();    //生成4段的uuid :"accessToken" : "ca0e88be-f94d-46c8-a5cd-f57115ba2a96"

            let user = new User({
                nickname: '亲～',
                phoneNumber: phoneNumber,
                verifyCode: verifyCode,
                accessToken: accessToken
            });

            try {
                user.save(function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('验证码已发送，注意查收')
                    }
                })
            } catch (e) {
                // ctx.body = {
                //     success: false
                // }拿不到ctx.body
                _status = {
                    success: false,
                    err: '短信服务异常'
                }
            }
            // 给手机发送验证码
            let msg = '您的注册验证码是：' + verifyCode;

            try {
                sms.send(phoneNumber, msg)
            }catch (e){
                console.log(e);

                _status = {
                    success: false,
                    err: '短信服务异常'
                }
            }


        }
        else if (doc.phoneNumber && !doc.verifyCode) {
            _status = {
                success: false,
                message: '嘿嘿，这个手机号已经被注册了！'
            }
        }
        else if (doc.phoneNumber && doc.verifyCode === verifyCode) {
            _status = {
                success: true,
                message: '恭喜您，注册成功！'
            }
        }

        return _status;

    }

    let status = await validate(ctx);
    console.log(status);

    ctx.body = status;

};



/*用户信息验证 API*/
exports.verify = convert(function *(next) {
    var verifyCode = this.request.body.verifyCode;
    var phoneNumber = this.request.body.phoneNumber;

    if (!verifyCode || !phoneNumber){
        this.body = {
            success: false,
            message: '账户信息验证失败'
        };

        return next;
    }

    let doc = yield User.findOne({
        phoneNumber: phoneNumber,
        verifyCode: verifyCode
    });

    if (doc){
        doc.verified = true;
        doc = yield doc.save();

        this.body = {
            success: true,
            data: {
                nickname: doc.nickname,
                accessToken: doc.accessToken,
                _id: doc._id
            }
        }
    }
    else{
        this.body = {
            success: false,
            message: '账户信息验证失败'
        }
    }

});


/*用户信息更新 API*/
exports.update = convert(function *(next) {
    var body = this.request.body;
    var user = this.session.user;
    var fields = 'avatar,gender,age,nickname,breed'.split(',');

    fields.forEach(function (field) {
        if(body[field]){
            user[field] = xss(body[field].trim())
        }
    });

    user = yield user.save();

    this.body = {
        success: true,
        data: {
            nickname: user.nickname,
            accessToken: user.accessToken,
            avatar: user.avatar,
            age: user.age,
            breed: user.breed,
            gender: user.gender,
            _id: user._id
        }
    }
});

