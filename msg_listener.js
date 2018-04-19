import redis from 'redis';

import sendMsg from './app/manage/msgManage';
import config from './config';

import Queue from './app/libs/reliable-queue';

const queue = new Queue({
  namespace: 'msg_send',
  redis: redis.createClient(config.redis),
  successManualy: true,  // optional
});

queue.on('job', async (job) => {
  console.log('============sendMsgListener start===========');
  console.log(job);
  const { id } = job.data;
  await sendMsg(id);
  queue.success();
});
