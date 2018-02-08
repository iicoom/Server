/**
 * Created by Mr.mao on 16/8/9.
 */

import crypto from 'crypto';
import requestFn from 'request';
import querystring from 'querystring';
import objectid from 'objectid';
import _ from 'lodash';
import dateformat from 'dateformat';

const randomstring = require('randomstring');


class Utility {

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
    // if (typeof value !== 'number') {
    //   return false;
    // }
    // return true;
    return typeof value === 'number';
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
    // if (value) {
    //   return true;
    // }
    // return false;
    return !!value;
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

  // 检查邮箱
  static testEmail(email) {
    const reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    return reg.test(email);
  }

  /**
   * 身份证号码验证
   *
   * @param cardNo
   *            {String} 证件号码
   * @returns info {Object} 身份证信息.
   *
   */
  static getIdCardInfo(cardNo) {
    const info = {
      isTrue: false, // 身份证号是否有效。默认为 false
      year: null, // 出生年。默认为null
      month: null, // 出生月。默认为null
      day: null, // 出生日。默认为null
      isMale: false, // 是否为男性。默认false
      isFemale: false, // 是否为女性。默认false
    };

    if (!cardNo && cardNo.length !== 15 && cardNo.length !== 18) {
      info.isTrue = false;
      return info;
    }

    if (cardNo.length === 15) {
      const year = cardNo.substring(6, 8);
      const month = cardNo.substring(8, 10);
      const day = cardNo.substring(10, 12);
      const p = cardNo.substring(14, 15); // 性别位
      const birthday = new Date(year,
        parseFloat(month) - 1,
        parseFloat(day), 12, 0, 0, 0);

      // 对于老身份证中的年龄则不需考虑千年虫问题而使用getYear()方法
      if (birthday.getYear() !== parseFloat(year) ||
      birthday.getMonth() !== parseFloat(month) - 1 ||
      birthday.getDate() !== parseFloat(day)) {
        info.isTrue = false;
      } else {
        info.isTrue = true;
        info.year = birthday.getFullYear();
        info.month = birthday.getMonth() + 1;
        info.day = birthday.getDate();
        if (p % 2 === 0) {
          info.isFemale = true;
          info.isMale = false;
        } else {
          info.isFemale = false;
          info.isMale = true;
        }
      }
      return info;
    }

    if (cardNo.length === 18) {
      const year = cardNo.substring(6, 10);
      const month = cardNo.substring(10, 12);
      const day = cardNo.substring(12, 14);
      const p = cardNo.substring(14, 17);
      const birthday = new Date(year,
        parseFloat(month) - 1,
        parseFloat(day), 12, 0, 0, 0);

      // 这里用getFullYear()获取年份，避免千年虫问题
      if (birthday.getFullYear() !== parseFloat(year) ||
      birthday.getMonth() !== parseFloat(month) - 1 ||
      birthday.getDate() !== parseFloat(day)) {
        info.isTrue = false;
        return info;
      }

      const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
      const Y = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X

      // 验证校验位
      let sum = 0; // 声明加权求和变量
      const _cardNo = cardNo.split('');

      if (_cardNo[17].toLowerCase() === 'x') {
        _cardNo[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
      }
      for (let i = 0; i < 17; i++) {
        sum += Wi[i] * _cardNo[i]; // 加权求和
      }
      const i = sum % 11; // 得到验证码所位置

      if (_cardNo[17] !== Y[i]) {
        info.isTrue = false;
        return info;
      }

      info.isTrue = true;
      info.year = birthday.getFullYear();
      info.month = birthday.getMonth() + 1;
      info.day = birthday.getDate();

      if (p % 2 === 0) {
        info.isFemale = true;
        info.isMale = false;
      } else {
        info.isFemale = false;
        info.isMale = true;
      }
      return info;
    }
    return info;
  }


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

  static isApp(ua) {
    return ua && ua.indexOf('YunFarm') !== -1;
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


  /** **********************************************************
   时间处理
 ***************************** */
  /**
   * 获取现在时间
   * @returns {number|*}
   */
  static getNowTime() {
    const now = new Date();
    return now.getTime();
  }


  /** **********************************************************
   生成随机编号
 ***************************** */
  static generateRandom(n, collection) {
    let res = '';
    for (let i = 0; i < n; i++) {
      const id = Math.ceil(Math.random() * (collection.length - 1));
      res += collection[id];
    }
    return res;
  }

  static generateUUID() {
    const Collection_Alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    return exports.generateRandom(31,
      exports.Collection_Num.concat(Collection_Alpha));
  }
  /**
   * 生成订单编号
   *
   * @static
   * @memberof Utility
   */
  static generateOrderCode() {
    const Collection_Num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const time = dateformat(this.getNowTime(), 'yyyymmddHHMMss');
    const randNumber = this.generateRandom(3, Collection_Num);
    return `${time}${randNumber}`;
  }

  /**
   * 生成序列号
   *
   * @static
   * @returns
   * @memberof Utility
   */
  static generateSerNum() {
    const time = dateformat(this.getNowTime(), 'yyyymmddHHMMss');
    const randomNum = randomstring.generate({ length: 12, charset: 'numeric' });
    return `${time}2${randomNum}`;
  }
}

export default Utility;

