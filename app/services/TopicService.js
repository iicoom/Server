import Topic from '../models/topic';
import BaseService from './BaseService';
import ServerError from '../util/Errors/ServerErrors';

class TopicService extends BaseService {

  constructor() {
    super(Topic);
  }

  updateReplyById = async (id, condition) => {
    try {
      const result = await Topic.findByIdAndUpdate(id, condition);
      return result ? result.toJSON() : null;
    } catch (ex) {
      console.log(ex.message);
      throw new ServerError({ msg: `更新记录失败原因:${ex.message}` });
    }
  }
}

export default TopicService;
