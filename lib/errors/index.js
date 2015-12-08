"use strict";
var util = require('util');

function MissingParameterError(message) {
    this.message = message;
    this.code = 409;
}
util.inherits(MissingParameterError, Error);

module.exports.MissingParameterError = MissingParameterError;

function InvalidArgumentError(message) {
    this.message = message;
    this.code = 409;
}
util.inherits(InvalidArgumentError, Error);

module.exports.InvalidArgumentError = InvalidArgumentError;

function UnauthorizedError(message) {
    this.message = message;
    this.code = 401;
}
util.inherits(UnauthorizedError, Error);

module.exports.UnauthorizedError = UnauthorizedError;


function ForbiddenError(message) {
    this.message = message;
    this.code = 403;
}
util.inherits(ForbiddenError, Error);

module.exports.ForbiddenError = ForbiddenError;

function NotFoundError(message) {
    this.message = message;
    this.code = 404;
}
util.inherits(NotFoundError, Error);

module.exports.NotFoundError = NotFoundError;
