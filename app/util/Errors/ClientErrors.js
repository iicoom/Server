/**
 * Created by bjcwq on 16/4/17.
 */

import BaseError from './BaseError';

class MissError extends BaseError {
  constructor(resource, filed) {
    super('miss', resource, filed);
  }
}

class MissingFiledError extends BaseError {
  constructor(resource, filed) {
    super('missing_field', resource, filed);
  }
}

class InvalidError extends BaseError {
  constructor(resource, filed) {
    super('invalid', resource, filed);
  }
}

class AlreadyExistsError extends BaseError {
  constructor(resource, filed) {
    super('already_exists', resource, filed);
  }
}

class LimitError extends BaseError {
  constructor(resource, filed) {
    super('access_limit', resource, filed);
  }
}

class CustomError extends BaseError {
  constructor(resource, filed, message) {
    super('custom', resource, filed);
    this.message = message;
  }
}

class DubboError extends BaseError {
  constructor(resource, filed, code, message) {
    super(code, resource, filed);
    this.message = message;
  }
}

class ClientError {

  constructor(message, status = 400) {
    this.message = message;
    this.status = status;
  }

  push(error) {
    if (!this.errors) {
      this.errors = [];
    }
      const e = {};
      if (error instanceof CustomError) {
          e[error.filed || error.resource] = error.message;
      } else {
          e[error.filed || error.resource] = `${error.resource || ''} ${error.code || ''} by ${error.filed || ''}.`;
      }

    this.errors.push(e);
  }

  haveError() {
    return this.errors.length > 0;
  }

  setErrorMessage(message) {
    this.message = message;
  }
}

ClientError.MissError = MissError;
ClientError.MissingFiledError = MissingFiledError;
ClientError.InvalidError = InvalidError;
ClientError.AlreadyExistsError = AlreadyExistsError;
ClientError.CustomError = CustomError;
ClientError.DubboError = DubboError;
ClientError.LimitError = LimitError;

export default ClientError;
