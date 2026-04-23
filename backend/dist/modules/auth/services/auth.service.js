"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const env_1 = require("../../../config/env");
const roles_1 = require("../../../shared/constants/roles");
const app_error_1 = require("../../../shared/errors/app-error");
const auth_repository_1 = require("../repositories/auth.repository");
const register = async (payload) => {
    const existingByEmail = await auth_repository_1.authRepository.findUserByEmail(payload.email);
    if (existingByEmail) {
        throw new app_error_1.AppError("Email is already registered", http_status_codes_1.StatusCodes.CONFLICT);
    }
    const existingByPhone = await auth_repository_1.authRepository.findUserByPhone(payload.phone);
    if (existingByPhone) {
        throw new app_error_1.AppError("Phone is already registered", http_status_codes_1.StatusCodes.CONFLICT);
    }
    const passwordHash = await bcryptjs_1.default.hash(payload.password, 10);
    const roleCode = payload.roleCode === roles_1.ROLE_CODES.TRUCK_OWNER ? roles_1.ROLE_CODES.TRUCK_OWNER : roles_1.ROLE_CODES.CUSTOMER;
    const selectedRole = await auth_repository_1.authRepository.findRoleByCode(roleCode);
    if (!selectedRole) {
        throw new app_error_1.AppError("Selected role is not configured", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
    const userId = await auth_repository_1.authRepository.createUser({
        roleId: selectedRole.id,
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        passwordHash
    });
    return {
        userId
    };
};
const login = async (payload) => {
    const user = await auth_repository_1.authRepository.findUserByEmail(payload.email);
    if (!user) {
        throw new app_error_1.AppError("Invalid credentials", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    const isValid = await bcryptjs_1.default.compare(payload.password, user.password_hash);
    if (!isValid) {
        throw new app_error_1.AppError("Invalid credentials", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    const accessToken = jsonwebtoken_1.default.sign({
        sub: user.id,
        roleCode: user.role_code,
        email: user.email
    }, env_1.env.JWT_ACCESS_SECRET, { expiresIn: env_1.env.JWT_ACCESS_EXPIRES_IN });
    return {
        accessToken,
        user: {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            phone: user.phone,
            roleCode: user.role_code
        }
    };
};
const getMe = async (userId) => {
    const user = await auth_repository_1.authRepository.findUserById(userId);
    if (!user) {
        throw new app_error_1.AppError("User not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    return {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        roleCode: user.role_code
    };
};
const updateMe = async (userId, payload) => {
    const user = await auth_repository_1.authRepository.findUserById(userId);
    if (!user) {
        throw new app_error_1.AppError("User not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    const normalizedEmail = payload.email.trim().toLowerCase();
    const normalizedPhone = payload.phone.trim();
    const normalizedName = payload.fullName.trim();
    if (normalizedEmail !== user.email) {
        const existingByEmail = await auth_repository_1.authRepository.findUserByEmail(normalizedEmail);
        if (existingByEmail) {
            throw new app_error_1.AppError("Email is already registered", http_status_codes_1.StatusCodes.CONFLICT);
        }
    }
    if (normalizedPhone !== user.phone) {
        const existingByPhone = await auth_repository_1.authRepository.findUserByPhone(normalizedPhone);
        if (existingByPhone) {
            throw new app_error_1.AppError("Phone is already registered", http_status_codes_1.StatusCodes.CONFLICT);
        }
    }
    await auth_repository_1.authRepository.updateProfile({
        userId,
        fullName: normalizedName,
        email: normalizedEmail,
        phone: normalizedPhone
    });
    return getMe(userId);
};
const changeMyPassword = async (userId, payload) => {
    const user = await auth_repository_1.authRepository.findUserById(userId);
    if (!user) {
        throw new app_error_1.AppError("User not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    const isCurrentPasswordValid = await bcryptjs_1.default.compare(payload.currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
        throw new app_error_1.AppError("Current password is incorrect", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    const newPasswordHash = await bcryptjs_1.default.hash(payload.newPassword, 10);
    await auth_repository_1.authRepository.updatePasswordHash(userId, newPasswordHash);
};
const createAdmin = async (payload) => {
    const existingByEmail = await auth_repository_1.authRepository.findUserByEmail(payload.email.trim().toLowerCase());
    if (existingByEmail) {
        throw new app_error_1.AppError("Email is already registered", http_status_codes_1.StatusCodes.CONFLICT);
    }
    const existingByPhone = await auth_repository_1.authRepository.findUserByPhone(payload.phone.trim());
    if (existingByPhone) {
        throw new app_error_1.AppError("Phone is already registered", http_status_codes_1.StatusCodes.CONFLICT);
    }
    const adminRole = await auth_repository_1.authRepository.findRoleByCode(roles_1.ROLE_CODES.ADMIN);
    if (!adminRole) {
        throw new app_error_1.AppError("Admin role is not configured", http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
    }
    const passwordHash = await bcryptjs_1.default.hash(payload.password, 10);
    const userId = await auth_repository_1.authRepository.createUser({
        roleId: adminRole.id,
        fullName: payload.fullName.trim(),
        email: payload.email.trim().toLowerCase(),
        phone: payload.phone.trim(),
        passwordHash
    });
    return { userId };
};
exports.authService = {
    register,
    login,
    getMe,
    updateMe,
    changeMyPassword,
    createAdmin
};
