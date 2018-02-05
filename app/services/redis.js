import redis from 'redis';
import bluebird from 'bluebird';
import config from '../../config';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export function createRedisClient(opt) {
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
export default createRedisClient(config.redis);
