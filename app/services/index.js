/**
 * Created by bj on 16/7/28.
 */
import News_Service from './NewsService';
import Order_Service from './orderService';
import Topic_Service from './TopicService';
import Reply_Service from './ReplyService';
import UserHistory_Service from './UserHistoryService';
import MsgBody_Service from './MsgBodyService';
import MsgLink_Service from './MsgLinkService';
import MsgTpl_Service from './MsgTplService';
import SysMsg_Service from './SysMsgService';


export const newsService = new News_Service();
export const OrderService = new Order_Service();
export const TopicService = new Topic_Service();
export const ReplyService = new Reply_Service();
export const UserHistoryService = new UserHistory_Service();
export const MsgBodyService = new MsgBody_Service();
export const MsgLinkService = new MsgLink_Service();
export const MsgTplService = new MsgTpl_Service();
export const SysMsgService = new SysMsg_Service();


// export {
//   AnnouncementService, OrderService,
// };
