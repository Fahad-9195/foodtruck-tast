import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { fail } from "../shared/http/api-response";

export const notFoundHandler = (_req: Request, res: Response, _next: NextFunction): void => {
  res.status(StatusCodes.NOT_FOUND).json(fail("Route not found"));
};
