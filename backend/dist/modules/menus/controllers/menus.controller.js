"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menusController = void 0;
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = require("../../../shared/errors/app-error");
const api_response_1 = require("../../../shared/http/api-response");
const menus_service_1 = require("../services/menus.service");
const menus_validator_1 = require("../validators/menus.validator");
const assertAuthUser = (req) => {
    if (!req.authUser) {
        throw new app_error_1.AppError("Unauthorized", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    return req.authUser;
};
const listByTruck = async (req, res) => {
    const authUser = assertAuthUser(req);
    const query = menus_validator_1.listMenuItemsQuerySchema.parse(req.query);
    const result = await menus_service_1.menusService.listByTruck(query.truckId, authUser);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Menu items fetched", result));
};
const listCategories = async (_req, res) => {
    const result = await menus_service_1.menusService.listCategories();
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Menu categories fetched", result));
};
const create = async (req, res) => {
    const authUser = assertAuthUser(req);
    const payload = menus_validator_1.createMenuItemSchema.parse(req.body);
    const result = await menus_service_1.menusService.create(payload, authUser);
    res.status(http_status_codes_1.StatusCodes.CREATED).json((0, api_response_1.ok)("Menu item created", result));
};
const update = async (req, res) => {
    const authUser = assertAuthUser(req);
    const menuItemId = Number(req.params.menuItemId);
    const payload = menus_validator_1.updateMenuItemSchema.parse(req.body);
    const result = await menus_service_1.menusService.update(menuItemId, payload, authUser);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Menu item updated", result));
};
const remove = async (req, res) => {
    const authUser = assertAuthUser(req);
    const menuItemId = Number(req.params.menuItemId);
    const result = await menus_service_1.menusService.remove(menuItemId, authUser);
    res.status(http_status_codes_1.StatusCodes.OK).json((0, api_response_1.ok)("Menu item deleted", result));
};
exports.menusController = {
    listCategories,
    listByTruck,
    create,
    update,
    remove
};
