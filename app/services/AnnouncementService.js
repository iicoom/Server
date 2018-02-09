import { Announcement } from '../models';
import BaseService from './BaseService';

class AnnouncementService extends BaseService {

  constructor() {
    super(Announcement);
  }
}

export default AnnouncementService;
