import msgTpl from '../models/msgTpl';
import BaseService from './BaseService';
// import ServerError from '../util/Errors/ServerErrors';

class MsgTplService extends BaseService {

  constructor() {
    super(msgTpl);
  }

}

export default MsgTplService;
