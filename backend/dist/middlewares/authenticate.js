"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const env_1 = require("../config/env");
const app_error_1 = require("../shared/errors/app-error");
const authenticate = (req, _res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader?.startsWith("Bearer ")) {
        throw new app_error_1.AppError("Missing or invalid authorization header", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    const token = authorizationHeader.slice(7);
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
        req.authUser = {
            userId: Number(payload.sub),
            roleCode: payload.roleCode,
            email: payload.email
        };
        next();
    }
    catch {
        throw new app_error_1.AppError("Invalid or expired token", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
};
exports.authenticate = authenticate;
