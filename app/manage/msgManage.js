import _ from 'lodash';
import ejs from 'ejs';
import log4js from '../util/log';
import { MsgBodyService, MsgLinkService, MsgTplService, SysMsgService } from '../services';

const logger = log4js.getLogger('sendMsg');
const { msgSendType, msgBodyState } = require('../util/constant');

// const sendMsgFactory = (sendType) => {
//   let server;
//   if (sendType === msgSendType.SYS) {
//     server = new SysMsgService();
//   } else if (sendType === msgSendType.WX) {
//     server = new SysMsgService();
//   }
//
//   return server;
// };

export default async (id) => {
  const msgBodyInfo = await MsgBodyService.findById(id);
  console.log(msgBodyInfo);
  if (msgBodyInfo) {
    console.log('=======sendMsg start ======');
    const msgLinkInfo = await MsgLinkService.findOne({ code: msgBodyInfo.link_code });
    console.log(msgLinkInfo)
    const errors = [];
    if (msgLinkInfo && msgLinkInfo.msg_tpl) {
      msgLinkInfo.msg_tpl.forEach(async (tplId) => {
        const msgTplInfo = await MsgTplService.findById(tplId);
        const sendType = msgTplInfo.type;
        if (msgSendType.SYS === sendType) {
          if (_.isArray(msgBodyInfo.send_to)) {
            msgBodyInfo.send_to.map(async (userId) => {
              console.log('======sys======');
              const content = ejs.render(msgTplInfo.content, msgBodyInfo.content);
              console.log(content);
              const result = await SysMsgService.send(msgLinkInfo.type, userId, content);
              if (!result.id) {
                errors.push({ sendType, userId, result });
              }
            });
          }
        }
      });
    }
    if (errors && errors.length > 0) {
      logger.info('===========sendMsg error============');
      await MsgBodyService.findByIdAndUpdate(id, { state: msgBodyState.failed, remark: errors });
    } else {
      logger.info('===========sendMsg success============');
      await MsgBodyService.findByIdAndUpdate(id, { state: msgBodyState.success });
    }
  } else {
    logger.error(`id为${id}的msgBody不存在!`);
  }
};

