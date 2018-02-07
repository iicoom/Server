/**
 * Created by Mr.mao on 16/6/14.
 */

class ServerError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
  push(error) {
    if (!this.errors) {
      this.errors = [];
    }
    this.errors.push(error);
  }
}
export default ServerError;
