const crypto = require('crypto');

module.exports = exports;

exports.Collection_Num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
exports.Collection_Alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
exports.Collection_LowerAlpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

exports.generateRandom = function generateRandom(n, collection) {
  let res = '';
  for (let i = 0; i < n; i++) {
    const id = Math.ceil(Math.random() * (collection.length - 1));
    res += collection[id];
  }
  return res;
};

exports.generateUUID = function generateUUID() {
  return exports.generateRandom(31,
      exports.Collection_Num.concat(exports.Collection_Alpha));
};

exports.regexToStr = function regexToStr(reg) {
  const regChars = ['\\', '$', '(', ')',
    '*', '+', '.', '[', ']', '?', '^',
    '{', '}', '|', '?'];
  let result = reg;
  for (let i = 0; i < regChars.length; i++) {
    result = result.replace(regChars[i], `\\${regChars[i]}`);
  }
  return result;
};

exports.isApp = function isApp(ua) {
  return ua && ua.indexOf('YunFarm') !== -1;
};

exports.isfloat = function isfloat(oNum) {
  if (!oNum) return false;

  const strP = /^\d+(\.\d+)?$/;

  if (!strP.test(oNum)) return false;

  try {
    if (parseFloat(oNum) !== oNum) return false;
  } catch (ex) {
    return false;
  }

  return true;
};

exports.digest = function digest(data, algorithm) {
  const alg = algorithm || 'md5';
  const shasum = crypto.createHash(alg);
  shasum.update(data);
  return shasum.digest('hex');
};


/**
 * 身份证号码验证
 *
 * @param cardNo
 *            {String} 证件号码
 * @returns info {Object} 身份证信息.
 *
 */
exports.getIdCardInfo = function getIdCardInfo(cardNo) {
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
};

/**
 * 获取现在时间
 * @returns {number|*}
 */
exports.getNowTime = function() {
  var now = new Date();
  return now.getTime();
};

/**
 * 获取客户端ip
 * @param req
 * @returns {*|string}
 */
exports.getClientIP = function(req) {
    return req.headers['x-real-ip'] || req.headers['X-Real-Ip'] ||req.headers['X-Forwarded-For'] || req.headers['x-forwarded-for'] || req.ip;
};

//检查邮箱
exports.testEmail = (email) => {
    const reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    return reg.test(email);
};
