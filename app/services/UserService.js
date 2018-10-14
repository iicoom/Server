/**
 * Created by mxj on 16/8/1.
 */
import _ from 'lodash';
import randomstring from 'randomstring';
import User from '../models/user';
import AccountService from './AccountService.js';
import ServerError from '../util/Errors/ServerErrors.js';
import ClientError from '../util/Errors/ClientErrors.js';
import Utility from '../util/utils.js';

// import log from '../util/log';

import { rc } from './redis.js';

// const logger = log.getLogger('user');
// logger.setLevel('INFO');


const resource = 'user';

const getWeixinUserInfo = async (user) => {
  if (user.unionid) {
    const wechatUserInfo = await WechatUserInfo.findOne({
      unionid: user.unionid,
    });
    return wechatUserInfo ? wechatUserInfo.toObject() : null;
  }

  if (user.openid) {
    const wechatUserInfo = await WechatUserInfo.findOne({
      openid: user.openid,
    });
    return wechatUserInfo ? wechatUserInfo.toObject() : null;
  }
  return null;
};

/**
 * 创建用户
 * @param userInfo
 * @returns {Promise.<null>}
 */
export const createUser = async (userInfo) => {
  userInfo.salt = randomstring.generate(24);
  userInfo.password = Utility.sha256(userInfo.password + userInfo.salt);
  try {
    console.log(userInfo);
    const user = await User.create(userInfo);
    return user ? user.toJSON() : null;
  } catch (e) {
    throw new ServerError(e.toString());
  }
};

/**
 * 使用手机号密码创建用户。
 * @param userInfo
 * @param recommendCode
 * @returns {Promise}
 */
export const createUserWithMobile = async (userInfo) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        let user = await User.findOne({ mobile: userInfo.mobile });
        if (!user) {
          if (userInfo.password) {
            userInfo.salt = randomstring.generate(24);
            userInfo.password = Utility.sha256(userInfo.password + userInfo.salt);
          }
          console.log(userInfo);
          user = await User.create(userInfo);
          AccountService.initAccount(user._id.toString());
          resolve(user ? user.toJSON() : null);
        } else {
          const error = new ClientError('mobile has been used .');
          error.push(new ClientError.AlreadyExistsError(resource, 'mobile'));
          reject(error);
        }
      } catch (e) {
        reject(new ServerError(e.toString()));
      }
    })();
  });
};

export async function getUserById(userId) {
  try {
    const user = await User.findById(userId);
    if (user) {
      const userInfo = user.toObject();
      const wxUserInfo = await getWeixinUserInfo(userInfo);
      return { ...wxUserInfo, ...userInfo };
    }
    return null;
  } catch (e) {
    throw new ServerError(e.toString());
  }
}

export const getUserByName = async (condition) => {
  try {
    const user = await User.findOne(condition);
    if (user) {
      return user.toJSON();
    }
    return null;
  } catch (e) {
    throw new ServerError(e.toString());
  }
};

export const getUserByMobile = async (mobile) => {
  try {
    const user = await User.findOne({ mobile });

    if (user) {
      return (user ? user.toJSON() : null);
    }
    return null;
  } catch (e) {
    throw new ServerError(e.toString());
  }
};

/**
 * 检查用户密码
 * @param userId
 * @param password
 * @returns {boolean}
 */
export async function checkPasswordWithId(userId, password) {
  try {
    const user = await User.findById(userId);

    let result = false;
    if (user) {
      if (user.disabled) {
        throw new ClientError('账户已被冻结');
      }
      if (user.unsubscribe) {
        throw new ClientError('账户已被删除');
      }
      // 检查有没有被记录限制时间
      const limitTime =  await rc.getAsync(`${user.mobile}-login-limit`);
      const now = _.now();
      if (limitTime) {
        const m = Math.ceil(((10 * 60 * 1000 + parseInt(limitTime, 10)) - now) / (60 * 1000));
        throw new ClientError(`账户冻结，请${m}分钟后再试！`);
      }
      const failCount = parseInt(await rc.getAsync(`${user.mobile}-login-fail`), 10);
      if (failCount && failCount > 8) {
        rc.multi()
          .del(`${user.mobile}-login-fail`) // 失败次数
          .set(`${user.mobile}-login-limit`, now) // 登陆限制
          .expire(`${user.mobile}-login-limit`, 10 * 60) // 有效期10分钟
          .exec(_.loop);
        throw new ClientError('账户冻结，请10分钟后再试！');
      }

      const passwordHash = Utility.sha256(password + user.salt);
      result = user.password === passwordHash;

      if (!result) {
        rc.incr(`${user.mobile}-login-fail`);
      } else {
        rc.del(`${user.mobile}-login-fail`);
      }
    }
    return result;
  } catch (e) {
    if (e instanceof ClientError) {
      throw e;
    }
    throw new ServerError(e.toString());
  }
}

/**
 * 帐号已经通过微信直接开通，绑定用户的手机号和登录密码
 * @param userId
 * @param mobile
 * @param password
 * @returns {Promise}
 */
export async function bindMobileAndPassword(userId, mobile, password) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const user = await User.findById(userId);
        const mobileExist = await User.findOne({ mobile });

        if (user && user.unionid && !mobileExist) {
          // 用存在，但是mobile不存在。
          user.mobile = mobile;
          user.salt = randomstring.generate(24);
          user.password = sha256(password + user.salt);
          await user.save();
          resolve(user.toObject());
        } else {
          const error = new ClientError();
          if (!user || !user.unionid) {
            error.push(new ClientError.MissError(resource, 'unionid'));
            error.setErrorMessage('user not found or havent bind unionid');
          } else if (mobileExist) {
            error.push(new ClientError.AlreadyExistsError(resource, 'mobile'));
            error.setErrorMessage('mobile has been used ');
          }
          reject(error);
        }
      } catch (e) {
        reject(new ServerError(e.toString()));
      }
    })();
  });
}

/**
 * 已绑定unionid的用户添加openid
 * @param userId
 * @param appid
 * @param openid
 * @returns {*}
 */
export async function addOpenid(userId, appid, openid) {
  try {
    let user = await User.findById(userId);
    if (!appid || !openid) {
      return user ? user.toObject() : null;
    }

    if (user && !user.wxopenids.wxUserInfo[appid]) {
      user.wxopenids[appid] = openid;
      user = await user.findByIdAndUpdate(userId, user);
    }

    return user ? user.toObject() : null;
  } catch (e) {
    throw new ServerError(e.toString());
  }
}

/**
 * 解除unionid绑定
 * @param userId
 * @returns {*}
 */
export async function unBindWechatUnionId(userId) {
  try {
    let user = await User.findById(userId);
    user.unionid = null;
    user.wxnickname = null;
    user = await user.save();
    return user ? user.toObject() : null;
  } catch (e) {
    throw new ServerError(e.toString());
  }
}

/**
 * 设置用户在微信上的用户信息
 * @param wechatUserInfo
 */
export async function updateWechatUserInfo(wechatUserInfo) {
  return await WechatUserInfo.update({
    appid: wechatUserInfo.appid,
    openid: wechatUserInfo.openid,
  }, wechatUserInfo, { upsert: true });
}

/**
 * 用户列表
 * @param keyWord
 * @param mobile
 * @param idCard
 * @param isRealName
 * @param startTime
 * @param endTime
 * @param companyId
 * @param page
 * @param size
 * @returns {*}
 */
export async function getUsers({ keyWord, mobile, idCard, isRealName, startTime, endTime, companyId }, { page, size } = {
  page: 1,
  size: 15,
}) {
  try {
    const condition = {};

    if (!!keyWord) {
      const subConditon = [];
      subConditon.push({ username: { $regex: keyWord } });
      subConditon.push({ nickname: { $regex: keyWord } });
      subConditon.push({ mobile: { $regex: keyWord } });
      condition.$or = subConditon;
    }
    if (!!mobile) {
      condition.mobile = { $regex: mobile };
    }

    if (!!idCard) condition.idCard = { $regex: idCard };
    if (!!isRealName && isRealName === '1') condition.is_real_name = true;
    if (!!isRealName && isRealName === '2') condition.is_real_name = { $ne: true };

    if (!!startTime) {
      condition.create_time = { $gte: startTime };
    }

    if (!!endTime) {
      condition.create_time = { $lte: endTime };
    }
    if (!!companyId) {
      condition.companies = { $elemMatch: { company_id: companyId } };
    }
    const skip = (page - 1) * size;
    const limit = size;
    const total = await User.count(condition);
    const users = await User.find(condition, null, {
      create_time: -1,
      skip,
      limit,
    });
    return { total, page, size, users };

  } catch (e) {
    console.dir(e);
    return new ServerError(e.toString());
  }
}
/**
 * 修改用户信息
 * @param id 用户ID
 * @param nickname 昵称
 * @param gender 性别
 * @param portrait_id 头像ID
 * @param email 邮箱
 * @param birthday 生日
 * @returns {*}
 */
export async function updateUserInfoById(id, updateInfo) {

  try {
    const user = await User.findByIdAndUpdate(id, updateInfo, {
      new: true, // 声明返回更新后的数据
      runValidators: true,
    });
    return user ? user.toJSON() : null;
  } catch (e) {
    console.dir(e);
    throw new ServerError(e.toString());
  }

}

/**
 * 根据用户id修改用户密码
 * @param uid 用户id
 * @param password 新密码
 * @returns {*}
 */
export async function updatePasswordById(uid, password) {
  try {
    const salt = randomstring.generate(24);
    const passwordHash = sha256(password + salt);
    const user = await User.findByIdAndUpdate(uid, {
      password: passwordHash,
      salt,
    }, {
      new: true,
      runValidators: true,
    });
    return user ? user.toObject() : null;
  } catch (e) {
    console.dir(e);
    throw new ServerError(e.toString());
  }
}

/**
 * 添加用户身份信息
 * @param id 用户ID
 * @param companies 用户身份信息{company_id,company_name,role}
 * @returns {*}
 */
export async function updateCompaniesById(id, companies) {

  try {
    const user = await User.findByIdAndUpdate(id, { companies }, {
      new: true, // 声明返回更新后的数据
      runValidators: true,
    });
    return user ? user.toObject() : null;
  } catch (e) {
    console.dir(e);
    throw new ServerError(e.toString());
  }

}

/**
 * 删除用户身份信息
 * @param id 用户ID
 * @param company_id 牧场id
 * @returns {*}
 */
export async function deleteCompaniesById(id, company_id) {

  try {
    const user = await User.findByIdAndUpdate(id, { $pull: { companies: { company_id } } }, {
      new: true, // 声明返回更新后的数据
      runValidators: true,
    });
    return user ? user.toObject() : null;
  } catch (e) {
    console.dir(e);
    throw new ServerError(e.toString());
  }

}

/**
 * 管理平台添加用户
 * @param mobile
 */
export async function addUserWithMobile(userInfo) {
  if (userInfo.password) {
    userInfo.salt = randomstring.generate(24);
    userInfo.password = sha256(userInfo.password + userInfo.salt);
  }
  try {
    const user = new User(userInfo);
    user.save();
    return user;

  } catch (e) {
    throw new ServerError(e.toString());
  }
}

/**
 * 管理平台手机号获取用户信息
 * @param mobile
 */
export async function getUsersByMobile(mobile) {

  try {
    const data = {};
    const result = await User.find({ mobile, platform_role: { $exists: true } });
    const count = await User.count({ mobile, platform_role: { $exists: true } });
    data.total_count = count;
    data.result = result;
    return data;

  } catch (e) {
    throw new ServerError(e.toString());
  }
}


/**
 * 管理平台获取用户列表
 * @param condition
 */
export async function fetchPlatformUsers(condition) {

  try {
    const data = {};

    const skip = (condition.page - 1) * condition.size;
    const limit = condition.size;
    const result = await User.find({ platform_role: { $exists: true } }, null, { create_time: -1, skip, limit });
    const count = await User.count({ platform_role: { $exists: true } });
    data.total_count = count;
    data.result = result;
    return data;

  } catch (e) {
    throw new ServerError(e.toString());
  }
}


/**
 * 管理平台根据mobile或platform搜素用户
 */
export async function filterPlatformUsers(condition) {

  try {
    const data = {};

    const skip = (condition.page - 1) * condition.size;
    const limit = condition.size;

    if (condition.platform === 'yunfarm') {
      const result = await User.find({ 'platform_role.yunfarm': { $exists: true } }, null, { create_time: -1, skip, limit });
      const count = await User.count({ 'platform_role.yunfarm': { $exists: true } });
      data.total_count = count;
      data.result = result;
      return data;
    } else if (condition.platform === 'farm') {
      const result = await User.find({ 'platform_role.farm': { $exists: true } }, null, { create_time: -1, skip, limit });
      const count = await User.count({ 'platform_role.farm': { $exists: true } });
      data.total_count = count;
      data.result = result;
      return data;
    } else if (condition.platform === 'camera') {
      const result = await User.find({ 'platform_role.camera': { $exists: true } }, null, { create_time: -1, skip, limit });
      const count = await User.count({ 'platform_role.camera': { $exists: true } });
      data.total_count = count;
      data.result = result;
      return data;
    } else {
      data.error = '还没有该平台！';
      return data;
    }

  } catch (e) {
    throw new ServerError(e.toString());
  }
}

/**
 * 重置平台管理员用户密码
 * @param id
 * @param password
 * @returns {Promise.<void>}
 */
export async function resetPlatformUserPass(id, password) {
  try {
    const salt = randomstring.generate(24);
    const user = await User.findByIdAndUpdate(id, {
      salt,
      password: sha256(password + salt),
    }, {
      new: true, // 声明返回更新后的数据
      runValidators: true,
    });
    return user ? user.toObject() : null;
  } catch (e) {
    if (e instanceof ClientError) {
      throw e;
    }
    throw new ServerError(e.toString());
  }
}

/**
 * 管理平台更新用户信息
 * @param mobile
 * @param updateInfo
 */
export async function updateUser(conditions, updateInfo) {
  if (updateInfo.delplatformrole) {
    try {
      console.log(conditions);
      const result = await User.findOneAndUpdate(conditions, { $unset: { platform_role: '' } }, { new: true });
      return result;
    } catch (e) {
      throw new ServerError(e.toString());
    }
  }
  try {
    console.log(updateInfo);
    const result = await User.findOneAndUpdate(conditions, { $set: updateInfo }, { new: true });
    return result;
  } catch (e) {
    throw new ServerError(e.toString());
  }
}
/**
 * 管理平台 冻结用户 删除用户 重置密码 清空token
 * @returns {Promise.<void>}
 */
export async function deleteUserToken(userInfo) {
  console.log('======del  user tokens ======');
  const userId = `uid:${userInfo._id || userInfo.id}`;
  const tokens = await rc.multi().smembers(userId).execAsync();
  if (tokens && tokens[0] && tokens[0].length) {
    const key = tokens[0].map((token) => {
      return `sid:${token}`;
    });
    await rc.del(key);
  }
  await rc.del(userId);
}
