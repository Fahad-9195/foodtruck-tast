import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { AppError } from "../../../shared/errors/app-error";
import { ok } from "../../../shared/http/api-response";
import { menusService } from "../services/menus.service";
import { createMenuItemSchema, listMenuItemsQuerySchema, updateMenuItemSchema } from "../validators/menus.validator";

const assertAuthUser = (req: Request) => {
  if (!req.authUser) {
    throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
  }

  return req.authUser;
};

const listByTruck = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const query = listMenuItemsQuerySchema.parse(req.query);
  const result = await menusService.listByTruck(query.truckId, authUser);

  res.status(StatusCodes.OK).json(ok("Menu items fetched", result));
};

const listCategories = async (_req: Request, res: Response) => {
  const result = await menusService.listCategories();
  res.status(StatusCodes.OK).json(ok("Menu categories fetched", result));
};

const create = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const payload = createMenuItemSchema.parse(req.body);
  const result = await menusService.create(payload, authUser);

  res.status(StatusCodes.CREATED).json(ok("Menu item created", result));
};

const update = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const menuItemId = Number(req.params.menuItemId);
  const payload = updateMenuItemSchema.parse(req.body);
  const result = await menusService.update(menuItemId, payload, authUser);

  res.status(StatusCodes.OK).json(ok("Menu item updated", result));
};

const remove = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const menuItemId = Number(req.params.menuItemId);
  const result = await menusService.remove(menuItemId, authUser);

  res.status(StatusCodes.OK).json(ok("Menu item deleted", result));
};

export const menusController = {
  listCategories,
  listByTruck,
  create,
  update,
  remove
};
