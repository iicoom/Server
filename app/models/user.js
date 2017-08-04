/**
 * Created by mxj on 2017/8/2.
 */
'use strict';

const mongoose = require('mongoose');

let UserShema = new mongoose.Schema({
    phoneNumber:{
        unique: true,
        type: String
    },
    areaCode: String,
    verifyCode: String,
    verified: {
        type: Boolean,
        default: false
    },
    accessToken: String,
    nickname: String,
    gender: String,
    breed: String,
    age: String,
    avatar: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

//数据存储前的逻辑
UserShema.pre('save',function (next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else{
        this.meta.updateAt = Date.now();
    }

    next()
});

// 第一个参数 数据库中集合的名字；第二个参数 上边做的一坨东西
let UserModel = mongoose.model('User',UserShema);

module.exports = UserModel;
