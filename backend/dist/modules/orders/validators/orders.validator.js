"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderPaymentSchema = exports.createOrderReviewSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const order_status_1 = require("../../../shared/constants/order-status");
exports.createOrderSchema = zod_1.z.object({
    truckId: zod_1.z.number().int().positive(),
    items: zod_1.z
        .array(zod_1.z.object({
        menuItemId: zod_1.z.number().int().positive(),
        quantity: zod_1.z.number().int().min(1).max(20),
        notes: zod_1.z.string().max(300).optional()
    }))
        .min(1)
});
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([order_status_1.ORDER_STATUS.PREPARING, order_status_1.ORDER_STATUS.READY, order_status_1.ORDER_STATUS.PICKED_UP, order_status_1.ORDER_STATUS.CANCELLED])
});
exports.createOrderReviewSchema = zod_1.z.object({
    rating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().trim().max(700).optional()
});
exports.createOrderPaymentSchema = zod_1.z.object({
    method: zod_1.z.enum(["card", "apple_pay", "mada", "stc_pay"])
});
