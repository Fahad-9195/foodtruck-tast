"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menusService = void 0;
const http_status_codes_1 = require("http-status-codes");
const roles_1 = require("../../../shared/constants/roles");
const app_error_1 = require("../../../shared/errors/app-error");
const trucks_repository_1 = require("../../trucks/repositories/trucks.repository");
const menus_repository_1 = require("../repositories/menus.repository");
const assertManageTruckAccess = async (truckId, authUser) => {
    const truck = await trucks_repository_1.trucksRepository.findTruckById(truckId);
    if (!truck) {
        throw new app_error_1.AppError("Truck not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    if (authUser.roleCode === roles_1.ROLE_CODES.ADMIN) {
        return truck;
    }
    if (authUser.roleCode !== roles_1.ROLE_CODES.TRUCK_OWNER || truck.owner_user_id !== authUser.userId) {
        throw new app_error_1.AppError("You can only manage menu for your own truck", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    return truck;
};
const listByTruck = async (truckId, authUser) => {
    await assertManageTruckAccess(truckId, authUser);
    const items = await menus_repository_1.menusRepository.listByTruck(truckId);
    return { items };
};
const listCategories = async () => {
    const items = await menus_repository_1.menusRepository.listCategories();
    return { items };
};
const create = async (payload, authUser) => {
    await assertManageTruckAccess(payload.truckId, authUser);
    const menuItemId = await menus_repository_1.menusRepository.create(payload);
    return { menuItemId };
};
const update = async (menuItemId, payload, authUser) => {
    const menuItem = await menus_repository_1.menusRepository.findById(menuItemId);
    if (!menuItem) {
        throw new app_error_1.AppError("Menu item not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    await assertManageTruckAccess(Number(menuItem.truck_id), authUser);
    await menus_repository_1.menusRepository.update(menuItemId, payload);
    return { menuItemId };
};
const remove = async (menuItemId, authUser) => {
    const menuItem = await menus_repository_1.menusRepository.findById(menuItemId);
    if (!menuItem) {
        throw new app_error_1.AppError("Menu item not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    await assertManageTruckAccess(Number(menuItem.truck_id), authUser);
    await menus_repository_1.menusRepository.softDelete(menuItemId);
    return { menuItemId };
};
exports.menusService = {
    listCategories,
    listByTruck,
    create,
    update,
    remove
};
