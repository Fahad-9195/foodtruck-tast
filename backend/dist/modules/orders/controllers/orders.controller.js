"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersController = void 0;
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = require("../../../shared/errors/app-error");
const api_response_1 = require("../../../shared/http/api-response");
const orders_service_1 = require("../services/orders.service");
const orders_validator_1 = require("../validators/orders.validator");
const assertAuthUser = (req) => {
    if (!req.authUser) {
        throw new app_error_1.AppError("Unauthorized", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    return req.authUser;
};
const create = async (req, res) => {
    const authUser = assertAuthUser(req);
    const payload = orders_validator_1.createOrderSchema.parse(req.body);
    const result = await orders_service_1.ordersService.createOrder(authUser, payload);
    res.status(http_status_codes_1.StatusCodes.CREATED).json((0, api_response_1.ok)("Pickup order placed", result));
};
const listMyOrders = async (req, res) => {
    const authUser = assertAuthUser(req);
    const result = await orders_service_1.ordersService.listMyOrders(authUser);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Customer pickup orders fetched", result));
};
const listMyNotifications = async (req, res) => {
    const authUser = assertAuthUser(req);
    const result = await orders_service_1.ordersService.listMyNotifications(authUser);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Customer order notifications fetched", result));
};
const listIncoming = async (req, res) => {
    const authUser = assertAuthUser(req);
    const result = await orders_service_1.ordersService.listIncomingOrders(authUser);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Incoming pickup orders fetched", result));
};
const updateStatus = async (req, res) => {
    const authUser = assertAuthUser(req);
    const orderId = Number(req.params.orderId);
    const payload = orders_validator_1.updateOrderStatusSchema.parse(req.body);
    const result = await orders_service_1.ordersService.updateOrderStatus(orderId, payload.status, authUser);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Order status updated", result));
};
const submitReview = async (req, res) => {
    const authUser = assertAuthUser(req);
    const orderId = Number(req.params.orderId);
    const payload = orders_validator_1.createOrderReviewSchema.parse(req.body);
    const result = await orders_service_1.ordersService.createOrderReview(authUser, orderId, payload);
    res.status(http_status_codes_1.StatusCodes.CREATED).json((0, api_response_1.ok)("Order review submitted", result));
};
const payOrder = async (req, res) => {
    const authUser = assertAuthUser(req);
    const orderId = Number(req.params.orderId);
    const payload = orders_validator_1.createOrderPaymentSchema.parse(req.body);
    const result = await orders_service_1.ordersService.createOrderPayment(authUser, orderId, payload);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Order payment processed", result));
};
exports.ordersController = {
    create,
    listMyOrders,
    listMyNotifications,
    listIncoming,
    updateStatus,
    submitReview,
    payOrder
};
