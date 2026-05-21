/* eslint-disable no-undef */

'use strict';

module.exports = class ServerError extends Error {

  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }

};
