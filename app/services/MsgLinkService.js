import msgLink from '../models/msgLink';
import BaseService from './BaseService';
// import ServerError from '../util/Errors/ServerErrors';

class MsgLinkService extends BaseService {

  constructor() {
    super(msgLink);
  }

}

export default MsgLinkService;
