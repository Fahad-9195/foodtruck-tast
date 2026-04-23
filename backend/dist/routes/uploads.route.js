"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadsRouter = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const http_status_codes_1 = require("http-status-codes");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_roles_1 = require("../middlewares/authorize-roles");
const roles_1 = require("../shared/constants/roles");
const app_error_1 = require("../shared/errors/app-error");
const api_response_1 = require("../shared/http/api-response");
const uploadsDir = path_1.default.resolve(process.cwd(), "uploads");
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        const extension = path_1.default.extname(file.originalname || "") || ".bin";
        const baseName = path_1.default
            .basename(file.originalname || "upload", extension)
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, "-")
            .slice(0, 40);
        cb(null, `${Date.now()}-${baseName}${extension}`);
    }
});
const upload = (0, multer_1.default)({ storage });
const uploadsRouter = (0, express_1.Router)();
exports.uploadsRouter = uploadsRouter;
uploadsRouter.post("/single", authenticate_1.authenticate, (0, authorize_roles_1.authorizeRoles)(roles_1.ROLE_CODES.TRUCK_OWNER, roles_1.ROLE_CODES.ADMIN), upload.single("file"), (req, res) => {
    if (!req.file) {
        throw new app_error_1.AppError("No file uploaded", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const host = req.get("host");
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    res.status(http_status_codes_1.StatusCodes.CREATED).json((0, api_response_1.ok)("File uploaded", { url: fileUrl, fileName: req.file.originalname }));
});
