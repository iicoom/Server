import MsgTpl from '../models/msgTpl';
import ClientError from '../util/Errors/ClientErrors.js';
import ServerError from '../util/Errors/ServerErrors.js';

const resource = 'msg_tpl';
/**
 * 创建消息模板
 * @param tplInfo
 * @returns {Promise}
 */
export const createMsgTpl = async (tplInfo) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const tpl = await MsgTpl.findOne({ name: tplInfo.name, type: tplInfo.type });
        if (!tpl) {
          const tpldata = await MsgTpl.create(tplInfo);
          resolve(tpldata ? tpldata.toJSON() : null);
        } else {
          const error = new ClientError('此模板已经存在');
          error.push(new ClientError.AlreadyExistsError(resource, 'name'));
          reject(error);
        }
      } catch (e) {
        reject(new ServerError(e.toString()));
      }
    })();
  });
};

/**
 * 查询消息模板列表
 * @param condition
 * @param page
 * @param size
 * @returns {Promise.<{}>}
 */
export async function loadMsgTpl(condition, { page, size }) {
  const skip = (page - 1) * size;
  const limit = size;
  console.log(`${limit}ssss${skip}`);
  try {
    const list = await MsgTpl.find(condition, null, {
      sort: { create_at: -1 },
      skip,
      limit,
    });
    const total = await MsgTpl.count(condition);
    return { total, page, size, list };
  } catch (e) {
    throw new ServerError(e.toString());
  }
}

export async function findById(id) {
  try {
    const msgtpl = await MsgTpl.findById(id);
    return msgtpl ? msgtpl.toJSON() : null;
  } catch (e) {
    throw new ServerError(e.toString());
  }
}

/**
 * 更新消息模板
 * @param condition
 * @param updateInfo
 * @returns {Promise.<null>}
 */
export async function updateMsgTpl(condition, updateInfo) {
  try {
    const result = await MsgTpl.findOneAndUpdate(condition, { $set: updateInfo }, { new: true });
    return result ? result.toJSON() : null;
  } catch (e) {
    throw new ServerError(e.toString());
  }
}

/**
 * 删除消息模板
 * @param condition
 * @returns {Promise.<null>}
 */
export async function removeMsgTpl(condition) {
  try {
    const result = await MsgTpl.findByIdAndRemove(condition);
    return result ? result.toJSON() : null;
  } catch (e) {
    throw new ServerError(e.toString());
  }
}

export const getMsgTplInfo = async (id) => {
  console.log('=========msgTplService=======');
  console.log(id);
  try {
    const msgTplInfo = await MsgTpl.findOne({ _id: id });
    console.log('-------------');
    console.log(msgTplInfo);
    return msgTplInfo ? msgTplInfo.toJSON() : null;
  } catch (e) {
    throw new ServerError(e.toString());
  }

};

