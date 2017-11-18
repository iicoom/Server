
function setcookie(req, name, val, secret, options) {
  // debug(arguments);
  // let signed = 's:' + signature.sign(val, secret);
  // let data = cookie.serialize(name, signed, options);
  req.cookies.set(name, val, options);
}

function AccessToken(opt) {
  const option = {
    name: 'token',
    secret: '',
    ...opt,
  };

  return async function (ctx, next) {
    let accessToken = ctx.query.access_token;
    const authorization = ctx.get('Authorization');
    if (!accessToken && !!authorization && authorization.indexOf('token') !== -1) {
      const tokenBeginIndex = authorization.indexOf('token');
      accessToken = authorization.substr(tokenBeginIndex + 6);
    }

    if (!!accessToken) {
      ctx.sessionId = accessToken;
      setcookie(ctx, option.name, accessToken, option.secret, {});
    }
    await next();
  };
}

export default AccessToken;