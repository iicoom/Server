/**
 * Created by bjcwq on 16/4/17.
 */

class BaseError {
  constructor(code, resource, filed) {
    this.resource = resource;
    this.filed = filed;
    this.code = code;
  }
}

export default BaseError;
