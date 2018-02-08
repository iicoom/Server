const crypto = require('crypto');

module.exports = exports;

exports.Collection_Num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
exports.Collection_Alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
exports.Collection_LowerAlpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];


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

exports.digest = function digest(data, algorithm) {
  const alg = algorithm || 'md5';
  const shasum = crypto.createHash(alg);
  shasum.update(data);
  return shasum.digest('hex');
};
