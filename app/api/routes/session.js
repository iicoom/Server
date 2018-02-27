/**
 * Created by bj on 16/8/2.
 */
import { getUser, getUserByMobile, updateUserByName, checkPasswordWithId, createUser, createUserWithMobile, createUserWithUnionId, getUserByUnionId, updateWechatUserInfo, addOpenid, getUserById, initWalletAccount } from '../../services/UserService';
import ClientError from '../../util/Errors/ClientErrors.js';
import ForbiddenError from '../../util/Errors/ForbiddenError.js';
import ErrorCode from '../../util/Errors/ErrorCode.js';
import config from '../../../config';
import constant from '../../util/constant';
import Utility from '../../util/utils';
import { send, mailInfo } from '../../util/email';

const { USER_FLAG } = constant;

export default (router) => {
  router
    // 注册
    .post('/register', async (ctx) => {
      const { username, password, confirm, mobile, captcha } = ctx.request.body;
      const userInfo = {};
      ctx.checkBody('username').notEmpty(ctx.i18n.__(ErrorCode.PASSWORD_NOT_EMPTY));
      ctx.checkBody('password').notEmpty(ctx.i18n.__(ErrorCode.PASSWORD_NOT_EMPTY));
      ctx.checkBody('confirm').notEmpty(ctx.i18n.__(ErrorCode.CONFIRM_PASSWORD_NOT_EMPTY)).eq(password, ctx.i18n.__(ErrorCode.TWO_PASSWORD_NOT_CONSISTENT));
      if (username && password) {
        userInfo.username = username;
        userInfo.password = password;
      } else if (mobile && captcha) {
        userInfo.mobile = ctx.checkBody('mobile').isMobilePhone(ctx.i18n.__(ErrorCode.MOBILE_FORMAT_ERROR), 'zh-CN');
        ctx.checkBody('captcha').notEmpty(ctx.i18n.__(ErrorCode.PASSWORD_NOT_EMPTY));
        // 检查传来的验证码和发送的是否相同
      }

      if (ctx.errors) {
        const error = new ClientError(ctx.i18n.__(ErrorCode.PARAMS_ERROR));
        error.errors = ctx.errors;
        throw error;
      }

      // 检测是否被占用
      const condition = {};
      username && (condition.username = username);
      mobile && (condition.mobile = mobile);
      const user = await getUser(condition);
      if (user == null) {
        send(mailInfo(username));
        const result = await createUser(userInfo);
        ctx.body = result;
      } else {
        const error = new ClientError(ctx.i18n.__(ErrorCode.ACCOUNT_ALREADY_EXIST));
        ctx.body = error;
      }
    })
    .get('/emailVerify', async (ctx) => {
      const username = ctx.query.username;
      const code = ctx.query.code;
      const outdate = ctx.query.outdate;
      // 校验code，最好再校验失效时间...
      console.log(username)
      const user = await getUser({ username });
      if (user) {
        await updateUserByName(username, { is_activate: true });
        ctx.body = '您的账户激活成功';
      } else {
        ctx.body = '该用户不存在，激活失败';
      }
    })
    // 登录
    .post('/login', async (ctx) => {
      const { username, password, mobile, captcha } = ctx.request.body;

      ctx.session.ip = Utility.getClientIp(ctx.request);
      ctx.session['user-agent'] = ctx.request.header['user-agent'];

      // 参数检验
      // ctx.checkBody('mobile').isMobilePhone(ctx.i18n.__(ErrorCode.MOBILE_FORMAT_ERROR), 'zh-CN');

      ctx.checkBody('username').notEmpty(ctx.i18n.__(ErrorCode.PASSWORD_NOT_EMPTY));
      ctx.checkBody('password').notEmpty(ctx.i18n.__(ErrorCode.PASSWORD_NOT_EMPTY));

      if (ctx.errors) {
        const error = new ClientError(ctx.i18n.__(ErrorCode.PARAMS_ERROR));
        error.errors = ctx.errors;
        throw error;
      }

      if (username && password) {
        // 根据手机号获取用户信息
        const userInfo = await getUser({ username });
        console.log('==========getUserByMobile(username)==========');
        console.log(userInfo);
        if (userInfo) {
          // 验证登录密码是否正确
          const passwordIsTrue = await checkPasswordWithId(userInfo.id, password);
          if (!passwordIsTrue) {
          // 登录的用户密码不正确
            throw new ClientError(ctx.i18n.__(ErrorCode.INVALID_USER_NAME_PASSWORD));
          } else {
            const result = userInfo;
            result.flage = result.is_real_name ? USER_FLAG.sinaNormal : USER_FLAG.normal;
            result.token = ctx.sessionId;
            result.expire = config.cookie_max_age;
            ctx.session.userInfo = result;
            ctx.body = result;
          }
        } else {
          // 登录的用户不存在(同样报 用户名密码错误)
          throw new ClientError(ctx.i18n.__(ErrorCode.INVALID_USER_NAME_PASSWORD));
        }
      } else if (mobile && captcha) {
        // 手机号登录逻辑
        throw new ClientError(ctx.i18n.__(ErrorCode.INVALID_USER_NAME_PASSWORD));
      }
    })
    .get('/session', async (ctx) => {
      ctx.body = ctx.session.userInfo;
    })
    // 判断用户是否登录
    .get('/session/loginState', (ctx) => {
      ctx.body = { isLogin: !!ctx.session.userInfo };
    })
    // 登出用户的登录状态（删除用户session）
    .delete('/session/signout', (ctx) => {
      delete ctx.session;
      ctx.body = '退出登录成功';
    });
};
