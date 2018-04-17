import UserHistory from '../models/userHistory';
import BaseService from './BaseService';
import ServerError from '../util/Errors/ServerErrors';

class UserHistoryService extends BaseService {

  constructor() {
    super(UserHistory);
  }

  updateUserHistoryByUid = async (id, condition) => {
    try {
      const result = await UserHistory.update({ uid: id }, condition);
      console.log(result);
      return result || null;
    } catch (ex) {
      console.log(ex.message);
      throw new ServerError({ msg: `更新记录失败原因:${ex.message}` });
    }
  }
}

export default UserHistoryService;
