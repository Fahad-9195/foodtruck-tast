import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { AppError } from "../shared/errors/app-error";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    }

    if (!allowedRoles.includes(req.authUser.roleCode)) {
      throw new AppError("Forbidden", StatusCodes.FORBIDDEN);
    }

    next();
  };
};
