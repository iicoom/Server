/**
 * Created by xiaomao on 16/8/3.
 */

class AuthError extends Error {
  constructor(message = 'Login Failed', status = 401) {
    super(message);
    this.status = status;
  }
}

export default AuthError;
