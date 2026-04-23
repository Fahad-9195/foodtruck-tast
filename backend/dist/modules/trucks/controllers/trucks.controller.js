"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trucksController = void 0;
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = require("../../../shared/errors/app-error");
const api_response_1 = require("../../../shared/http/api-response");
const trucks_service_1 = require("../services/trucks.service");
const trucks_validator_1 = require("../validators/trucks.validator");
const assertAuthUser = (req) => {
    if (!req.authUser) {
        throw new app_error_1.AppError("Unauthorized", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    return req.authUser;
};
const registerTruck = async (req, res) => {
    const authUser = assertAuthUser(req);
    const payload = trucks_validator_1.registerTruckSchema.parse(req.body);
    const result = await trucks_service_1.trucksService.registerTruck(authUser, payload);
    res.status(http_status_codes_1.StatusCodes.CREATED).json((0, api_response_1.ok)("Truck registration submitted", result));
};
const updateProfile = async (req, res) => {
    const authUser = assertAuthUser(req);
    const truckId = Number(req.params.truckId);
    const payload = trucks_validator_1.updateTruckProfileSchema.parse(req.body);
    const result = await trucks_service_1.trucksService.updateProfile(truckId, authUser, payload);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Truck profile updated", result));
};
const updateLocation = async (req, res) => {
    const authUser = assertAuthUser(req);
    const truckId = Number(req.params.truckId);
    const payload = trucks_validator_1.updateTruckLocationSchema.parse(req.body);
    const result = await trucks_service_1.trucksService.updateLocation(truckId, authUser, payload);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Truck location updated", result));
};
const updateStatus = async (req, res) => {
    const authUser = assertAuthUser(req);
    const truckId = Number(req.params.truckId);
    const payload = trucks_validator_1.updateTruckStatusSchema.parse(req.body);
    const result = await trucks_service_1.trucksService.updateStatus(truckId, authUser, payload.status);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Truck operational status updated", result));
};
const reviewTruckApproval = async (req, res) => {
    const authUser = assertAuthUser(req);
    const truckId = Number(req.params.truckId);
    const payload = trucks_validator_1.decisionTruckApprovalSchema.parse(req.body);
    const result = await trucks_service_1.trucksService.reviewTruck(truckId, authUser, payload);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Truck review decision applied", result));
};
const listPending = async (req, res) => {
    const authUser = assertAuthUser(req);
    const result = await trucks_service_1.trucksService.listPending(authUser);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Pending trucks fetched", result));
};
const adminStats = async (req, res) => {
    const authUser = assertAuthUser(req);
    const result = await trucks_service_1.trucksService.getAdminStats(authUser);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Admin dashboard stats fetched", result));
};
const discover = async (req, res) => {
    const filters = trucks_validator_1.discoveryQuerySchema.parse(req.query);
    const result = await trucks_service_1.trucksService.discover(filters);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Trucks fetched", result));
};
const details = async (req, res) => {
    const truckId = Number(req.params.truckId);
    const result = await trucks_service_1.trucksService.getDetails(truckId);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Truck details fetched", result));
};
const listMine = async (req, res) => {
    const authUser = assertAuthUser(req);
    const result = await trucks_service_1.trucksService.listMine(authUser);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("My trucks fetched", result));
};
const listMyNotifications = async (req, res) => {
    const authUser = assertAuthUser(req);
    const result = await trucks_service_1.trucksService.listMyNotifications(authUser);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("My notifications fetched", result));
};
const getMyLatestDraft = async (req, res) => {
    const authUser = assertAuthUser(req);
    const result = await trucks_service_1.trucksService.getMyLatestDraft(authUser);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("My latest truck draft fetched", result));
};
const remove = async (req, res) => {
    const authUser = assertAuthUser(req);
    const truckId = Number(req.params.truckId);
    const result = await trucks_service_1.trucksService.removeTruck(truckId, authUser);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Truck deleted", result));
};
exports.trucksController = {
    registerTruck,
    updateProfile,
    updateLocation,
    updateStatus,
    reviewTruckApproval,
    listPending,
    adminStats,
    discover,
    details,
    listMine,
    listMyNotifications,
    getMyLatestDraft,
    remove
};
