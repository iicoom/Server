/**
 * Created by feng on 2016/12/21.
 */
import { OrderService } from '../services';
// import tasksService from '../services/tasksService';
// import recommendRecordService from '../services/recommendRecordService';
// import rewardService from '../services/rewardService';
// import userService from '../services/userService';
// import batchService from '../services/batchService';
// import productService from '../services/productService';
// import {sendReward} from './rewardManage';
// import {sendRewardMsg} from './sysMsgManage';
// import {OrderState, TaskCode, TaskClass, ProductType} from '../util/constant';

import log from '../util/log';

const logger = log.getLogger('task_consume_order');

/**
 * 完成订单支付奖励
 * @param orderId
 */
export const finishOrderPayReward = async (orderId) => {
  // 检查云币情况，赠送云币
  logger.info('===finishOrderPayReward===', orderId);
  // 检验订单是否存在
  const order = await OrderService.findById(orderId);
  if (!order) {
    logger.warn('订单号：%s, 订单不存在', orderId);
    return;
  }

  return { state: 'success' };

  // 检验订单是否支付完成
  // if (order.state !== OrderState.Finish && order.state !== OrderState.Payed) {
  //   logger.warn('订单号：%s, 订单状态：%s, 订单未支付', orderId, order.state);
  // }

  // try {
  //   logger.info('订单号：%s, 邀请好友投资奖励：begin', orderId);
  //   await inviteFriendsInvestReward(order);
  //   logger.info('订单号：%s, 邀请好友投资奖励: end', orderId);
  // } catch (err) {
  //   logger.error('订单号：%s, 邀请好友投资奖励: error', orderId);
  //   logger.error(err);
  // }
  //
  // try {
  //   logger.info('订单号：%s, 投资奖励：begin', orderId);
  //   await investReward(order);
  //   logger.info('订单号：%s, 投资奖励: end', orderId);
  // } catch (err) {
  //   logger.error('订单号：%s, 投资奖励: error', orderId);
  //   logger.error(err);
  // }
};

