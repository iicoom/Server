import Promise from 'bluebird';
import kue from 'kue';
import config from './config';
import {
  finishOrderPayReward,
} from './app/manage/orderManage';

import log from './app/util/log';
// import later from 'later';
import { rc as redis } from './app/services/redis';
import Utility from './app/util/utils';

const logger = log.getLogger('task_consume');
logger.setLevel('INFO');

logger.info(config.redis);
// 消息队列
const jobs = kue.createQueue({
  prefix: 'task_consume',
  redis: {
    db: 4,
    port: config.redis.port,
    host: config.redis.host,
    auth: config.redis.auth_pass,
  },
});

const interval = 5 * 1000; // 工作卡住5s主动获取
jobs.watchStuckJobs(interval);

// 任务是否进行中检验
const checkTaskProceed = async (key) => {
  return new Promise((resolve, reject) => {
    redis.getAsync(key)
      .then((data) => {
        logger.info(`checkTaskProceed::getAsync::${key}::${data}`);
        if (data) {
          return resolve(true);
        } else {
          redis.multi().incr(key).expire(key, 12 * 60 * 60 * 1000).execAsync()
            .then((data) => {
              logger.info(`checkTaskProceed::incr::${key}::${data}`);
              resolve(data > 1);
            });
        }
      });
  });
};

// 去除任务进行队列
const killTaskProceed = async (key) => {
  return new Promise((resolve, reject) => {
    logger.info(`killTaskProceed::del::${key}`);
    redis.del(key);
    resolve();
  });
};

/**
 * 签到任务消费
 */
// jobs.process('task_consume_signIn', 5, async (job, done) => {
//   logger.info('===task_consume_signIn===');
//   logger.info(job.data);
//   const taskKey = `task_consume_signIn:${digest(JSON.stringify(job.data))}::${job.id}`;
//   try {
//     const isProceed = await checkTaskProceed(taskKey);
//     logger.info('task_consume_signIn：：isProceed', isProceed);
//     if (isProceed) {
//       return done(JSON.stringify({ isProceed }));
//     }
//     const result = await signReward(job.data);
//     logger.info('===task_consume_signIn===result===');
//     logger.info(result);
//     done(null, JSON.stringify(result));
//     job.remove((err) => {
//       if (err) throw err;
//       logger.info('removed completed task_consume_signIn #%d', job.id);
//     });
//   } catch (err) {
//     logger.error('===task_consume_signIn===err===');
//     logger.error(err);
//     done(JSON.stringify(err));
//     await killTaskProceed(taskKey);
//   }
// });

/**
 * 购买羊消费（订单的状态）
 */
// By default a call to queue.process() will only accept one job at a time for processing.
// For small tasks like sending emails this is not ideal,
// so we may specify the maximum active jobs for this type by passing a number:2
jobs.process('task_consume_buySheep', async (job, done) => {
  logger.info('===task_consume_buySheep===');
  logger.info(job.data);
  const taskKey = `task_consume_buySheep:${Utility.digest(JSON.stringify(job.data))}`;
  try {
    const isProceed = await checkTaskProceed(taskKey);
    logger.info('task_consume_buySheep：：isProceed', isProceed);
    if (isProceed) {
      return done(JSON.stringify({ isProceed }));
    }
    const result = await finishOrderPayReward(job.data.orderId);
    logger.info('===task_consume_buySheep===result===');
    logger.info(result);
    done(null, JSON.stringify(result));
    job.remove((err) => {
      if (err) throw err;
      logger.info('removed completed task_consume_buySheep #%d', job.id);
    });
  } catch (err) {
    logger.error('===task_consume_buySheep===err===');
    logger.error(err);
    done(JSON.stringify(err));
    await killTaskProceed(taskKey);
  }
});
