import { Router } from "express";

import { authenticate } from "../../../middlewares/authenticate";
import { authorizeRoles } from "../../../middlewares/authorize-roles";
import { ROLE_CODES } from "../../../shared/constants/roles";
import { asyncHandler } from "../../../shared/utils/async-handler";
import { authController } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/register", asyncHandler(authController.register));
authRouter.post("/login", asyncHandler(authController.login));
authRouter.get("/me", authenticate, asyncHandler(authController.getMe));
authRouter.patch("/me", authenticate, asyncHandler(authController.updateMe));
authRouter.patch("/me/password", authenticate, asyncHandler(authController.changeMyPassword));
authRouter.post("/admin/register", authenticate, authorizeRoles(ROLE_CODES.ADMIN), asyncHandler(authController.createAdmin));

export { authRouter };
