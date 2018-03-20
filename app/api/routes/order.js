import ClientError from '../../util/Errors/ClientErrors';
import config from '../../../config';
import ErrorCode from '../../util/Errors/ErrorCode';
import Utility from '../../util/utils';


const kue = require('kue');

const { Job } = kue;


// 消息队列
const queue = kue.createQueue({
  prefix: 'order-queue',
  redis: {
    db: config.queueDB,
    port: config.port,
    host: config.host,
    // auth: rcc.auth_pass,
  },
});

const ParamError = (ctx) => {
  const error = new ClientError(ErrorCode.ErrorParams);
  ctx.status = 400;
  error.errors = ctx.errors;
  // throw error; 返回结果比较混乱
  ctx.body = error;
};

export default (router) => {
  router
    .post('/order/job', async (ctx) => {
      const uid = ctx.checkBody('uid').notEmpty('').value;
      const num = ctx.checkBody('num').notEmpty('').value;

      if (ctx.errors && ctx.errors.length > 0) {
        ParamError(ctx);
        return;
      }

      async function createJob() {
        return new Promise((resolve, reject) => {
          const job = queue.create('order', {
            user_id: uid,
            sheep_num: num,
            order_code: Utility.generateOrderCode(),
          }).attempts(3).backoff(true)
            .save((err) => {
              if (!err) {
                resolve(job);
              }
              reject(new ClientError('order create failed，please try again！'));
            });
        });
      }
      const jobInfo = await createJob();
      ctx.body = { jobId: jobInfo.id };
    })
    .get('/order/job/:id/state', async (ctx) => {
      const { id } = ctx.params;

      async function getJob() {
        return new Promise((resolve) => {
          Job.get(id, (err, job) => {
            if (!err) {
              const state = job.state();
              const { result } = job;
              // console.log(job) 此时结果还没有取回
              console.log(`====job==${id}====::${state}====::${JSON.stringify(result || '')}`);
              resolve(job);
            } else {
              throw new ClientError(`id为${id}的job查询失败！`);
            }
          });
        });
      }
      const jobInfo = await getJob();
      ctx.body = { jobInfo };
    })
    .get('/order', async (ctx) => {
      ctx.body = '丢雷老母';
    });
};
