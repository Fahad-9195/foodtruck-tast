"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminSchema = exports.changePasswordSchema = exports.updateProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).max(120),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(8).max(30),
    password: zod_1.z.string().min(8).max(128),
    roleCode: zod_1.z.enum(["customer", "truck_owner"]).default("customer")
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8).max(128)
});
exports.updateProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).max(120),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(8).max(30)
});
exports.changePasswordSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(8).max(128),
    newPassword: zod_1.z.string().min(8).max(128)
})
    .refine((value) => value.currentPassword !== value.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"]
});
exports.createAdminSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2).max(120),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(8).max(30),
    password: zod_1.z.string().min(8).max(128)
});
