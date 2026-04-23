"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMenuItemSchema = exports.createMenuItemSchema = exports.listMenuItemsQuerySchema = void 0;
const zod_1 = require("zod");
exports.listMenuItemsQuerySchema = zod_1.z.object({
    truckId: zod_1.z.coerce.number().int().positive()
});
exports.createMenuItemSchema = zod_1.z.object({
    truckId: zod_1.z.number().int().positive(),
    categoryId: zod_1.z.number().int().positive(),
    name: zod_1.z.string().min(2).max(140),
    description: zod_1.z.string().max(1500).optional(),
    price: zod_1.z.number().positive(),
    imageUrl: zod_1.z.string().url().optional(),
    isAvailable: zod_1.z.boolean().default(true)
});
exports.updateMenuItemSchema = zod_1.z.object({
    categoryId: zod_1.z.number().int().positive().optional(),
    name: zod_1.z.string().min(2).max(140).optional(),
    description: zod_1.z.string().max(1500).optional(),
    price: zod_1.z.number().positive().optional(),
    imageUrl: zod_1.z.string().url().optional(),
    isAvailable: zod_1.z.boolean().optional()
});
