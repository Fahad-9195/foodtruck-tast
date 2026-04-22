import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import { AppError } from "../shared/errors/app-error";
import { fail } from "../shared/http/api-response";
import { logger } from "../shared/logger/logger";

const isDuplicateEntryError = (error: unknown): error is { code: string } => {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "ER_DUP_ENTRY";
};

const getDuplicateEntryMessage = (error: unknown): string => {
  const rawMessage = typeof error === "object" && error !== null && "sqlMessage" in error ? String((error as { sqlMessage?: string }).sqlMessage ?? "") : "";

  if (rawMessage.includes("users.email")) {
    return "البريد الإلكتروني مستخدم مسبقًا.";
  }
  if (rawMessage.includes("users.phone")) {
    return "رقم الجوال مستخدم مسبقًا.";
  }
  if (rawMessage.includes("municipal_licenses.license_number")) {
    return "رقم الرخصة مستخدم مسبقًا لطلب آخر.";
  }
  if (rawMessage.includes("food_trucks.slug")) {
    return "اسم الفود ترك مستخدم مسبقًا، جرّب اسمًا مختلفًا.";
  }

  return "يوجد بيانات مكررة لا يمكن حفظها.";
};

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  if (error instanceof ZodError) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(fail("Validation failed", error.flatten()));
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json(fail(error.message, error.details));
    return;
  }

  if (isDuplicateEntryError(error)) {
    res.status(StatusCodes.CONFLICT).json(fail(getDuplicateEntryMessage(error)));
    return;
  }

  logger.error({ error }, "Unhandled error");
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(fail("Internal server error"));
};
