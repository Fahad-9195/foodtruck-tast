"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = require("../../../shared/errors/app-error");
const api_response_1 = require("../../../shared/http/api-response");
const auth_service_1 = require("../services/auth.service");
const auth_validator_1 = require("../validators/auth.validator");
const register = async (req, res) => {
    const payload = auth_validator_1.registerSchema.parse(req.body);
    const result = await auth_service_1.authService.register(payload);
    res.status(http_status_codes_1.StatusCodes.CREATED).json((0, api_response_1.ok)("Registration successful", result));
};
const login = async (req, res) => {
    const payload = auth_validator_1.loginSchema.parse(req.body);
    const result = await auth_service_1.authService.login(payload);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Login successful", result));
};
const getMe = async (req, res) => {
    if (!req.authUser) {
        throw new app_error_1.AppError("Unauthorized", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    const result = await auth_service_1.authService.getMe(req.authUser.userId);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Profile loaded", result));
};
const updateMe = async (req, res) => {
    if (!req.authUser) {
        throw new app_error_1.AppError("Unauthorized", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    const payload = auth_validator_1.updateProfileSchema.parse(req.body);
    const result = await auth_service_1.authService.updateMe(req.authUser.userId, payload);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Profile updated", result));
};
const changeMyPassword = async (req, res) => {
    if (!req.authUser) {
        throw new app_error_1.AppError("Unauthorized", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    const payload = auth_validator_1.changePasswordSchema.parse(req.body);
    await auth_service_1.authService.changeMyPassword(req.authUser.userId, payload);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Password updated", null));
};
const createAdmin = async (req, res) => {
    const payload = auth_validator_1.createAdminSchema.parse(req.body);
    const result = await auth_service_1.authService.createAdmin(payload);
    res.status(http_status_codes_1.StatusCodes.CREATED).json((0, api_response_1.ok)("Admin account created", result));
};
exports.authController = {
    register,
    login,
    getMe,
    updateMe,
    changeMyPassword,
    createAdmin
};
