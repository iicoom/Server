import Order from '../models/order';
import BaseService from './BaseService';

class OrderService extends BaseService {

  constructor() {
    super(Order);
  }
}

export default OrderService;
