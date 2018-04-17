/**
 * Created by bj on 16/7/28.
 */
import Announcement_Service from './AnnouncementService';
import Order_Service from './orderService';
import Topic_Service from './TopicService';
import Reply_Service from './ReplyService';
import UserHistory_Service from './UserHistoryService';

export const AnnouncementService = new Announcement_Service();
export const OrderService = new Order_Service();
export const TopicService = new Topic_Service();
export const ReplyService = new Reply_Service();
export const UserHistoryService = new UserHistory_Service();


// export {
//   AnnouncementService, OrderService,
// };
