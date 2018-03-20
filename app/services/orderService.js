import Order from '../models/order';
import BaseService from './BaseService';

class OrderService extends BaseService {

  constructor() {
    super(Order);
  }
}

export default OrderService;

// export async function createOrder(orderInfo) {
//   try {
//     const result = await Order.create(orderInfo);
//     return result;
//   } catch (e) {
//     console.log(e);
//   }
// }
