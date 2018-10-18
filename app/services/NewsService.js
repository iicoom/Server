import News from '../models/news';
import BaseService from './BaseService';

class NewsService extends BaseService {

  constructor() {
    super(News);
  }
}

export default NewsService;
