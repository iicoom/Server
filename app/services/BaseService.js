import ServerError from '../util/Errors/ServerErrors';
import Utility from '../util/utils';

/**
 * 封装model里面一些基础方法。
 *
 * @export
 * @class BaseService
 */
export default class BaseService {

  constructor(model) {
    this.model = model;
    /**
     * 表名称
     */
    this.TableName = `${model.modelName}s`;
  }

  /**
   * 根据ID查询详情
   *
   * @param {any} id 主键ID值*
   * @param {any} [displayField={}] 默认显示所有字段，如果想去掉哪个字段的话{field:0}，此时field就不会返回。
   * @returns
   * @memberof BaseService
   */
  async findById(id, displayField = {}) {
    try {
      const result = await this.model.findById(id, displayField);
      return result ? result.toJSON() : null;
    } catch (ex) {
      console.log(ex.message);
      return null;
    }
  }

  /**
   * 根据条件查询出第一记录
   *
   * @param {any} condition 条件 {field1:'哈哈',type:4 ...}
   * @param {any} [fields={}]
   * @param {any} [options={}] {sort:{fiel4:-1,..},...}
   * @returns
   * @memberof BaseService
   */
  async findOne(condition, fields = {}, options = {}) {
    try {
      const result = await this.model.findOne(condition, fields, options);
      return result ? result.toJSON() : null;
    } catch (ex) {
      console.log(ex.message);
      return null;
    }
  }

  /**
   * 根据条件返回一个列表
   *
   * @static
   * @param {any} condition 条件 {field1:'哈哈',type:4 ...}
   * @param {any} [fields={}]
   * @param {any} [options={}] {sort:{fiel4:-1,..}, limit:10, skip:0, ...}
   * @returns
   * @memberof BaseService
   */
  async find(condition = {}, fields = {}, options = {}) {
    try {
      const list = await this.model.find(condition, fields, options);
      // return list ? JSON.parse(JSON.stringify(list)) : [];
      const total = await this.model.count(condition, fields, options);
      return { list, total };
    } catch (ex) {
      console.log(ex.message);
      return [];
    }
  }

  /**
   * 统计有多少条记录
   *
   * @static
   * @param {any} condition
   * @returns
   * @memberof BaseService
   */
  async count(condition) {
    try {
      return await this.model.count(condition);
    } catch (ex) {
      console.log(ex.message);
      return 0;
    }
  }

  /**
   * 返回null 时，说明更新失败了。
   *
   * @static
   * @param {any} condition {field1:'哈哈',type:4 ...}
   * @param {any} fields {field1:'张三',time:15000100203,...}
   * @param {any} options {sort:{fiel4:-1,..},...}
   * @returns
   * @memberof SheepService
   */
  async update(condition, fields, options) {
    try {
      console.log('-----------update--------------');
      console.log(fields);
      return await this.model.update(condition, { $set: fields }, options);
    } catch (ex) {
      console.log(ex.message);
      throw new ServerError({ msg: `更新记录失败原因:${ex.message}` });
    }
  }

  /**
   * 返回null 时，说明更新失败了。
   *
   * @static
   * @param {any} condition {field1:'哈哈',type:4 ...}
   * @param {any} fields {field1:'张三',time:15000100203,...}
   * @param {any} options {sort:{fiel4:-1,..},...}
   * @returns
   * @memberof SheepService
   */
  async modify(condition, fields, options) {
    try {
      console.log('-----------modify--------------');
      console.log(fields);
      return await this.model.update(condition, fields, options);
    } catch (ex) {
      console.log(ex.message);
      throw new ServerError({ msg: `更新记录失败原因:${ex.message}` });
    }
  }

  /**
   * 根据ID删除记录
   *
   * @param {any} id
   * @returns
   * @memberof BaseService
   */
  async findByIdAndRemove(id) {
    try {
      const result = await this.model.findByIdAndRemove(id);
      console.log('-----------base service findByIdAndRemove---');
      console.log(result);
      return result ? result.toJSON() : { errMsg: '无效的ID' };
    } catch (ex) {
      console.log(ex.message);
      throw new ServerError({ msg: `更新记录失败原因:${ex.message}` });
    }
  }

  /**
   * 根据ID修改内容
   *
   * @param {any} id 主键
   * @param {any} fields 要修改的字段 {field1:'a',field2:'b'...}
   * @returns
   * @memberof BaseService
   */
  async findByIdAndUpdate(id, fields) {
    try {
      const result = await this.model.findByIdAndUpdate(id, { $set: fields });
      return result ? result.toJSON() : null;
    } catch (ex) {
      console.log(ex.message);
      throw new ServerError({ msg: `更新记录失败原因:${ex.message}` });
    }
  }

  /**
   * 添加一条记录
   *
   * @param {any} fields
   * @returns
   * @memberof BaseService
   */
  async create(fields) {
    try {
      // console.log(this.model)
      const result = await this.model.create(fields);
      console.log(`-add record---${this.TableName}------`);
      return result ? result.toJSON() : null;
    } catch (ex) {
      console.log(ex.message);
      throw new ServerError({ msg: `更新记录失败原因:${ex.message}` });
    }
  }

  /**
   * 添加一条记录
   *
   * @param {any} fields
   * @returns
   * @memberof BaseService
   */
  async insert(fields) {
    return this.create(fields);
  }

  /**
   * 添加一条记录
   *
   * @param {any} fields
   * @returns
   * @memberof BaseService
   */
  async save(fields) {
    return this.create(fields);
  }

  /**
   * 统计
   *
   * @param {any} params [ {$match: {} }, {$group: {} },{$sort} ...]
   * @returns
   * @memberof BaseService
   */
  async aggregate(params) {
    return await this.model.aggregate(params);
  }

  /**
   * 判断mode否存在
   *
   * @param {any} id
   * @returns
   * @memberof BaseService
   */
  async CheckIsExists(id, displayField) {
    const { modelName } = this.model;
    if (!Utility.isMongoDBObjectId(id)) {
      throw new ServerError({ msg: ` ${modelName} ID不正确` });
    }
    const info = await this.model.findById(id, displayField);
    if (!info) {
      throw new ServerError({ msg: `检查 ${modelName} 数据不存在：${id}` });
    }
    return info.toJSON();
  }
}
