/**
 * Created by bj on 16/8/2.
 */
import UserService, { getUserByMobile, checkPasswordWithId, createUserWithMobile, createUserWithUnionId, getUserByUnionId, updateWechatUserInfo, addOpenid, getUserById, initWalletAccount } from '../../services/UserService';
import ClientError from '../../util/Errors/ClientErrors.js';
import ForbiddenError from '../../util/Errors/ForbiddenError.js';
import ErrorCode from '../../util/Errors/ErrorCode.js';
import config from '../../../config';
import constant from '../../util/constant';
import toolUtil from '../../util/toolUtil';
const { USER_FLAG } = constant;

export default (router) => {
    router
        // 登录
        .post('/session', async ctx => {
            const { mobile, password } = ctx.request.body;

            ctx.session.ip=toolUtil.getClientIP(ctx.request);
            ctx.session['user-agent']=ctx.request.header['user-agent'];

            if (mobile && password) {
                //使用手机号和密码进行登录

                //参数检验
                ctx.checkBody('mobile').isMobilePhone(ctx.i18n.__(ErrorCode.MOBILE_FORMAT_ERROR), 'zh-CN');
                ctx.checkBody('password').notEmpty(ctx.i18n.__(ErrorCode.PASSWORD_NOT_EMPTY));

                if (ctx.errors) {
                    const error = new ClientError(ctx.i18n.__(ErrorCode.PARAMS_ERROR));
                    error.errors = ctx.errors;
                    throw error;
                }

                //根据手机号获取用户信息
                const userInfo = await getUserByMobile(mobile);
                console.log(userInfo)
                if (userInfo) {
                    //验证登录密码是否正确
                    const passwordIsTrue = await checkPasswordWithId(userInfo.id, password);
                    if (!passwordIsTrue) {
                        //登录的用户密码不正确
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
                    //登录的用户不存在(同样报 用户名密码错误)
                    throw new ClientError(ctx.i18n.__(ErrorCode.INVALID_USER_NAME_PASSWORD));
                }
            }
        })
        .get('/session', async ctx => {
            // 获取登录用户信息
            ctx.body = ctx.session.userInfo;
        })
        //判断用户是否登录
        .get('/session/loginState', ctx => {
            ctx.body = { isLogin: !!ctx.session.userInfo };
        })
        .delete('/session/signout', ctx => {
            //登出用户的登录状态（删除用户session）
            delete ctx.session;
            ctx.body = '退出登录成功';
        });
};