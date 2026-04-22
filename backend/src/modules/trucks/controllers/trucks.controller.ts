import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { AppError } from "../../../shared/errors/app-error";
import { ok } from "../../../shared/http/api-response";
import { trucksService } from "../services/trucks.service";
import {
  decisionTruckApprovalSchema,
  discoveryQuerySchema,
  registerTruckSchema,
  updateTruckLocationSchema,
  updateTruckProfileSchema,
  updateTruckStatusSchema
} from "../validators/trucks.validator";

const assertAuthUser = (req: Request) => {
  if (!req.authUser) {
    throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
  }

  return req.authUser;
};

const registerTruck = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const payload = registerTruckSchema.parse(req.body);

  const result = await trucksService.registerTruck(authUser, payload);

  res.status(StatusCodes.CREATED).json(ok("Truck registration submitted", result));
};

const updateProfile = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const truckId = Number(req.params.truckId);
  const payload = updateTruckProfileSchema.parse(req.body);

  const result = await trucksService.updateProfile(truckId, authUser, payload);

  res.status(StatusCodes.OK).json(ok("Truck profile updated", result));
};

const updateLocation = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const truckId = Number(req.params.truckId);
  const payload = updateTruckLocationSchema.parse(req.body);

  const result = await trucksService.updateLocation(truckId, authUser, payload);

  res.status(StatusCodes.OK).json(ok("Truck location updated", result));
};

const updateStatus = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const truckId = Number(req.params.truckId);
  const payload = updateTruckStatusSchema.parse(req.body);

  const result = await trucksService.updateStatus(truckId, authUser, payload.status);

  res.status(StatusCodes.OK).json(ok("Truck operational status updated", result));
};

const reviewTruckApproval = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const truckId = Number(req.params.truckId);
  const payload = decisionTruckApprovalSchema.parse(req.body);

  const result = await trucksService.reviewTruck(truckId, authUser, payload);

  res.status(StatusCodes.OK).json(ok("Truck review decision applied", result));
};

const listPending = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const result = await trucksService.listPending(authUser);

  res.status(StatusCodes.OK).json(ok("Pending trucks fetched", result));
};

const adminStats = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const result = await trucksService.getAdminStats(authUser);
  res.status(StatusCodes.OK).json(ok("Admin dashboard stats fetched", result));
};

const discover = async (req: Request, res: Response) => {
  const filters = discoveryQuerySchema.parse(req.query);
  const result = await trucksService.discover(filters);

  res.status(StatusCodes.OK).json(ok("Trucks fetched", result));
};

const details = async (req: Request, res: Response) => {
  const truckId = Number(req.params.truckId);
  const result = await trucksService.getDetails(truckId);

  res.status(StatusCodes.OK).json(ok("Truck details fetched", result));
};

const listMine = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const result = await trucksService.listMine(authUser);

  res.status(StatusCodes.OK).json(ok("My trucks fetched", result));
};

const listMyNotifications = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const result = await trucksService.listMyNotifications(authUser);

  res.status(StatusCodes.OK).json(ok("My notifications fetched", result));
};

const getMyLatestDraft = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const result = await trucksService.getMyLatestDraft(authUser);

  res.status(StatusCodes.OK).json(ok("My latest truck draft fetched", result));
};

const remove = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const truckId = Number(req.params.truckId);
  const result = await trucksService.removeTruck(truckId, authUser);

  res.status(StatusCodes.OK).json(ok("Truck deleted", result));
};

export const trucksController = {
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
