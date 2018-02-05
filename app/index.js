/**
 * Created by mxj on 2017/8/2.
 */


import Koa from 'koa';
import koaValidate from 'koa-validate';
import locale from 'koa-locale';
import i18n from 'koa-i18n';
import api from './api';
import middleware from './middleware';

const app = new Koa();

locale(app);
app.use(i18n(app, {
  directory: './config/locales',
  locales: ['zh-CN', 'en'],
  modes: [
    'query',
    'subdomain',
    'cookie',
    'header',
    'url',
  ],
}));

app.keys = ['secret'];
koaValidate(app);
app.use(middleware());
// app.use(auth());
app.use(api());
app.use((ctx) => {
  ctx.status = 404;
  ctx.body = { message: 'not found' };
});

app.context.onerror = function (err) {
  console.error('server error', err);
  if (err == null) {
    return;
  }

  let message = err.message ? err.message : JSON.stringify(err);
  try {
    const errMsg = JSON.parse(message);
    if (errMsg && errMsg.message) {
      message = errMsg.message;
    }
  } catch (e) {
    //
  }

  this.body = {
    message,
  };

  if (err.status >= 400 || err.status <= 499) {
    this.body.errors = err.errors;
  }

  this.status = err.status;
  this.res.end(JSON.stringify(this.body));
};

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
  // application specific logging, throwing an error, or other logic here
});

export default app;
