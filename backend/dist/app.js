"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const pino_http_1 = __importDefault(require("pino-http"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const error_handler_1 = require("./middlewares/error-handler");
const not_found_handler_1 = require("./middlewares/not-found-handler");
const logger_1 = require("./shared/logger/logger");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, pino_http_1.default)({
    logger: logger_1.logger
}));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.env.CORS_ORIGIN === "*" ? true : env_1.env.CORS_ORIGIN }));
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 200
}));
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.resolve(process.cwd(), "uploads")));
app.use("/api/v1", routes_1.apiRouter);
app.use(not_found_handler_1.notFoundHandler);
app.use(error_handler_1.errorHandler);
