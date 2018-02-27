import nodemailer from 'nodemailer';

// 创建一个SMTP客户端配置
const config = {
  host: 'smtp.qq.com',
  port: 465,
  auth: {
    user: 'asdfpeng@qq.com', // 刚才注册的邮箱账号
    pass: 'vtjhoejrgwxnbefg',  // 邮箱的授权码，不是注册时的密码
  },
};

// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config);

// 发送邮件
// module.exports = function send(mail) {
//   transporter.sendMail(mail, (error, info) => {
//     if (error) {
//       return console.log(error);
//     }
//     console.log('mail sent:', info.response);
//   });
// };

export const send = async (mail) => {
  transporter.sendMail(mail, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('mail sent:', info.response);
  });
};

// setup email data with unicode symbols
export const mailInfo = (mail, code = '123456') => {
  const mailOptions = {
    // 发件人
    from: '"Fred Foo 👻" <asdfpeng@qq.com>',
    // 主题
    subject: '账号激活',
    // 收件人
    to: `${mail}`,
    // 邮件内容，HTML格式
    text: 'XX账号激活邮件',
    html: `亲爱的${mail}:<br/>感谢您在我站注册了新帐号。<br/>请点击链接激活您的帐号。<br/><a href="http://localhost:3004/emailVerify?${code}" target= 
'_blank'>点击激活</a><br/>如果以上链接无法点击，请将它复制到你的浏览器地址栏中进入访问，该链接24小时内有效。
`, // 接收激活请求的链接
  };
  return mailOptions;
};

// 响应激活请求，根据激活链接的用户名进行查找，若用户存在则判断激活码是否一致，并判断激活码是否过期，全部正确则改变激活状态，此时激活成功，如下代码：
export const checkCode = () => {

}

// QQ邮箱 SMTP
// https://zhidao.baidu.com/question/14312788.html?fr=iks&word=qq+%D3%CA%CF%E4%B5%C4smtp+host&ie=gbk
