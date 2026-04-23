"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    DB_HOST: zod_1.z.string().default("127.0.0.1"),
    DB_PORT: zod_1.z.coerce.number().default(3306),
    DB_NAME: zod_1.z.string().default("foodtruck_platform"),
    DB_USER: zod_1.z.string().default("root"),
    DB_PASSWORD: zod_1.z.string().default(""),
    JWT_ACCESS_SECRET: zod_1.z.string().min(16).default("dev-only-change-this-secret"),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default("15m"),
    CORS_ORIGIN: zod_1.z.string().default("*")
});
exports.env = envSchema.parse(process.env);
