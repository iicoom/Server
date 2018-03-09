import Message from '../models/message';
import ServerError from '../util/Errors/ServerErrors.js';

const { MsgClient, MsgCode } = require('msg_client'); // 消息队列
const config = require('../../config');
const { MsgTpl } = require('../util/msgTpl');

const { msgConfig } = config;
const msgClient = new MsgClient(msgConfig);

/**
 * 发送消息,保存消息
 * @param msg
 * @param cb
 */
export const sendMsg = async (msgInfo) => {
  console.log('msg.sendMsg');
  try {
    console.log(msgInfo);
    const msg = await Message.create(msgInfo);
    return msg ? msg.toJSON() : null;
  } catch (e) {
    throw new ServerError(e.toString());
  }
};

/**
 * 查询消息
 * @param condition
 * @param sorts
 * @param skip
 * @param limit
 * @param cb
 */
export const queryMsg = async (condition, sorts, skip, limit) => {
  console.log('msg.queryMsg');
  // (typeof condition === 'function') && ((cb = condition) && (condition = undefined));
  // (typeof sorts === 'function') && ((cb = sorts) && (sorts = undefined));
  // (typeof skip === 'function') && ((cb = skip) && (skip = undefined));
  // (typeof limit === 'function') && ((cb = limit) && (limit = undefined));

  const option = {};
  option.sort = {};
  if (sorts) {
    for (const sortkey in sorts) {
      option.sort[sortkey] = sorts[sortkey];
    }
  }
  if (skip !== undefined) {
    option.skip = skip;
  }
  if (limit !== undefined) {
    option.limit = limit;
  }

  try {
    const msgList = await Message.find(condition, option);
    return msgList ? msgList.toJSON() : null;
  } catch (e) {
    throw new ServerError(e.toString());
  }
};

// /**
//  * 查询消息详情
//  * @param id
//  * @param cb
//  */
// exports.getMsg = function (id, cb) {
//   console.log('msg.getMsg');
//   Msg.qFind({ _id: id })
//     .then((msgs) => {
//       let msg;
//       if (msgs.length == 1) {
//         msg = msgs[0];
//       }
//       cb && cb(null, msg);
//     }).catch((err) => {
//       cb && cb(err);
//     });
// };
//
// /**
//  * 查询消息数量
//  * @param condition
//  * @param cb
//  */
// exports.queryMsgCount = function (condition, cb) {
//   console.log('msg.queryMsgCount');
//   Msg.qCount(condition)
//     .then((count) => {
//       cb && cb(null, count);
//     }).catch((err) => {
//       cb && cb(err);
//     });
// };
//
// /**
//  * 删除消息
//  * @param sheepId
//  * @param cb
//  */
// exports.deleteMsg = function (msgId, cb) {
//   console.log('msg.deleteMsg');
//   Msg.qRemove({ _id: msgId })
//     .then(() => {
//       cb && cb();
//     })
//     .catch((err) => {
//       console.log(err);
//       cb && cb(err);
//     });
//
// };


/**
 * 发送欢迎消息
 * @param userId
 */
export const sendWelMsg = (userId) => {
  console.log('system_msg.sendWelMsg');
  this.sendMsg(userId, MsgTpl.RegistSuc);
};

/**
 * 发送羊只进场消息
 */
export const notifySheepEnter = (sheepIds) => {
  const data = {
    productType: batch.product_type,
    productUnit: constant._productUnit(batch.product_type),
    mainTitle: batch.main_title,
    orderCode: orderInfo.order_code,
  };
  msgClient.sendMessage(MsgCode.ranchEnterNotify, data, orderInfo.user_id);
};