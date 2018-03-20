import _ from 'lodash';
import config from './config';

const { MsgClient, MsgCode } = require('msg_client');
const { hgetall } = require('./app/services/redis');
const { OrderService } = require('./app/services');
// const sysMsgService = require('./service/system_msg');
// const tasksConsumeService = require('./service/tasksConsume');
const msgClient = new MsgClient(config.msgConfig);

const kue = require('kue');
// 消息队列
const queue = kue.createQueue({
  prefix: 'order-queue',
  redis: {
    db: 5,
    port: 6379,
    host: '127.0.0.1',
  },
});

// 处理队列卡住问题
queue.watchStuckJobs(5000);

queue.on('error', (err) => {
  // logger.error('kue error::>');
  // logger.error(err);
  console.log('kue error::>');
  console.log(err);
});

const checkQueueState = function (key, cb) {
  return hgetall(key, (err, job) => {
    if (err) {
      return cb(err);
    }
    cb(null, job);
  });
};

queue.process('order', (job, done) => {
  console.log('order-job-data:\n', `job.id: ${job.id}\n`, job.data);
  const jobKey = `order-queue:job:${job.id}`;

  (async () => {
    // 查询redis队列中job的状态
    checkQueueState(jobKey, (err, jobInfo) => {
      if (!err) {
        // console.log(jobInfo);
        if (jobInfo.state === 'complete') {
          console.log(`====job==${job.id}==state::>`, job.state());
          console.log(`====job==${job.id}====result::>`, job.result);
          return done(null, job.result);
        }
      } else {
        throw err;
      }
    });

    const order = await autoCreateOrder(job.data);
    console.log(`===${job.id}===【${order.order_code}】===orderId=${order._id}`);
    // 发送系统消息
    if (order && !_.isEmpty(order.order_code)) {
      // logger.debug('order: create order message with order code: ', order.order_code);
      msgClient.sendMessage(MsgCode.ranchCreateOrder, { orderCode: order.order_code }, [order.user_id]);

    }
  })();

  done();
});

async function autoCreateOrder(data) {
  console.log(data);
  const result = await OrderService.create(data);
  return result;
}


function createOrder(orderInfo, cb) {
  q.nfcall(orderService.createOrder, orderInfo.batch_id, orderInfo.user_id, orderInfo.sheep_num, orderInfo.presentInfo, orderInfo.from)
    .then((order) => {
      console.log('0-1');
      logger.debug('source: user create order [use system message service send] \n', orderInfo);
      logger.debug('result: user create order [use system message service send] \n', order);

      if (order && !_.isEmpty(order.order_code)) {
        logger.debug('order: create order message with order code: ', order.order_code);
        // sysMsgService.sendCOrderSucMsg(orderInfo.user_id, order.order_code);
        msgClient.sendMessage(MsgCode.ranchCreateOrder, { orderCode: order.order_code }, [orderInfo.user_id]);
      } else {
        logger.debug('source: create order message without order code: ', order.order_code);
        // sysMsgService.sendCOrderSucMsg(orderInfo.user_id, null);
        msgClient.sendMessage(MsgCode.ranchCreateOrder, { orderCode: null }, [orderInfo.user_id]);
      }

      // 如果创建的订单状态是已支付 发放羊只 发送购羊信息到队列中
      logger.info('order state', order.state);
      if (order.state === OrderState.Payed) {
        const order_id = order._id.toString();
        // 将购买羊只信息放入队列中
        tasksConsumeService.sendData('buySheep', { orderId: order_id });
        // 发送付款成功消息
        sysMsgService.sendPaySucMsg(order_id, null);
        // 创建虚拟羊只
        orderService.onOrderPayed(order_id, null);
      }

      return order;
    })
    .then((order) => {
      cb(null, order);
    })
    .catch(cb);
}

