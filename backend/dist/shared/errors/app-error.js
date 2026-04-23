"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const http_status_codes_1 = require("http-status-codes");
class AppError extends Error {
    statusCode;
    details;
    constructor(message, statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.AppError = AppError;
