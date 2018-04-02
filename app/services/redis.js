// https://github.com/NodeRedis/node_redis
import redis from 'redis';
import bluebird from 'bluebird';

const config = {
  db: 'mongodb://127.0.0.1/koa-test',
  redis: {
    db: 5,
    port: 6379,
    host: '127.0.0.1',
  },
  session: {
    port: 6379,
    host: '127.0.0.1',
  },
};

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const noop = function () {};

function createRedisClient(opt) {
  const rc = redis.createClient(opt.port, opt.host, opt);
  rc.on('error', (err) => {
    console.error('Redis Error: %s, %s', opt.host, err);
  });

  rc.on('end', (err) => {
    console.log('Redis end: %s, %s', opt.host, err);
  });

  rc.on('ready', (err) => {
    console.log('Redis ready: %s, %s', opt.host, err);
  });

  return rc;
}


export const rc = createRedisClient(config.redis);
export const redisClient = createRedisClient(config.session);

export const get = function (key, cb) {
  if (!cb) cb = noop;
  rc.get(key, cb);
};

export const getObject = function (key, cb) {
  if (!cb) cb = noop;
  rc.get(key, (err, data) => {
    if (err) return cb(err);
    if (data) {
      try {
        data = JSON.parse(data);
        cb(null, data);
      } catch (e) {
        cb(e);
      }
    } else {
      cb();
    }
  });
};

export const hgetall = function (key, cb) {
  if (!cb) cb = noop;
  rc.hgetall(key, cb);
};


//
// /**
//  * [put description]
//  * @param  {[type]}   key    [description]
//  * @param  {[type]}   data   [description]
//  * @param  {[type]}   expire [有效期，单位秒]
//  * @param  {Function} cb     [description]
//  * @return {[type]}          [description]
//  */
// exports.set = exports.put = function (key, data, expire, cb) {
//   if (!expire) {
//     cb = noop;
//   } else if (_.isFunction(expire)) {
//     cb = expire;
//     expire = null;
//   }
//
//   rc.set(key, data, (err) => {
//     if (err) return cb(err);
//     if (expire) {
//       rc.expire(key, expire, cb);
//     } else {
//       cb();
//     }
//   });
// };
//
// exports.setObject = exports.putObject = function (key, data, expire, cb) {
//   if (!expire) {
//     cb = noop;
//   } else if (_.isFunction(expire)) {
//     cb = expire;
//     expire = null;
//   }
//
//   try {
//     data = JSON.stringify(data);
//   } catch (e) {
//     return cb(e);
//   }
//
//   rc.set(key, data, (err) => {
//     if (err) return cb(err);
//     if (expire) {
//       rc.expire(key, expire, cb);
//     } else {
//       cb();
//     }
//   });
// };
//
//
// exports.del = function (key, cb) {
//   rc.del(key, cb || noop);
// };
// // key [set]
// exports.sadd = function (key, data, expire, cb) {
//   console.log('redis.sadd');
//   if (!expire) {
//     cb = noop;
//   } else if (_.isFunction(expire)) {
//     cb = expire;
//     expire = null;
//   }
//   rc.sadd(key, data, (err) => {
//     if (err) return cb(err);
//     if (expire) {
//       rc.expire(key, expire, cb);
//     } else {
//       cb(null, data);
//     }
//   });
// };
// exports.srem = function (key, values, cb) {
//   rc.srem(key, values, cb || noop);
// };
// // 读取set
// exports.smembers = function (key, cb) {
//   console.log('redis.smember :', key);
//   if (!cb) cb = noop;
//   rc.smembers(key, (err, data) => {
//     if (err) return cb(err);
//     cb(null, data);
//   });
// };
// exports.publish = function (channel, message) {
//   rc.publish(channel, message);
// };
//
