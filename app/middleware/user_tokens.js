/**
 * Created by wuyanming on 2017/8/23.
 */
import _ from 'lodash';
import { redisClient as redis } from '../services/redis';

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
