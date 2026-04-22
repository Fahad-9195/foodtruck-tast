import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { AppError } from "../../../shared/errors/app-error";
import { ok } from "../../../shared/http/api-response";
import { authService } from "../services/auth.service";
import { changePasswordSchema, createAdminSchema, loginSchema, registerSchema, updateProfileSchema } from "../validators/auth.validator";

const register = async (req: Request, res: Response) => {
  const payload = registerSchema.parse(req.body);
  const result = await authService.register(payload);

  res.status(StatusCodes.CREATED).json(ok("Registration successful", result));
};

const login = async (req: Request, res: Response) => {
  const payload = loginSchema.parse(req.body);
  const result = await authService.login(payload);

  res.status(StatusCodes.OK).json(ok("Login successful", result));
};

const getMe = async (req: Request, res: Response) => {
  if (!req.authUser) {
    throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
  }

  const result = await authService.getMe(req.authUser.userId);
  res.status(StatusCodes.OK).json(ok("Profile loaded", result));
};

const updateMe = async (req: Request, res: Response) => {
  if (!req.authUser) {
    throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
  }

  const payload = updateProfileSchema.parse(req.body);
  const result = await authService.updateMe(req.authUser.userId, payload);
  res.status(StatusCodes.OK).json(ok("Profile updated", result));
};

const changeMyPassword = async (req: Request, res: Response) => {
  if (!req.authUser) {
    throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
  }

  const payload = changePasswordSchema.parse(req.body);
  await authService.changeMyPassword(req.authUser.userId, payload);
  res.status(StatusCodes.OK).json(ok("Password updated", null));
};

const createAdmin = async (req: Request, res: Response) => {
  const payload = createAdminSchema.parse(req.body);
  const result = await authService.createAdmin(payload);
  res.status(StatusCodes.CREATED).json(ok("Admin account created", result));
};

export const authController = {
  register,
  login,
  getMe,
  updateMe,
  changeMyPassword,
  createAdmin
};
