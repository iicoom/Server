/**
 * Created by Mr.mao on 16/8/9.
 */

import crypto from 'crypto';
import requestFn from 'request';
import querystring from 'querystring';
import objectid from 'objectid';
import dateformat from 'dateformat';
import _ from 'lodash';
import ServerErrors from './Errors/ServerErrors';

const randomstring = require('randomstring');


class Utility {
  constructor(args) {
    // code
  }

  /** **********************************************************
        参数校验
***************************** */

  /**
   * 整形数 2 = true; '2' = false
   * 
   * @static
   * @param {any} value 
   * @returns 
   * @memberof Utility
   */
  static isInt(value) {
    if (Utility.isIntNumber(value)) {
      return typeof value === 'number';
    }
    return false;
  }

  /**
   * 整形数字: 2=true; '2'=true
   * 
   * @static
   * @param {any} value 
   * @returns 
   * @memberof Utility
   */
  static isIntNumber(value) {
    if (value === '0' || value === 0) {
      return true;
    }
    const re = /^[1-9]+[0-9]*]*$/;
    return re.test(value);
  }

  /**
   * 判断是否是数字, 如：'123.1' 、123.1 都是true
   * 
   * @static
   * @param {any} value 
   * @returns 
   * @memberof Utility
   */
  static isNumber(value) {
    const re = /^[0-9]+\.?[0-9]*$/;// ;
    return re.test(value);
  }

  /**
   * 是不是浮点型, 如：'123.1' = false 、123.1 = true
   * 
   * @static
   * @param {any} value 
   * @returns 
   * @memberof Utility
   */
  static isFloat(value) {
    const result = Utility.isNumber(value);
    return result && parseFloat(value) === value;
  }

  /**
   * 时间戳判断
   * 
   * @static
   * @param {any} value 
   * @returns 
   * @memberof Utility
   */
  static isTimestamp(value) {
    if (typeof value !== 'number') {
      return false;
    }
    return true;
  }

  /**
   * 验证手机号
   * 
   * @static
   * @param {any} value 
   * @returns 
   * @memberof Utility
   */
  static isPhone(value) {
    const reg = /^0?(1[34578])[0-9]{9}$/;
    return reg.test(value);
  }

  /**
   * Url验证
   * 
   * @static
   * @param {any} value 
   * @returns 
   * @memberof Utility
   */
  static isUrl(value) {
    const strRegex = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
    return strRegex.test(value);
  }

  /**
   * 是否大写字母
   * 
   * @static
   * @param {any} value 
   * @returns 
   * @memberof Utility
   */
  static isCapital(value) {
    const reg = /[A-Z]/;
    return reg.test(value);
  }

  /**
   * 是否为空
   *
   * @static
   * @param {any} value
   * @returns
   * @memberof Utility
   */
  static isEmpty(value) {
    if (value === 0) {
      return true;
    }
    if (value) {
      return true;
    }
    return false;
  }

  /**
   * 是否是一个对象
   * 
   * @static
   * @param {any} value 要判断的对象
   * @returns 
   * @memberof Utility
   */
  static isObject(value) {
    const keys = Object.keys(value);
    const values = Object.values(value);
    console.log('is object typeof value is:', typeof value);
    return keys.length > 0 && values.length > 0 && typeof value === 'object';
  }

  /**
   * 是否为空
   *
   * @static
   * @param {any} value
   * @returns
   * @memberof Utility
   */
  static isNotEmpty(value) {
    return !this.isEmpty(value);
  }

  static isMobilePhone(value) {
    const reg = /^(\+?0?86\-?)?1[345789]\d{9}$/;
    return reg.test(value);
  }
  /**
   * 是否是monogoDB里的ObjectID值
   * 
   * @static
   * @param {any} value 
   * @returns 
   * @memberof Utility
   */
  static isMongoDBObjectId(value) {
    return objectid.isValid(value);
  }

  /**
   * 此方法特殊方法。obj只能传一个对象。
   * 
   * @static
   * @param {any} obj 对象
   * @param {any} value 值
   * @memberof Utility
   */
  static isObjectValue = obj => (value) => {
    if (!Utility.isObject(obj)) {
      return false;
    }

    return Object.values(obj).includes(value);
  };


  /** **********************************************************
        字符串处理
***************************** */
  /**
   * 去空格
   * @param value
   * @returns {*}
   */
  static trim(value) {
    if (typeof value === 'number') {
      return value;
    } else if (typeof value !== 'undefined' && typeof value === 'string') {
      return value.replace(/(^\s*)|(\s*$)/g, '');
    } else if (typeof value === 'object') {
      return value;
    }
    return '';
  }

  /**
   * 去右边空格
   * @param value
   * @returns {*}
   */
  static trimRight(value) {
    if (typeof value !== 'undefined') {
      return value.replace(/(\s*$)/g, '');
    }
    return '';
  }

  /**
   * 去左边空格
   * @param s
   * @returns {*}
   */
  static trimLeft(value) {
    if (typeof value !== 'undefined') {
      return value.replace(/(^\s*)/g, '');
    }
    return '';
  }


  /** **********************************************************
        加密处理
***************************** */
  static digest(data, algorithm) {
    algorithm || (algorithm = 'md5');
    const shasum = crypto.createHash(algorithm);
    shasum.update(data);
    const d = shasum.digest('hex');
    return d;
  }

  static sha256(str, encoding) {
    if (!encoding) encoding = 'utf-8';
    const md5sum = crypto.createHash('sha256');
    md5sum.update(str, encoding);
    str = md5sum.digest('hex');
    return str;
  }

  /** **********************************************************
         获取http请求中的相关信息
 ***************************** */

  /**
   * 获取客户端URL
   * @param req
   * @returns {*|string|string|String}
   */
  static getUrl(request) {
    const { protocol, host, path } = request;
    return `${protocol}://${host}${path}`;
  }

  /**
   * 获取客户端IP
   * @param req
   * @returns {*|string|string|String}
   */
  static getClientIp(req) {
    return req.ips[0] || req.headers['x-real-ip'] || req.headers['X-Real-Ip'] || req.headers['X-Forwarded-For'] || req.headers['x-forwarded-for'] || req.ip;
  }

  /**
   * 获取请求信息
   * @param server
   * @param path
   * @returns {{url: string, headers: {content-type: string}}}
   */
  static initOptions(server, path) {
    return {
      url: `${server.protocol}://${server.hostname}:${server.port}/${path}`,
      json: true,
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
    };
  }

  /**
   * Promise化request - requestFn
   * @param opts
   * @returns {Promise}
   */
  static request = (opts) => {
    opts = opts || {};
    return new Promise((resolve, reject) => {
      requestFn(opts, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        resolve(body);
      });
    });
  };

  /**
   * 发送get请求
   * Promise化request
   * @param opts   请求信息
   * @param params 请求参数
   * @returns {Promise}
   */
  static requestGet(opts, params) {
    opts = opts || {};
    opts = {
      ...opts,
      method: 'GET',
      url: `${opts.url}?${querystring.stringify(params)}`,
    };
    return new Promise((resolve, reject) => {
      requestFn(opts, (error, response, body) => {
        if (error) {
          return reject(error);
        }
        const result = {
          data: body,
        };
        const headLink = response.headers.link;
        const linkMap = {};
        // 解析link，找到总条目数。放到result.count 里面
        if (headLink !== null && headLink !== undefined) {
          const str = headLink.split(',');
          for (const i in str) {
            const s = str[i].split(';');
            if (s.length === 2) {
              const t = s[1].split('=');
              linkMap[t[1].substring(1, t[1].length - 1)] = s[0].substring(1, s[0].length - 1);
            }
          }
          result.count = linkMap.count || 0;
        }

        resolve(result);
      });
    });
  }


  static setLinkHeader(request, response, pageInfo) {
    let link = '';
    const searchParams = request.query;

    // prev
    if (pageInfo.hasPreviousPage) {
      searchParams.page = pageInfo.prePage;
      link += `<${this.getUrl(request)}?${querystring.stringify(searchParams)}>; rel="prev",`;
    }

    // next
    if (pageInfo.hasNextPage) {
      searchParams.page = pageInfo.nextPage;
      link += `<${this.getUrl(request)}?${querystring.stringify(searchParams)}>; rel="next",`;
    }

    // first
    searchParams.page = pageInfo.firstPage;
    link += `<${this.getUrl(request)}?${querystring.stringify(searchParams)}>; rel="first",`;

    // last
    searchParams.page = pageInfo.lastPage;
    link += `<${this.getUrl(request)}?${querystring.stringify(searchParams)}>; rel="last",`;

    // count
    link += `<${pageInfo.count}>; rel="count"`;

    response.setHeader('Link', link);
  }


  static asteriskString(str, begin, length) {
    if (str) {
      let count = length || str.length - begin;

      if (count < 0) {
        return str;
      }
      if (begin + count > str.length) {
        count = str.length - begin;
      }

      let tail = str.length - (begin + count);

      if (tail < 0) {
        tail = 0;
      }

      return `${_.take(str, begin).join('')}${_.repeat('*', count)}${_.takeRight(str, tail).join('')}`;
    }
    return null;
  }
}

export default Utility;

