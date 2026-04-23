"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const api_response_1 = require("../shared/http/api-response");
const notFoundHandler = (_req, res, _next) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json((0, api_response_1.fail)("Route not found"));
};
exports.notFoundHandler = notFoundHandler;
