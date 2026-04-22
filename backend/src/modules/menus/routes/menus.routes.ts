import { Router } from "express";

import { authenticate } from "../../../middlewares/authenticate";
import { authorizeRoles } from "../../../middlewares/authorize-roles";
import { ROLE_CODES } from "../../../shared/constants/roles";
import { asyncHandler } from "../../../shared/utils/async-handler";
import { menusController } from "../controllers/menus.controller";

const menusRouter = Router();

menusRouter.use(authenticate);
menusRouter.use(authorizeRoles(ROLE_CODES.TRUCK_OWNER, ROLE_CODES.ADMIN));

menusRouter.get("/categories", asyncHandler(menusController.listCategories));
menusRouter.get("/", asyncHandler(menusController.listByTruck));
menusRouter.post("/", asyncHandler(menusController.create));
menusRouter.patch("/:menuItemId", asyncHandler(menusController.update));
menusRouter.delete("/:menuItemId", asyncHandler(menusController.remove));

export { menusRouter };
