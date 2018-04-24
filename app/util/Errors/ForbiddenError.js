/**
 * Created by xiaomao on 16/8/3.
 */

class ForbiddenError extends Error {
  constructor(message = '您没有权限访问此资源', status = 403) {
    super(message);
    this.status = status;
  }
}

export default ForbiddenError;
