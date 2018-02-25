import announcement from '../models/announcement';
import BaseService from './BaseService';

class AnnouncementService extends BaseService {

  constructor() {
    super(announcement);
  }
}

export default AnnouncementService;
