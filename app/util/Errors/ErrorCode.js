/**
 * Created by bj on 16/8/12.
 */

/**
 * 错误码
 * @type {{}}
 */

const ErrorCode = {};

ErrorCode.PARAMS_ERROR = 'params error'; // 参数错误
ErrorCode.MOBILE_NOT_EMPTY = 'mobile not empty'; // 手机号不为空
ErrorCode.EMAIL_NOT_EMPTY = 'email not empty';//邮箱不能为空
ErrorCode.BIRTHDAY_NOT_EMPTY = '';//生日不能为空
ErrorCode.MOBILE_FORMAT_ERROR = 'mobile format error'; // 手机号格式错误
ErrorCode.EMAIL_FORMAT_ERROR = 'email format error';//邮箱格式错误
ErrorCode.SMS_TPL_NOT_EMPTY = 'sms tpl not empty'; // 短信模板不能为空
ErrorCode.PASSWORD_FORMAT_ERROR = 'password format error'; // 密码格式错误
ErrorCode.INVALID_USER_NAME_PASSWORD = 'invalid user name password'; // 无效的用户名密码

ErrorCode.CAPTCHA_SEND_WAY_NOT_EMPTY = 'captcha send way not empty'; // 验证码发送方式不能为空
ErrorCode.UNKNOWN_CAPTCHA_WAY_TO_SEND = 'unknown captcha way to send'; // 未知的验证码发送方式
ErrorCode.VERIFYCODE_NOT_EMPTY = 'verification not empty'; // 验证码不能为空
ErrorCode.VERIFYCODE_ERROR = 'verification code error'; // 验证码错误
ErrorCode.VERIFYCODE_FORMAT_ERROR = 'verification code format error'; // 验证码格式错误
ErrorCode.VERIFYCODE_CTOKEN_NOT_EMPTY = 'verification code certificate not empty'; // 验证码凭证不能为空

ErrorCode.ACCOUNT_HAS_EXIST_FORMAT_ERROR = 'account has exist format error'; // 账户是否存在格式错误
ErrorCode.ACCOUNT_NOT_EXIST = 'account not exist'; // 账户不存在
ErrorCode.ACCOUNT_ALREADY_EXIST = 'account already exist'; // 账户已存在
ErrorCode.CAPTCHA_NOT_EMPTY = 'captcha not empty';//验证码不能为空
ErrorCode.CAPTCHA_VERIFICATION_FAIL = 'captcha verification fail';//验证码验证失败
ErrorCode.CTOKEN_NOT_EMPTY = 'ctoken not empty';//短信检验标识码不能为空
ErrorCode.PASSWORD_NOT_EMPTY = 'password not empty';//密码不能为空
ErrorCode.CONFIRM_PASSWORD_NOT_EMPTY = 'confirm password not empty';//确认密码不能为空
ErrorCode.TWO_PASSWORD_NOT_CONSISTENT = 'two password not consistent';//两次密码输入不一致
ErrorCode.TICKET_NOT_EMPTY = 'ticket not empty';//ticket不能为空
ErrorCode.TICKET_VERIFICATION_FAIL = 'ticket verification fail';//ticket验证失败
ErrorCode.PLEASE_LOGIN_FRIST = 'please login first';//请先登录
ErrorCode.PASSWORD_VERIFICATION_FAIL = 'password verification fail';//密码验证失败
ErrorCode.USER_NOT_EXIST = 'user not exist';//用户不存在
ErrorCode.WXUSER_NOT_EXIST = 'wxuser not exist';//微信用户不存在
ErrorCode.OPENID_NOT_EMPTY = 'openid not empty';//微信openid不能为空
ErrorCode.CODE_NOT_EMPTY = 'code not empty';//微信code不能为空
ErrorCode.CODE_INVALID = 'code invalid';//微信code无效
ErrorCode.CLIENT_TYPE_NOT_EMPTY = 'client_type not empty';//client_type不能为空
ErrorCode.CLIENT_TYPE_ERROR = 'client_type error';//client_type错误

ErrorCode.REDIRECTtURL_NOT_EMPTY = 'redirectUrl not empty';//微信回调地址redirectUrl不能为空
ErrorCode.STATE_NOT_EMPTY = 'state not empty';//微信state不能为空
ErrorCode.SCOPE_NOT_EMPTY = 'scope not empty';//微信scope不能为空
ErrorCode.USER_IS_BOUND_WECHAT = 'user is bound wechat';//用户已经绑定过微信号
ErrorCode.WECHAT_IS_BOUND_USER = 'wechat is bound user';//微信号已经绑定用户
ErrorCode.WECHAT_IS_NOT_UNBIND_POWER_TO_USER = 'wechat is not unbind power to user';//该微信号没有解绑该用户的权限
ErrorCode.URL_NOT_EMPTY = 'url not empty';//获取微信JS_SDK签名传的url不能为空

ErrorCode.MEMBER_NOT_EXIST = 'member not exist';//会员信息不存在
ErrorCode.GRADEID_NOT_EMPTY = 'gradeId not empty';//等级id不能为空
ErrorCode.EXPERIENCEVALUE_NOT_EMPTY = 'experienceValue not empty';//经验值不能为空

ErrorCode.ENTRYINTOFORCETIME_NOT_EMPTY = 'entryIntoForceTime not empty';//生效时间不能为空

ErrorCode.USERID_NOT_EMPTY = 'userId not empty'; //用户id不能为空
ErrorCode.ROLE_NOT_EMPTY = 'role not empty'; //role不能为空
ErrorCode.USER_COMPANY_IDENEITY_IS_EXIST = 'user company identity is exist'; //用户身份存在

ErrorCode.WARRANT_TYPE_NOT_BLANK = 'warrant type not blank'; // 担保类型不能为空
ErrorCode.WARRANT_TYPE_NO_EXIST = 'warrant type no exist'; // 担保类型不存在

//通用码
ErrorCode.UnKnow_Error = 400000;//未处理的错误
ErrorCode.Success = 200000;//成功

ErrorCode.Version_Low = 400000;//版本过低，请先升级

ErrorCode.Permission_Deny = 401100; //权限不足

//账户
ErrorCode.Account_ErrorParams = 403000; //参数不正确
ErrorCode.Account_ErrorParams_New = 400000;//
ErrorCode.Account_ErrorPermision_AS_lock = 403001;//自动购买锁定
ErrorCode.Account_ErrorPermision_AS_duplicate = 403002;//自动购买锁定
ErrorCode.Account_ErrorNotFound = 404001;
ErrorCode.Account_ErrorNotFound_Msg = '账户不存在';


module.exports = ErrorCode;
