import UserService, { createUserWithMobile, getUserByMobile,
  getUserById, updateUserInfoById, checkPasswordWithId, updatePasswordById, getUsers,
  addUserWithMobile, updateUser, fetchPlatformUsers, filterPlatformUsers, getUsersByMobile, deleteUserToken } from '../../services/UserService';
import User from '../../models/user';
import ClientError from '../../util/Errors/ClientErrors';
import ErrorCode from '../../util/Errors/ErrorCode';
import toolUtil from '../../util/toolUtil';
import constant from '../../util/constant';
import { getClientIp, setLinkHeader } from '../../util/utils';
import auth, { needLogin, needAdmin, needResOwner, and, or } from '../../middleware/auth';

const { USER_FLAG } = constant;

export default (router) => {
  router
    .param('/id', async (id, ctx, next) => {
      const userInfo = await getUserById(id);
      if (userInfo) {
        global.user = userInfo;
      } else {
        throw new ClientError(ctx.i18n.__('parameter.error'));
      }

      await next();
    })
    .get('/users', async (ctx) => {
      const condition = {
        keyWord: ctx.request.query.keyWord,
        mobile: ctx.request.query.mobile,
        idCard: ctx.request.query.idCard,
        isRealName: ctx.request.query.isRealName,
        page: ctx.request.query.page || 1,
        size: ctx.request.query.size || 15,
      };
      if (condition) {
        const userList = await getUsers(condition);
        ctx.body = userList;
      } else {
        ctx.body = '查询条件呢亲？';
      }


    })
  // 验证手机号是否已经存在
    .get('/users/mobile/exists', async (ctx) => {
      const mobile = ctx.request.query.mobile;
      // 检验参数
      ctx.checkQuery('mobile').notEmpty(ctx.i18n.__(ErrorCode.MOBILE_NOT_EMPTY)).isMobilePhone(ctx.i18n.__(ErrorCode.MOBILE_FORMAT_ERROR), 'zh-CN');

      if (ctx.errors && ctx.errors.length) {
        const error = new ClientError(ctx.i18n.__(ErrorCode.PARAMS_ERROR));
        error.errors = ctx.errors;
        ctx.body = error;
        return;
      }
      let result;
      try {
        const userInfo = await getUserByMobile(mobile);
        result = userInfo ? { isExist: true } : { isExist: false };
      } catch (e) {
        result = e;
      } finally {
        ctx.body = result;
      }
    })

  // 根据用户id获取用户信息
    .get('/users/:id', needLogin, or(needResOwner('params.id'))(needAdmin),
      async (ctx) => {
        ctx.body = global.user;
      },
    )

  // 手机号密码注册
    .post('/users', async (ctx, next) => {
      // 获取请求参数
      const { request } = ctx;
      // 参数检验
      ctx.checkBody('mobile').notEmpty(ctx.i18n.__(ErrorCode.MOBILE_NOT_EMPTY)).isMobilePhone(ctx.i18n.__(ErrorCode.MOBILE_FORMAT_ERROR), 'zh-CN');
      ctx.checkBody('password').notEmpty(ctx.i18n.__(ErrorCode.PASSWORD_NOT_EMPTY));
      ctx.checkBody('confirm_password').notEmpty(ctx.i18n.__(ErrorCode.CONFIRM_PASSWORD_NOT_EMPTY)).eq(request.body.confirm_password, ctx.i18n.__(ErrorCode.TWO_PASSWORD_NOT_CONSISTENT));

      if (ctx.errors && ctx.errors.length) {
        const error = new ClientError(ErrorCode.ErrorParams);
        ctx.status = 400;
        error.errors = ctx.errors;
        ctx.body = error;
        return;
      }

      // 获取请求参数
      const { mobile, password } = ctx.request.body;

      // 参数封装
      const userInfo = {
        mobile,
        password,
      };
      try {
        const user = await createUserWithMobile(userInfo);
        ctx.body = user;
      } catch (err) {
        ctx.body = err;
      }
    })
  // 管理平台添加用户
    .post('/users/adduser', needLogin, needAdmin, async (ctx) => {
      const userInfo = {
        username: ctx.checkBody('username').notEmpty().trim().value, // 用户名
        password: ctx.checkBody('password').value, // 密码
        mobile: ctx.checkBody('mobile').notEmpty().isMobilePhone(ErrorCode.MOBILE_FORMAT_ERROR, 'zh-CN').trim().value, // 手机号
      };
      if (ctx.errors && ctx.errors.length) {
        ctx.status = 400;
        const error = new ClientError(ErrorCode.PARAMS_ERROR);
        error.errors = ctx.errors;
        throw error;
      }
      const { platformRole } = ctx.request.body;
      if (JSON.stringify(platformRole) !== '{}') {
        userInfo.platform_role = platformRole;
        const { mobile } = ctx.request.body;
        const result = await getUserByMobile(mobile);
        if (!result) {
          if (!userInfo.password) {
            const error = new ClientError('密码不能为空！');
            error.errors = ctx.errors;
            throw error;
          }
          const user = await addUserWithMobile(userInfo);
          ctx.body = user;
        } else {
          // 如果是老用户只更新platform_role,登录密码还是用户设置的密码
          const conditions = { mobile };
          const user = await updateUser(conditions, { username: userInfo.username, platform_role: platformRole });
          ctx.body = user;
        }
      } else {
        const error = new ClientError('platformRole不能为空');
        error.errors = ctx.errors;
        throw error;
      }
    })
  // 管理平台获取有platform字段的用户列表
    .get('/userlists', needLogin, needAdmin, async (ctx) => {
      const condition = {
        page: ctx.request.query.page || 1,
        size: ctx.request.query.size || 15,
        mobile: ctx.request.query.mobile,
        platform: ctx.request.query.platform,
      };
      console.log(condition);
      if (condition.mobile) {
        const result = await getUsersByMobile(condition.mobile);
        ctx.body = result;
      } else if (condition.platform) {
        const result = await filterPlatformUsers(condition);
        ctx.body = result;
      } else {
        const result = await fetchPlatformUsers(condition);
        ctx.body = result;
      }
    })
  // 管理平台修改用户信息
    .put('/users/update/:id', needLogin, needAdmin, async (ctx) => {
      const id = ctx.params.id;
      const updateInfo = {
        username: ctx.checkBody('username').notEmpty().trim().value, // 用户名
        mobile: ctx.checkBody('mobile').notEmpty().isMobilePhone(ErrorCode.MOBILE_FORMAT_ERROR, 'zh-CN').trim().value, // 手机号
        platformRole: ctx.checkBody('platformRole').notEmpty(),
      };
      if (ctx.errors && ctx.errors.length) {
        ctx.status = 400;
        const error = new ClientError(ErrorCode.PARAMS_ERROR);
        error.errors = ctx.errors;
        throw error;
      }

      if (id) {
        const { mobile } = ctx.request.body;
        const userInfo = await getUserById(id);
        const { platformRole } = ctx.request.body;
        if (mobile === userInfo.mobile) {
          if (JSON.stringify(platformRole) !== '{}') {
            updateInfo.platform_role = platformRole;
            const conditons = { _id: id };
            const result = await updateUser(conditons, updateInfo);
            ctx.body = result;
          } else {
            const error = new ClientError('platformRole不能为空');
            error.errors = ctx.errors;
            throw error;
          }
        } else {
          updateInfo.platform_role = platformRole;
          const conditons = { mobile };
          const result = await updateUser(conditons, updateInfo);
          ctx.body = result;
        }
      } else {
        ctx.body = 'id不能为空！';
      }
    })
  // 管理平台删除用户平台角色
    .delete('/users/platform/:id', needLogin, needAdmin, async (ctx) => {
      const { id } = ctx.params;
      if (id) {
        const updateInfo = { delplatformrole: true };
        const conditons = { _id: id };

        const result = await updateUser(conditons, updateInfo);
        ctx.body = result;
      } else {
        ctx.body = 'id不能为空！';
      }
    })
  // 管理平台冻结用户
    .put('/users/loginlimit/:id', needLogin, needAdmin, async (ctx) => {
      const { id } = ctx.params;

      if (id) {
        const userInfo = await getUserById(id);
        console.log(`get user Info is ${userInfo}`);
        if (userInfo) {
          await deleteUserToken(userInfo);
        }
        if (userInfo && !userInfo.disabled) {
          const updateInfo = { disabled: true };
          const conditons = { _id: id };
          const result = await updateUser(conditons, updateInfo);
          console.log(result);
          ctx.body = result;
        } else if (userInfo.disabled === true) {
          const updateInfo = { disabled: false };
          const conditons = { _id: id };
          const result = await updateUser(conditons, updateInfo);
          ctx.body = result;
        }
      }
    })
  // 管理平台重置用户密码
    .put('/users/password/reset/:id', needLogin, needAdmin, async (ctx) => {
      const { id } = ctx.params;
      const rePassword = ctx.checkBody('re_password').notEmpty().trim().len(6).value; // 新密码
      if (ctx.errors && ctx.errors.length) {
        ctx.status = 400;
        const error = new ClientError(ErrorCode.PARAMS_ERROR);
        error.errors = ctx.errors;
        throw error;
      }
      let result;
      try {
        const userInfo = await resetPlatformUserPass(id, rePassword);
        if (userInfo) {
          await deleteUserToken(userInfo);
        }
        result = userInfo;
      } catch (e) {
        result = e;
      } finally {
        ctx.body = result;
      }
    })
  // 用户修改个人信息（昵称、性别、头像）
    .put('/users/:id', needLogin, async (ctx) => {
      // 验证用户是否存在
      const nickname = ctx.request.body.nickname || global.user.nickname || '';
      const gender = ctx.request.body.gender || global.user.gender || '';
      const portraitId = ctx.request.body.portrait_id || global.user.portrait_id || '';
      const email = ctx.request.body.email || global.user.email || '';
      const birthday = ctx.request.body.birthday || global.user.birthday || '';
      const idcard = ctx.request.body.idcard || '';
      const uid = ctx.params.id;
      const platform_role = ctx.request.body.platform_role || '';

      if (!toolUtil.testEmail(email)) {
        throw new ClientError(ErrorCode.EMAIL_FORMAT_ERROR);
      }

      let result;
      try {
        // 根据用户Id修改用户基本信息
        result = await updateUserInfoById(uid, {
          nickname,
          gender,
          portrait_id: portraitId,
          email,
          birthday,
          idcard,
          platform_role,
        });
        // 将更新后的用户信息存储在session中
        ctx.session.userInfo = result;
      } catch (e) {
        result = e;
      } finally {
        ctx.body = result;
      }
    })
  // 用户修改登录密码
    .put('/users/:id/password', needLogin, or(needAdmin)(needResOwner('params.id')), async (ctx) => {
      const userInfo = ctx.session.userInfo;
      const { ticket, password, new_password, re_password } = ctx.request.body;
      const isAdmin = userInfo.role_type === constant.RoleType.Administor;
      // 参数校验

      if (!isAdmin) {
        ctx.checkBody('ticket').notEmpty(ctx.i18n.__(ErrorCode.TICKET_NOT_EMPTY));
      }
      ctx.checkBody('password').notEmpty(ctx.i18n.__(ErrorCode.PASSWORD_NOT_EMPTY));
      ctx.checkBody('re_password').notEmpty(ctx.i18n.__(ErrorCode.CONFIRM_PASSWORD_NOT_EMPTY));
      ctx.checkBody('new_password').notEmpty(ctx.i18n.__(ErrorCode.PASSWORD_NOT_EMPTY)).eq(re_password, ctx.i18n.__(ErrorCode.TWO_PASSWORD_NOT_CONSISTENT)).len(6);

      if (ctx.errors && ctx.errors.length) {
        const error = new ClientError(ctx.i18n.__(ErrorCode.PARAMS_ERROR));
        error.errors = ctx.errors;
        ctx.body = error;
        return;
      }

      if (!isAdmin) {
        // 校验参数ticket的有效性
        const info = await checkStepTicket(ticket);
        // 校验接收验证码的手机号与登录用户的手机号是否一致
        if (!info || info.mobile !== userInfo.mobile) {
          throw new ClientError(ctx.i18n.__(ErrorCode.TICKET_VERIFICATION_FAIL));
        }
      }

      // 根据Id查询用户信息，判断用户密码与原密码是否一致
      const isEqual = await checkPasswordWithId(userInfo._id.toString(), password);
      if (!isEqual) {
        throw new ClientError(ctx.i18n.__(ErrorCode.PASSWORD_VERIFICATION_FAIL));
      }
      // 将新密码加密后存入数据库中
      const user = await updatePasswordById(userInfo._id, new_password);
      ctx.userId = ctx.session.userInfo._id || ctx.session.userInfo.id || null;
      if (ctx.session.wxUserInfo) {
        // flag修改为USER_FLAG.wxGuest，并删除session中的userInfo
        ctx.session.wxUserInfo.flage = USER_FLAG.wxGuest;
        delete ctx.session.userInfo;
      } else {
        // 登出用户的登录状态（删除用户session）
        delete ctx.session;
      }

      ctx.body = null;
    })
  // 用户忘记密码后重新设置新密码
    .post('/users/password/reset', async (ctx) => {
      const { ticket, mobile, password, re_password } = ctx.request.body;

      // 参数校验
      ctx.checkBody('ticket').notEmpty(ctx.i18n.__(ErrorCode.TICKET_NOT_EMPTY));
      ctx.checkBody('mobile').notEmpty(ctx.i18n.__(ErrorCode.MOBILE_NOT_EMPTY)).isMobilePhone(ctx.i18n.__(ErrorCode.MOBILE_FORMAT_ERROR), 'zh-CN');
      ctx.checkBody('password').notEmpty(ctx.i18n.__(ErrorCode.PASSWORD_NOT_EMPTY)).len(6);
      ctx.checkBody('re_password').notEmpty(ctx.i18n.__(ErrorCode.CONFIRM_PASSWORD_NOT_EMPTY)).eq(password, ctx.i18n.__(ErrorCode.TWO_PASSWORD_NOT_CONSISTENT));

      if (ctx.errors && ctx.errors.length) {
        const error = new ClientError(ctx.i18n.__(ErrorCode.PARAMS_ERROR));
        error.errors = ctx.errors;
        ctx.body = error;
        return;
      }

      // 校验参数ticket的有效性
      const info = await checkStepTicket(ticket);
      // 校验接收验证码的手机号与登录用户的手机号是否一致
      if (!info || info.mobile !== mobile) {
        throw new ClientError(ErrorCode.TICKET_VERIFICATION_FAIL);
      }

      // 根据手机号码获取该用户的信息
      const oldUser = await getUserByMobile(mobile);
      // 将新密码加密后存入数据库中
      await updatePasswordById(oldUser._id, password);
      ctx.userId = oldUser && oldUser._id;
      ctx.body = null;
    })

  // 删除用户
    .delete('/users/:id', needLogin, needAdmin, async (ctx) => {
      const user = await User.findByIdAndRemove(ctx.params.id);
      if (user) {
        await deleteUserToken(user);
        // ctx.status = 204;
        ctx.body = '用户删除成功！';
      }
    });
};
