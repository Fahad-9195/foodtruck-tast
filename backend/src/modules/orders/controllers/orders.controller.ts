import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { AppError } from "../../../shared/errors/app-error";
import { ok } from "../../../shared/http/api-response";
import { ordersService } from "../services/orders.service";
import {
  createOrderPaymentSchema,
  createOrderReviewSchema,
  createOrderSchema,
  updateOrderStatusSchema
} from "../validators/orders.validator";

const assertAuthUser = (req: Request) => {
  if (!req.authUser) {
    throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
  }
  return req.authUser;
};

const create = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const payload = createOrderSchema.parse(req.body);
  const result = await ordersService.createOrder(authUser, payload);

  res.status(StatusCodes.CREATED).json(ok("Pickup order placed", result));
};

const listMyOrders = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const result = await ordersService.listMyOrders(authUser);
  res.status(StatusCodes.OK).json(ok("Customer pickup orders fetched", result));
};

const listMyNotifications = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const result = await ordersService.listMyNotifications(authUser);
  res.status(StatusCodes.OK).json(ok("Customer order notifications fetched", result));
};

const listIncoming = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const result = await ordersService.listIncomingOrders(authUser);
  res.status(StatusCodes.OK).json(ok("Incoming pickup orders fetched", result));
};

const updateStatus = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const orderId = Number(req.params.orderId);
  const payload = updateOrderStatusSchema.parse(req.body);
  const result = await ordersService.updateOrderStatus(orderId, payload.status, authUser);
  res.status(StatusCodes.OK).json(ok("Order status updated", result));
};

const submitReview = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const orderId = Number(req.params.orderId);
  const payload = createOrderReviewSchema.parse(req.body);
  const result = await ordersService.createOrderReview(authUser, orderId, payload);
  res.status(StatusCodes.CREATED).json(ok("Order review submitted", result));
};

const payOrder = async (req: Request, res: Response) => {
  const authUser = assertAuthUser(req);
  const orderId = Number(req.params.orderId);
  const payload = createOrderPaymentSchema.parse(req.body);
  const result = await ordersService.createOrderPayment(authUser, orderId, payload);
  res.status(StatusCodes.OK).json(ok("Order payment processed", result));
};

export const ordersController = {
  create,
  listMyOrders,
  listMyNotifications,
  listIncoming,
  updateStatus,
  submitReview,
  payOrder
};
