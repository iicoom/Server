/**
 * Created by wuyanming on 2017/8/23.
 */
import _ from 'lodash';
import { redisClient as redis } from '../services/redis';
import constant from '../util/constant';

// 同一用户在不同设备登录会生成不同session
export async function setUserTokens(ctx, next) {
  console.log('======login success will set tokens ======');
  await next();  // 密码用户名失败后仍会继续执行
  const userInfo = (ctx.session && ctx.session.userInfo) || null;
  const token = ctx.sessionId || userInfo.token;
  if (userInfo && userInfo.id && token) {
    console.log(`userId:${userInfo.id},sessionId:${token}`);
    const userId = `uid:${userInfo.id}`;
    const tokens = await redis.multi().smembers(userId).execAsync(); // 把sessionId和userId关联，userId[session1,session2]
    console.log(tokens);
    console.log(`tokens:${tokens}`);
    if (tokens && tokens[0] && tokens[0].length > 0 && userInfo.role_type === constant.RoleType.User) {
      _.remove(tokens, (n) => {
        return _.eq(token, n);
      }); // remove 掉的是和新生成的token不相等的值
      console.log(`newTokens:${tokens}`);
      const key = tokens[0].map((token) => {
        return `sid:${token}`;
      });
      await redis.del(key);
    }
    await redis.del(userId);
    await redis.sadd(userId, token);
  }
}
// 退出登录  先获取session 
export async function removeUserTokens(ctx, next) {
  console.log('======remove tokens ======', ctx.session);
  const userInfo = (ctx.session && ctx.session.userInfo) || null;
  const token = ctx.sessionId || userInfo.token;
  await next();
  if (userInfo && userInfo.id && token) {
    const key = `uid:${userInfo.id}`;
    await redis.srem(key, token);
  }
}
// 修改密码 先获取session 后执行next()
// 忘记密码 无session 获取userId 用userId 删除token
export async function deleteUserTokens(ctx, next) {
  console.log('======del tokens ======');
  const userInfo = (ctx.session && ctx.session.userInfo) || null;
  await next();
  let userId = userInfo && userInfo.id || ctx.userId || null;
  console.log('======next end ======');
  if (userId) {
    userId = `uid:${userId}`;
    const tokens = await redis.multi().smembers(userId).execAsync();
    if (tokens && tokens[0] && tokens[0].length) {
      const key = tokens[0].map((token) => {
        return `sid:${token}`;
      });
      await redis.del(key);
    }
    await redis.del(userId);
  }
}
