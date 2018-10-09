import Msg from '../models/message';
// import log from '../util/log';

// const logger = log.getLogger('system-msg');
// logger.setLevel('DEBUG');

class SysMsgServer {

  /**
   * 发送系统消息
   * @param type
   * @param userId
   * @param content
   * @returns {*}
   */
  async send(type, userId, content) {
    const msg = {
      type,
      to_user: userId,
      content,
    };
    return await this.sendMsg(msg);
  }

  /**
   * 保存系统消息
   * @param doc
   */
  async save(doc) {
    let msg = new Msg(doc);
    msg = await msg.save();
    return msg.toObject();
  }

  /**
   * 发送消息
   * @param msg
   */
  async sendMsg(msg) {
    return await this.save(msg);
  }

  /**
   * 按条件查询数量
   * @param condition
   * @returns {*}
   */
  async count(condition) {
    return await Msg.count(condition);
  }
}

export default SysMsgServer;
