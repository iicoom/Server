import { newsService, UserService } from '../../services';
import ClientError from '../../util/Errors/ClientErrors';
import ErrorCode from '../../util/Errors/ErrorCode';
import { needLogin, needAdmin } from '../../middleware/auth';
import constant from '../../util/constant';

const ParamError = (ctx) => {
  const error = new ClientError(ErrorCode.ErrorParams);
  ctx.status = 400;
  error.errors = ctx.errors;
  ctx.body = error;
};

export default (router) => {
  router
  // 创建资讯
    .post('/news', async (ctx) => {
      const newsInfo = {
        title: ctx.checkBody('title').notEmpty('标题不能为空！').trim().value,
        // type: ctx.checkBody('type').notEmpty('类型不能为空！').trim().value,
        abstract: ctx.checkBody('abstract').notEmpty('摘要不能为空！').trim().value,
        content: ctx.checkBody('content').notEmpty('内容不能为空！').trim().value,
        image_url: ctx.checkBody('image_url').notEmpty('图片链接不能为空！').trim().value,
        // link: ctx.checkBody('link_addr').notEmpty('链接地址不能为空！').trim().value,
        // state: ctx.checkBody('state').notEmpty('资讯状态不能为空！').trim().value,
      };
      if (ctx.errors && ctx.errors.length > 0) {
        ParamError(ctx);
        return;
      }
      // if (newsInfo.start_time > newsInfo.end_time) {
      //   throw new ClientError('结束时间必须大于开始时间');
      // }

      ctx.body = await newsService.create(newsInfo);
    })
  // 获取资讯列表
    .get('/news', async (ctx) => {
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
      const list = await newsService.find(condition, {}, opt);
      const total = await newsService.count(condition, {}, opt);
      const page = opt.skip + 1;
      const size = opt.limit;
      ctx.body = { total, page, size, list };
    })
  // 获取资讯详情
    .get('/news/:id', /*needLogin,*/ async (ctx) => {
      const anId = ctx.params.id;
      ctx.body = await newsService.findById(anId);
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
      const result = newsService.find(condition, {}, opt);
      ctx.body = result;
    })
  // 编辑资讯
    .put('/news/:id', /*needAdmin,*/ async (ctx) => {
      const { id } = ctx.params;
      const updateInfo = {
        title: ctx.checkBody('title').notEmpty('标题不能为空！').trim().value,
        // type: ctx.checkBody('type').notEmpty('类型不能为空！').trim().value,
        abstract: ctx.checkBody('abstract').notEmpty('摘要不能为空！').trim().value,
        content: ctx.checkBody('content').notEmpty('内容不能为空！').trim().value,
        image_url: ctx.checkBody('image_url').notEmpty('图片链接不能为空！').trim().value,
        // link: ctx.checkBody('link_addr').notEmpty('链接地址不能为空！').trim().value,
        // state: ctx.checkBody('state').notEmpty('资讯状态不能为空！').trim().value,
      };
      if (ctx.errors && ctx.errors.length > 0) {
        ParamError(ctx);
      }
      const result = await newsService.findByIdAndUpdate(id, updateInfo);
      ctx.body = result;
    })
  // 删除资讯
    .delete('/news/:id',/* needAdmin,*/ async (ctx) => {
      const anId = ctx.params.id;
      const ready = await newsService.findById(anId);
      if (ready) {
        const result = await newsService.findByIdAndRemove(anId);
        ctx.body = result;
      } else {
        const error = new ClientError(ErrorCode.ErrorParams);
        throw error;
      }
    });
};
