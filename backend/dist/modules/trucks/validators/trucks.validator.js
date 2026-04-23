"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoveryQuerySchema = exports.decisionTruckApprovalSchema = exports.updateTruckStatusSchema = exports.updateTruckLocationSchema = exports.updateTruckProfileSchema = exports.registerTruckSchema = void 0;
const zod_1 = require("zod");
const truck_status_1 = require("../../../shared/constants/truck-status");
exports.registerTruckSchema = zod_1.z.object({
    displayName: zod_1.z.string().min(2).max(140),
    categoryName: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().max(1500).optional(),
    workingHours: zod_1.z.string().min(2).max(200),
    contactPhone: zod_1.z.string().min(8).max(30),
    coverImageUrl: zod_1.z.string().url().optional(),
    location: zod_1.z.object({
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180),
        neighborhood: zod_1.z.string().min(2).max(120),
        city: zod_1.z.string().min(2).max(120)
    }),
    license: zod_1.z.object({
        licenseNumber: zod_1.z.string().min(3).max(80),
        documentUrl: zod_1.z.string().url(),
        expiresAt: zod_1.z.string()
    })
});
exports.updateTruckProfileSchema = zod_1.z.object({
    displayName: zod_1.z.string().min(2).max(140).optional(),
    description: zod_1.z.string().max(1500).optional(),
    coverImageUrl: zod_1.z.string().url().optional(),
    workingHours: zod_1.z.string().min(2).max(200).optional()
});
exports.updateTruckLocationSchema = zod_1.z.object({
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
    neighborhood: zod_1.z.string().min(2).max(120),
    city: zod_1.z.string().min(2).max(120)
});
exports.updateTruckStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        truck_status_1.TRUCK_OPERATIONAL_STATUS.OPEN,
        truck_status_1.TRUCK_OPERATIONAL_STATUS.BUSY,
        truck_status_1.TRUCK_OPERATIONAL_STATUS.CLOSED,
        truck_status_1.TRUCK_OPERATIONAL_STATUS.OFFLINE
    ])
});
exports.decisionTruckApprovalSchema = zod_1.z.object({
    decision: zod_1.z.enum([truck_status_1.TRUCK_APPROVAL_STATUS.APPROVED, truck_status_1.TRUCK_APPROVAL_STATUS.REJECTED]),
    reviewNote: zod_1.z.string().max(500).optional()
}).superRefine((value, ctx) => {
    if (value.decision === truck_status_1.TRUCK_APPROVAL_STATUS.REJECTED && !value.reviewNote?.trim()) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: "Review note is required when rejecting a truck",
            path: ["reviewNote"]
        });
    }
});
exports.discoveryQuerySchema = zod_1.z.object({
    city: zod_1.z.string().min(2).max(120).optional(),
    neighborhood: zod_1.z.string().min(2).max(120).optional(),
    categoryId: zod_1.z.coerce.number().int().positive().optional()
});
