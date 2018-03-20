/**
 * 任务
 * Created by feng on 2016/11/25.
 */
import { initOptions, requestGet, request } from '../util/proxy';
import { memberServer, memberServerPath } from '../config';
import _ from 'lodash';

const taskService = {};

  /**
   * 按条件查询任务
   * @param condition
   * @returns {Promise}
   */
taskService.searchTasks = async (condition) => {
  const options = initOptions(memberServer, memberServerPath.tasksSearch);
  return await requestGet(options, condition);
};

/**
 * 获取任务信息
 * @param id
 * @returns {Promise}
 */
taskService.getTasks = async (id) => {
  const path = _.template(memberServerPath.tasksGet)({ 'id': id });
  const options = initOptions(memberServer, path);
  const data = await requestGet(options);
  return data.data;
};

/**
 * 根据code获取任务信息
 * @param code
 */
taskService.getTasksByCode = async (code) => {
  const path = _.template(memberServerPath.tasksGetByCode)({ 'code': code });
  const options = initOptions(memberServer, path);
  const data = await requestGet(options);
  return data.data;
};

/**
 * 保存任务
 * @param data 任务信息
 */
taskService.saveTask = async (data) => {
  let options = initOptions(memberServer, memberServerPath.tasksSave);
  options = {...options, method: 'POST', body: data};
  const resp = await request(options);
  return resp.data;
};

/**
 * 修改任务
 * @param taskId
 * @param data
 */
taskService.modifyTask = async (taskId, data) => {
  const path = _.template(memberServerPath.tasksEdit)({ 'id': taskId });
  let options = initOptions(memberServer, path);
  options = {...options, method: 'PUT', body: data};
  const resp = await request(options);
  return resp.data;
};

/**
 * 删除任务
 * @param taskId
 */
taskService.deleteTask = async (taskId) => {
  const path = _.template(memberServerPath.tasksDel)({ 'id': taskId });
  let options = initOptions(memberServer, path);
  options = {...options, method: 'DELETE'};
  await request(options);
};

export default taskService;
