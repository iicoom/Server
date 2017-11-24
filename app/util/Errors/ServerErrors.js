/**
 * Created by bjcwq on 16/6/14.
 */
import BaseError from './BaseError';

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
