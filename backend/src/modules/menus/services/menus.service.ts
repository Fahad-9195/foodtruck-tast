import { StatusCodes } from "http-status-codes";

import { ROLE_CODES } from "../../../shared/constants/roles";
import { AppError } from "../../../shared/errors/app-error";
import type { AuthUser } from "../../../shared/types/auth";
import { trucksRepository } from "../../trucks/repositories/trucks.repository";
import { menusRepository } from "../repositories/menus.repository";

const assertManageTruckAccess = async (truckId: number, authUser: AuthUser) => {
  const truck = await trucksRepository.findTruckById(truckId);
  if (!truck) {
    throw new AppError("Truck not found", StatusCodes.NOT_FOUND);
  }

  if (authUser.roleCode === ROLE_CODES.ADMIN) {
    return truck;
  }

  if (authUser.roleCode !== ROLE_CODES.TRUCK_OWNER || truck.owner_user_id !== authUser.userId) {
    throw new AppError("You can only manage menu for your own truck", StatusCodes.FORBIDDEN);
  }

  return truck;
};

const listByTruck = async (truckId: number, authUser: AuthUser) => {
  await assertManageTruckAccess(truckId, authUser);
  const items = await menusRepository.listByTruck(truckId);
  return { items };
};

const listCategories = async () => {
  const items = await menusRepository.listCategories();
  return { items };
};

const create = async (
  payload: {
    truckId: number;
    categoryId: number;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable: boolean;
  },
  authUser: AuthUser
) => {
  await assertManageTruckAccess(payload.truckId, authUser);
  const menuItemId = await menusRepository.create(payload);
  return { menuItemId };
};

const update = async (
  menuItemId: number,
  payload: {
    categoryId?: number;
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    isAvailable?: boolean;
  },
  authUser: AuthUser
) => {
  const menuItem = await menusRepository.findById(menuItemId);
  if (!menuItem) {
    throw new AppError("Menu item not found", StatusCodes.NOT_FOUND);
  }

  await assertManageTruckAccess(Number(menuItem.truck_id), authUser);
  await menusRepository.update(menuItemId, payload);
  return { menuItemId };
};

const remove = async (menuItemId: number, authUser: AuthUser) => {
  const menuItem = await menusRepository.findById(menuItemId);
  if (!menuItem) {
    throw new AppError("Menu item not found", StatusCodes.NOT_FOUND);
  }

  await assertManageTruckAccess(Number(menuItem.truck_id), authUser);
  await menusRepository.softDelete(menuItemId);
  return { menuItemId };
};

export const menusService = {
  listCategories,
  listByTruck,
  create,
  update,
  remove
};
