"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const app_error_1 = require("../shared/errors/app-error");
const api_response_1 = require("../shared/http/api-response");
const logger_1 = require("../shared/logger/logger");
const isDuplicateEntryError = (error) => {
    return typeof error === "object" && error !== null && "code" in error && error.code === "ER_DUP_ENTRY";
};
const getDuplicateEntryMessage = (error) => {
    const rawMessage = typeof error === "object" && error !== null && "sqlMessage" in error ? String(error.sqlMessage ?? "") : "";
    if (rawMessage.includes("users.email")) {
        return "البريد الإلكتروني مستخدم مسبقًا.";
    }
    if (rawMessage.includes("users.phone")) {
        return "رقم الجوال مستخدم مسبقًا.";
    }
    if (rawMessage.includes("municipal_licenses.license_number")) {
        return "رقم الرخصة مستخدم مسبقًا لطلب آخر.";
    }
    if (rawMessage.includes("food_trucks.slug")) {
        return "اسم الفود ترك مستخدم مسبقًا، جرّب اسمًا مختلفًا.";
    }
    return "يوجد بيانات مكررة لا يمكن حفظها.";
};
const errorHandler = (error, _req, res, _next) => {
    if (error instanceof zod_1.ZodError) {
        res.status(http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY).json((0, api_response_1.fail)("Validation failed", error.flatten()));
        return;
    }
    if (error instanceof app_error_1.AppError) {
        res.status(error.statusCode).json((0, api_response_1.fail)(error.message, error.details));
        return;
    }
    if (isDuplicateEntryError(error)) {
        res.status(http_status_codes_1.StatusCodes.CONFLICT).json((0, api_response_1.fail)(getDuplicateEntryMessage(error)));
        return;
    }
    logger_1.logger.error({ error }, "Unhandled error");
    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, api_response_1.fail)("Internal server error"));
};
exports.errorHandler = errorHandler;
