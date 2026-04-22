import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import { env } from "../config/env";
import { AppError } from "../shared/errors/app-error";
import type { AccessTokenPayload } from "../shared/types/auth";

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    throw new AppError("Missing or invalid authorization header", StatusCodes.UNAUTHORIZED);
  }

  const token = authorizationHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
    req.authUser = {
      userId: Number(payload.sub),
      roleCode: payload.roleCode,
      email: payload.email
    };
    next();
  } catch {
    throw new AppError("Invalid or expired token", StatusCodes.UNAUTHORIZED);
  }
};
