import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorize-roles";
import { ROLE_CODES } from "../shared/constants/roles";
import { asyncHandler } from "../shared/utils/async-handler";
import { trucksController } from "../modules/trucks/controllers/trucks.controller";

const adminRouter = Router();

adminRouter.get("/admin/stats", authenticate, authorizeRoles(ROLE_CODES.ADMIN), asyncHandler(trucksController.adminStats));

export { adminRouter };
