import { ReplyService, TopicService, UserHistoryService } from '../../services';
import ClientError from '../../util/Errors/ClientErrors';
import ErrorCode from '../../util/Errors/ErrorCode';
import { needLogin, needAdmin } from '../../middleware/auth';

const ParamError = (ctx) => {
  const error = new ClientError(ErrorCode.ErrorParams);
  ctx.status = 400;
  error.errors = ctx.errors;
  ctx.body = error;
};

export default (router) => {
  router
  // 创建话题
    .post('/reply', async (ctx) => {
      const replyInfo = {
        topic_id: ctx.checkBody('topic_id').notEmpty('话题ID不能为空！').trim().value,
        type: ctx.checkBody('type').notEmpty('话题类型不能为空！').trim().value,
        reply_creator: ctx.checkBody('reply_creator').notEmpty('回复创建者不能为空！').trim().value,
        reply_to: ctx.checkBody('reply_to').notEmpty('被回复者不能为空！').trim().value,
        content: ctx.checkBody('content').notEmpty('内容不能为空！').trim().value,
      };
      if (ctx.errors && ctx.errors.length > 0) {
        ParamError(ctx);
        return;
      }

      const newReply = await ReplyService.create(replyInfo);
      await TopicService.updateReplyById(replyInfo.topic_id, { $inc: { replied_num: 1 } });
      await UserHistoryService.updateUserHistoryByUid(replyInfo.reply_creator, { $push: { replies: newReply.id } });
      ctx.body = newReply;
    })
  // 获取话题列表
    .get('/reply', async (ctx) => {
      const condition = {};
      // if (ctx.session.userInfo.role_type === constant.RoleType.User) {
      //   condition.state = 'publish';
      // } else if (ctx.session.userInfo.role_type === constant.RoleType.Administor) {
      //   const { title, end_time, start_time, state, type } = ctx.query;
      //   title && (condition.title = { $regex: title });
      //   start_time && (condition.end_time = { $gt: start_time });
      //   end_time && (condition.start_time = { $lt: end_time });
      //   state && (condition.state = state);
      //   type && (condition.type = type);
      // }
      const opt = {
        sort: { create_time: -1 },
        limit: ctx.query.size || 15,
        skip: ctx.query.page || 0,
      };
      const result = await AnnouncementService.find(condition, {}, opt);
      const total = await AnnouncementService.count(condition, {}, opt);
      ctx.body = { result, total };
    })
  // 获取话题详情
    .get('/reply/:id', needLogin, async (ctx) => {
      const anId = ctx.params.id;
      ctx.body = await AnnouncementService.findById(anId);
    })
  // 获取最新一条
    .get('/lastone', needLogin, async (ctx) => {
      const userId = ctx.session.userInfo._id.toString();
      const userInfo = await UserService.findById(userId);
      const announce_lversion = userInfo.announce_lversion || 0;
      const nowTime = Date.now();
      const condition = {
        version: { $gt: announce_lversion },
        end_time: { $gt: nowTime },
        start_time: { $lt: nowTime },
        state: 'publish',
      };
      const opt = {
        sort: { version: -1 },
        skip: ctx.query.page || 0,
        limit: ctx.query.size || 15,
      };
      const result = AnnouncementService.find(condition, {}, opt);
      ctx.body = result;
    })
  // 编辑话题
    .put('/reply/:id', needAdmin, async (ctx) => {
      const updateInfo = {
        title: ctx.checkBody('title').notEmpty('标题不能为空！').trim().value,
        type: ctx.checkBody('type').notEmpty('类型不能为空！').trim().value,
        start_time: ctx.checkBody('start_time').notEmpty('开始时间不能为空！').trim().value,
        end_time: ctx.checkBody('end_time').notEmpty('结束时间不能为空！').trim().value,
        full_content: ctx.checkBody('full_content').notEmpty('内容不能为空！').trim().value,
        abstract: ctx.checkBody('abstract').notEmpty('摘要不能为空！').trim().value,
        link_name: ctx.checkBody('link_name').notEmpty('链接名字不能为空！').trim().value,
        link_addr: ctx.checkBody('link_addr').notEmpty('链接地址不能为空！').trim().value,
        link_is_show: ctx.checkBody('link_is_show').notEmpty('链接状态不能为空！').trim().value,
        state: ctx.checkBody('state').notEmpty('话题状态不能为空！').trim().value,
      };
      if (ctx.errors && ctx.errors.length > 0) {
        ParamError(ctx);
      }
      if (updateInfo.start_time > updateInfo.end_time) {
        throw new ClientError('结束时间必须大于开始时间');
      }
      const opt = { new: true };
      const result = await AnnouncementService.update(updateInfo, {}, opt);
      ctx.body = result;
    })
  // 删除话题
    .delete('/reply/:id', needAdmin, async (ctx) => {
      const anId = ctx.params.id;
      const ready = await AnnouncementService.findById(anId);
      if (ready) {
        const result = await AnnouncementService.findByIdAndRemove(anId);
        ctx.body = result;
      } else {
        const error = new ClientError(ErrorCode.ErrorParams);
        throw error;
      }
    });
};
