import redis from 'redis';
import bluebird from 'bluebird';
import config from '../../config';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export function createRedisClient (opt) {
  var rc = redis.createClient(opt.port, opt.host,opt);
  rc.on('error', function(err) {
    console.error('Redis Error: %s, %s', opt.host, err);
  });

  rc.on('end', function(err) {
    console.log('Redis end: %s, %s', opt.host, err);
  });

  rc.on('ready', function(err) {
    console.log('Redis ready: %s, %s', opt.host, err);
  });

  return rc;
}
export default createRedisClient(config.redis);