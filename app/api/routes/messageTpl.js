/**
 * 消息模板
 * Created by mxj on 2017/11/6.
 */

import ClientError from '../../util/Errors/ClientErrors';
import ErrorCode from '../../util/Errors/ErrorCode';
import { createMsgTpl, loadMsgTpl, updateMsgTpl, removeMsgTpl, findById } from '../../services/msgTplService';
import { needLogin, needPlatFormAuth } from '../../middleware/auth';
import constant from '../../util/constant';

const platforms = constant.platforms;
const roleType = constant.RoleType;

export default (router) => {
    router
      .post('/messageTpl', needLogin, needPlatFormAuth({ message: [roleType.Administor] }), async ctx => {
          const tplInfo = {
              name: ctx.checkBody('tplName').notEmpty().trim().value, //模板名称
              content: ctx.checkBody('tplContent').notEmpty().value, //模板内容
              type: ctx.checkBody('tplType').notEmpty().trim().value //模板类型
          };
          if (ctx.errors && ctx.errors.length) {
              ctx.status = 400;
              const error = new ClientError(ErrorCode.PARAMS_ERROR);
              error.errors = ctx.errors;
              throw error;
          }

          if (tplInfo.type === 'push' || tplInfo.type === 'wx') {
              if ((typeof tplInfo.content) !== 'object' || Object.keys(tplInfo.content).length === 0) {
                  const error = new ClientError('模板内容参数需要为键值对对象');
                  error.errors = ctx.errors;
                  throw error;
              }
          }
          try {
              const tpl = await createMsgTpl(tplInfo);
              ctx.body = tpl;
          } catch (err) {
              ctx.body = err;
          }
      })
      .get('/messageTpls', needLogin, needPlatFormAuth({ message: [roleType.Administor] }), async ctx => {
          const condition = {};
          const reg = new RegExp(ctx.request.query.name, 'i');
          if (ctx.request.query.name) {
              condition.name = { $regex: reg };
          }
          if (ctx.request.query.type) {
              condition.type = ctx.request.query.type;
          }
          const opt = {
              page: ctx.request.query.page || 1,
              size: ctx.request.query.size || 10
          };
          try {
              console.log(opt)
              const tplList = await loadMsgTpl(condition, opt);
              ctx.body = tplList;
          } catch (err) {
              ctx.body = err;
          }
      })
      .put('/messageTpl/:id', needLogin, needPlatFormAuth({ message: [roleType.Administor] }), async ctx => {
          const updateInfo = {
              name: ctx.checkBody('tplName').notEmpty().trim().value, //模板名称
              content: ctx.checkBody('tplContent').notEmpty().trim().value, //模板内容
              type: ctx.checkBody('tplType').notEmpty().trim().value //模板类型
          };
          if (ctx.errors && ctx.errors.length) {
              ctx.status = 400;
              const error = new ClientError(ErrorCode.PARAMS_ERROR);
              error.errors = ctx.errors;
              throw error;
          }
          const condition = { _id: ctx.params.id };
          try {
              const tpl = await updateMsgTpl(condition, updateInfo);
              ctx.body = tpl;
          } catch (err) {
              ctx.body = err;
          }
      })
      .get('/messageTpl/:id', needLogin, needPlatFormAuth({ message: [roleType.Administor] }), async ctx => {
          const tplId = ctx.params.id;
          try {
              const tpl = await findById(tplId);
              ctx.body = tpl;
          } catch (err) {
              ctx.body = err;
          }
      })
      .delete('/messageTpl/:id', needLogin, needPlatFormAuth({ message: [roleType.Administor] }), async ctx => {
          const tplId = ctx.params.id;
          try {
              const tpl = await removeMsgTpl({ _id: tplId });
              if (tpl) {
                  ctx.body = tpl;
              }
          } catch (err) {
              ctx.body = err;
          }
      });
};

