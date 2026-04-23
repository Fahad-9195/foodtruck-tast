"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trucksService = void 0;
const http_status_codes_1 = require("http-status-codes");
const roles_1 = require("../../../shared/constants/roles");
const truck_status_1 = require("../../../shared/constants/truck-status");
const app_error_1 = require("../../../shared/errors/app-error");
const trucks_repository_1 = require("../repositories/trucks.repository");
const toSlug = (displayName) => {
    const suffix = Math.floor(Date.now() / 1000);
    return `${displayName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${suffix}`;
};
const toCategorySlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
};
const assertTruckOwner = async (truckId, authUser) => {
    const truck = await trucks_repository_1.trucksRepository.findTruckById(truckId);
    if (!truck) {
        throw new app_error_1.AppError("Truck not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    if (authUser.roleCode === roles_1.ROLE_CODES.ADMIN) {
        return truck;
    }
    if (truck.owner_user_id !== authUser.userId) {
        throw new app_error_1.AppError("You can only manage your own truck", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    return truck;
};
const registerTruck = async (authUser, payload) => {
    if (authUser.roleCode !== roles_1.ROLE_CODES.TRUCK_OWNER) {
        throw new app_error_1.AppError("Only truck owners can register trucks", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const latestTruck = await trucks_repository_1.trucksRepository.getLatestOwnerTruck(authUser.userId);
    if (latestTruck && latestTruck.approval_status === truck_status_1.TRUCK_APPROVAL_STATUS.PENDING) {
        throw new app_error_1.AppError("لديك طلب قيد المراجعة بالفعل. لا يمكنك إرسال طلب جديد قبل صدور قرار الإدارة.", http_status_codes_1.StatusCodes.CONFLICT);
    }
    const existingCategory = await trucks_repository_1.trucksRepository.findCategoryByName(payload.categoryName);
    const categoryId = existingCategory?.id ??
        (await trucks_repository_1.trucksRepository.createCategory({
            name: payload.categoryName.trim(),
            slug: `${toCategorySlug(payload.categoryName)}-${Date.now()}`
        }));
    const truckPayload = {
        ownerUserId: authUser.userId,
        categoryId: Number(categoryId),
        displayName: payload.displayName,
        slug: toSlug(payload.displayName),
        description: payload.description,
        workingHours: payload.workingHours,
        contactPhone: payload.contactPhone,
        coverImageUrl: payload.coverImageUrl,
        latitude: payload.location.latitude,
        longitude: payload.location.longitude,
        neighborhood: payload.location.neighborhood,
        city: payload.location.city,
        licenseNumber: payload.license.licenseNumber,
        licenseDocumentUrl: payload.license.documentUrl,
        licenseExpiresAt: payload.license.expiresAt
    };
    const truckId = latestTruck && latestTruck.approval_status !== truck_status_1.TRUCK_APPROVAL_STATUS.PENDING
        ? await trucks_repository_1.trucksRepository.resubmitRejectedTruck(latestTruck.id, truckPayload)
        : await trucks_repository_1.trucksRepository.createTruckWithLicenseAndLocation(truckPayload);
    return {
        truckId,
        approvalStatus: truck_status_1.TRUCK_APPROVAL_STATUS.PENDING
    };
};
const updateProfile = async (truckId, authUser, payload) => {
    await assertTruckOwner(truckId, authUser);
    await trucks_repository_1.trucksRepository.updateTruckProfile(truckId, payload);
    return {
        truckId
    };
};
const updateLocation = async (truckId, authUser, payload) => {
    const truck = await assertTruckOwner(truckId, authUser);
    if (truck.approval_status !== truck_status_1.TRUCK_APPROVAL_STATUS.APPROVED) {
        throw new app_error_1.AppError("Truck location cannot be updated before approval", http_status_codes_1.StatusCodes.CONFLICT);
    }
    await trucks_repository_1.trucksRepository.replaceCurrentLocation(truckId, payload);
    return {
        truckId
    };
};
const updateStatus = async (truckId, authUser, status) => {
    const truck = await assertTruckOwner(truckId, authUser);
    if (truck.approval_status !== truck_status_1.TRUCK_APPROVAL_STATUS.APPROVED) {
        throw new app_error_1.AppError("Truck status cannot be changed before approval", http_status_codes_1.StatusCodes.CONFLICT);
    }
    await trucks_repository_1.trucksRepository.updateOperationalStatus(truckId, status, authUser.userId);
    return {
        truckId,
        status
    };
};
const reviewTruck = async (truckId, authUser, payload) => {
    if (authUser.roleCode !== roles_1.ROLE_CODES.ADMIN) {
        throw new app_error_1.AppError("Only admins can review truck approvals", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const truck = await trucks_repository_1.trucksRepository.findTruckById(truckId);
    if (!truck) {
        throw new app_error_1.AppError("Truck not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    if (truck.approval_status !== truck_status_1.TRUCK_APPROVAL_STATUS.PENDING) {
        throw new app_error_1.AppError("Truck already reviewed", http_status_codes_1.StatusCodes.CONFLICT);
    }
    if (payload.decision === truck_status_1.TRUCK_APPROVAL_STATUS.REJECTED && !payload.reviewNote?.trim()) {
        throw new app_error_1.AppError("Rejection reason is required", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    await trucks_repository_1.trucksRepository.reviewTruckLicense(truckId, payload.decision, authUser.userId, payload.reviewNote?.trim());
    return {
        truckId,
        approvalStatus: payload.decision
    };
};
const listPending = async (authUser) => {
    if (authUser.roleCode !== roles_1.ROLE_CODES.ADMIN) {
        throw new app_error_1.AppError("Only admins can access pending trucks", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const pendingTrucks = await trucks_repository_1.trucksRepository.listPendingTrucks();
    return {
        items: pendingTrucks
    };
};
const getAdminStats = async (authUser) => {
    if (authUser.roleCode !== roles_1.ROLE_CODES.ADMIN) {
        throw new app_error_1.AppError("Only admins can access admin stats", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const stats = await trucks_repository_1.trucksRepository.getAdminDashboardStats();
    return stats;
};
const discover = async (filters) => {
    const items = await trucks_repository_1.trucksRepository.listDiscoveryTrucks(filters);
    return {
        items
    };
};
const getDetails = async (truckId) => {
    const details = await trucks_repository_1.trucksRepository.getTruckDetailsForCustomer(truckId);
    if (!details) {
        throw new app_error_1.AppError("Truck not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    return details;
};
const listMine = async (authUser) => {
    if (authUser.roleCode !== roles_1.ROLE_CODES.TRUCK_OWNER && authUser.roleCode !== roles_1.ROLE_CODES.ADMIN) {
        throw new app_error_1.AppError("Only truck owners and admins can access this resource", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const items = authUser.roleCode === roles_1.ROLE_CODES.ADMIN
        ? await trucks_repository_1.trucksRepository.listDiscoveryTrucks({})
        : await trucks_repository_1.trucksRepository.listOwnerTrucks(authUser.userId);
    return { items };
};
const listMyNotifications = async (authUser) => {
    if (authUser.roleCode !== roles_1.ROLE_CODES.TRUCK_OWNER) {
        throw new app_error_1.AppError("Only truck owners can access notifications", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const items = await trucks_repository_1.trucksRepository.listOwnerNotifications(authUser.userId);
    return { items };
};
const getMyLatestDraft = async (authUser) => {
    if (authUser.roleCode !== roles_1.ROLE_CODES.TRUCK_OWNER) {
        throw new app_error_1.AppError("Only truck owners can access this resource", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const item = await trucks_repository_1.trucksRepository.getLatestOwnerTruckDraft(authUser.userId);
    return { item: item ?? null };
};
const removeTruck = async (truckId, authUser) => {
    await assertTruckOwner(truckId, authUser);
    await trucks_repository_1.trucksRepository.softDeleteTruck(truckId);
    return { truckId };
};
exports.trucksService = {
    registerTruck,
    updateProfile,
    updateLocation,
    updateStatus,
    reviewTruck,
    listPending,
    getAdminStats,
    discover,
    getDetails,
    listMine,
    listMyNotifications,
    getMyLatestDraft,
    removeTruck
};
