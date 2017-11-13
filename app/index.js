/**
 * Created by mxj on 2017/8/2.
 */
'use strict';
const fs = require('fs');
const path = require('path');
// const mongoose = require('mongoose');
// const db = 'mongodb://localhost/koa-app';

// mongoose.Promise = require('bluebird');
// mongoose.connect(db);

//引入数据库models目录
const models_path = path.join(__dirname,'/app/models');

const Koa = require('koa');
const logger = require('koa-logger');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

app.keys = ['some secret hurr'];
app.use(logger());
app.use(session(app));
app.use(bodyParser());

//遍历目录文件的方法
// let walk = function (modelPath) {
//     fs
//         .readdirSync(modelPath)
//         .forEach(function(file){
//             let filePath = path.join(modelPath,'/' + file);
//             let stat = fs.statSync(filePath);

//             if(stat.isFile()){
//                 if(/(.*)\.(js|coffee)/.test(file)){
//                     require(filePath)
//                 }
//             }
//             else if (stat.isDirectory()){
//                 walk(filePath)
//             }
//         })
// };

// walk(models_path);//把models目录下的文件都require进来做初始化操作
// const UserModel = require('./app/models/user');


//引入路由文件
//const router = require('./config/routes')();


// app
//     .use(router.routes())
//     .use(router.allowedMethods());
app.use(ctx => {
    ctx.status = 404;
    ctx.body = { message: 'not found' };
});


process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
    // application specific logging, throwing an error, or other logic here
});

export default app;

