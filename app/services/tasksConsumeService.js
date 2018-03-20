/**
 * Created by feng on 2016/12/13.
 */
import kue from 'kue';
import config from '../../config';

const tasksConsumeService = {};

// 任务消费
const jobs = kue.createQueue({
  prefix: 'task_consume',
  redis: {
    db: 4,
    port: config.redis.port,
    host: config.redis.host,
    auth: config.redis.auth_pass,
  },
});

/**
 * 发送数据
 * @param type 队列消费类型
 * @param data
 */
tasksConsumeService.sendData = (type, data) => {
  return new Promise((resolve, reject) => {
    console.log(`======task_consume_${type}========`);
    console.dir(data);
    const job = jobs.create(`task_consume_${type}`, data)
      .attempts(3)
      .removeOnComplete(true)
      .backoff(true)
      .ttl(10 * 1000)
      .save((err) => {
        if (err) {
          console.error(`======task_consume_${type}========`);
          return reject(err);
        }
        return resolve(job);
      });
  });
};

export default tasksConsumeService;
