/**
 * Created by bjcwq on 16/8/3.
 */

import AuthError from '../util/Errors/AuthError.js';
import ForbiddenError from '../util/Errors/ForbiddenError.js';
import ServerError from '../util/Errors/ServerErrors.js';
import constant from '../util/constant.js';
import _ from 'lodash';

const debug = require('debug')('app-auth');

export async function needLogin(ctx, next) {
  const sessionUserInfo = ctx.session.userInfo;
  if (!!sessionUserInfo) {
    return await next();
  }
  throw new AuthError('请先登录');
}

export const needResFarm = resFarmProp => async (ctx, next) => {
  const resFarmIdFn = () => {
    let tmp = ctx;
    const props =  resFarmProp.split('.');
    for (const prop in props) {
      tmp = tmp[props[prop]];
    }
    return tmp;
  };
  const result = __.find(ctx.session.userInfo.companies, { company_id: resFarmIdFn() });
  if (!!result) {
    return await next();
  }
  throw new ForbiddenError('没有access参数');
};

export async function needAdmin(ctx, next) {
  const sessionUserInfo = ctx.session.userInfo;
  if (sessionUserInfo &&
      sessionUserInfo &&
      sessionUserInfo.role_type === constant.RoleType.Administor) {
    return await next();
  }
  throw new ForbiddenError('权限不足');
}

// {yunfarm:[1],farm:[1]}
export const needPlatFormAuth = resPlatFormProp => async (ctx, next) => {
  const sessionUserInfo = ctx.session.userInfo;
  let isPass = false;
  _.map(resPlatFormProp, (value, key) => {
    if (sessionUserInfo.platform_role) {
      const roleArr = _.intersection(sessionUserInfo.platform_role[key], value);
      debug('====roleArr================');
      debug(roleArr);
      if (roleArr && roleArr.length > 0) {
        isPass = true;
      }
    } else {
      throw new ForbiddenError('权限不足');
    }
  });
  if (isPass) {
    return await next();
  } else {
    throw new ForbiddenError('权限不足');
  }

};

export async function needFeeder(ctx, next) {
  const sessionUserInfo = ctx.session.userInfo;
  if (sessionUserInfo &&
      sessionUserInfo &&
      sessionUserInfo.role_type === constant.RoleType.Feeder) {
    return await next();
  }
  throw new ForbiddenError('权限不足');
}

const needEqual = async (pfn1, pfn2) => {
  const p1 = await pfn1();
  const p2 = await pfn2();
  if (p1 === p2) {
    return true;
  }
  return false;
};

export const needResOwner = resOwnerProp => async (ctx, next) => {
  const resOwnerIdFn = () => {
    let tmp = ctx;
    const props =  resOwnerProp.split('.');
    for (const prop in props) {
      tmp = tmp[props[prop]];
    }
    return tmp;
  };
  const loginUserIdFn = () => ctx.session.userInfo._id;

  const equal = await needEqual(resOwnerIdFn, loginUserIdFn);
  if (!!equal) {
    return await next();
  }
  throw new ForbiddenError('没有access参数');
};

export const or = auth1 => auth2 => async (ctx, next) => {
  const localNext = async () => {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  };
  let r1 = false;
  let r2 = false;
  try {
    r1 = await auth1(ctx, localNext);
  } catch (e) {
    r1 = false;
  }
  try {
    r2 = await auth2(ctx, localNext);
  } catch (e) {
    r2 = false;
  }

  if (r1 || r2) {
    return await next();
  }
  throw new ForbiddenError('access被拒绝');
};

export const and = authRoles => async (ctx, next) => {
  let result = true;
  let error = null;

  const resultSuccess = () => {
    result = result && true;
  };
  const resultFailed = (e) => {
    error = e;
    result = result && false;
  };

  if (__.isArray(authRoles)) {
    for (const authRole of authRoles) {
      await authRole(ctx, next)
        .then(resultSuccess)
        .catch(resultFailed);
    }
  } else {
    throw new ServerError();
  }

  if (result) {
    return await next();
  }
  throw error;
};
