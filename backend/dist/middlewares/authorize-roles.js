"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = require("../shared/errors/app-error");
const authorizeRoles = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.authUser) {
            throw new app_error_1.AppError("Unauthorized", http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
        if (!allowedRoles.includes(req.authUser.roleCode)) {
            throw new app_error_1.AppError("Forbidden", http_status_codes_1.StatusCodes.FORBIDDEN);
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
